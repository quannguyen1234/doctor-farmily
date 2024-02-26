from rest_framework import serializers
from apps.User.models import Doctor,Patient
from .models import DiagnosticBill ,DiagnosticBillDetail,HistoryPayment
from core.references import FEE_DISTANCE,DiagnosticFormEnum,HistoryPaymentEnum
from django.db.transaction import atomic
from apps.User.references import RELATED_USER
class DiagnosticBillDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model=DiagnosticBillDetail
        fields=[
            'id','distance','fee_distance_per_one','doctor_fee','total_fee'
        ]
        extra_kwargs = {
            'bill': {'write_only':True },
          
        }

    
    
    
class DiagnosticBillSerializer(serializers.ModelSerializer):
    class Meta:
        model=DiagnosticBill
        fields=[
            'doctor_id','doctor_name','patient_id','patient_name','created','diagnostic_form','detail',
        ]
        
    doctor_id=serializers.CharField(source='doctor.doctor_id')
    doctor_name=serializers.CharField(source='doctor.base_user.get_full_name',read_only=True)
    patient_id=serializers.CharField(source='patient.patient_id')
    patient_name=serializers.CharField(source='patient.base_user.get_full_name',read_only=True)
    detail=DiagnosticBillDetailSerializer()

    def validate(self, attrs):
        print(attrs)
        return super().validate(attrs)
    
    @atomic
    def create(self, validated_data):
        doctor=Doctor.objects.get(doctor_id=validated_data['doctor']['doctor_id'])
        patient=Patient.objects.get(patient_id=validated_data['patient']['patient_id'])
        
        bill=DiagnosticBill.objects.create(
            doctor=doctor,
            patient=patient,
            diagnostic_form=DiagnosticFormEnum.ONLINE.value,
         
        )
        
        DiagnosticBillDetail.objects.create(
            distance=validated_data['detail']['distance'],
            doctor_fee=validated_data['detail']['doctor_fee'],
            bill=bill
        )
        
        return bill


class HistoryPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model=HistoryPayment
        fields=['sender','name_sender','name_receiver',
                'receiver','date','time','disagnostic_bill_id','message','amount','type',
                'amount_from_user','amount_to_user'
                
        ]

    sender=serializers.SerializerMethodField()
    receiver=serializers.SerializerMethodField()
    disagnostic_bill_id=serializers.SerializerMethodField()
    name_sender=serializers.SerializerMethodField()
    name_receiver=serializers.SerializerMethodField()
    date=serializers.SerializerMethodField()
    time=serializers.SerializerMethodField()
    type=serializers.SerializerMethodField()

    def get_date(self,instance):
        date=instance.date
        return f"{date.day}-{date.month}-{date.year}"
    
    def get_time(self,instance):
        date=instance.date
        return f"{date.hour}:{date.minute}"
    
    def get_sender(self,instance):
        user=getattr(instance.from_user,RELATED_USER[instance.from_user.user_type])
        return user.get_id()
        
    def get_receiver(self,instance):
        user=getattr(instance.to_user,RELATED_USER[instance.to_user.user_type])
        return user.get_id()
        
    
    
    def get_name_sender(self,instance):
        return instance.from_user.get_full_name
        
    def get_name_receiver(self,instance):
        return instance.to_user.get_full_name

    def get_disagnostic_bill_id(self,instance):
        return instance.disagnostic_bill.id
    
    def get_type(self,instance):
        return HistoryPaymentEnum.get_key_by_value(instance.type)
    
    
