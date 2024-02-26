from rest_framework import serializers
from apps.User.models import Doctor,Patient
from .models import Calender,Rating
from core.references import AddressEnum,ImageEnum
from rest_framework.exceptions import  ValidationError
from .functions import get_mean_star
# from apps.Booking.views import get_mean_star
class DoctorAppointmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Doctor
        fields=['doctor_id','full_name','departments','address','diagnostic_fee','avatar','mean_star']

    full_name=serializers.SerializerMethodField()
    departments=serializers.SerializerMethodField()
    address=serializers.SerializerMethodField()
    avatar=serializers.SerializerMethodField()
    mean_star=serializers.SerializerMethodField()

        
    def get_full_name(self,instance):
        return instance.base_user.get_full_name
    
    def get_departments(self,instance):
        
        departments=instance.departments.all()
        dict_de=[]
        for de in departments:
            dict_de.append({
                'id':de.de_id,
                'name':de.name
            })
        return dict_de
    def get_mean_star(self,instance):

        return get_mean_star(instance)
    
    def get_address(self,instance):

        return instance.base_user.addresses.get(
            address_type=AddressEnum.CurrentAddress.value
        ).full_address
       
    def get_avatar(self,instance):
        try:
            return instance.base_user.images.get(
                image_type=ImageEnum.Avatar.value
            ).url
        except:
            return None
    

        
class DoctorAppointmentCalenderSerializer(serializers.ModelSerializer):
    class Meta:
        model=Calender
        fields=['calender_id','date','patient_id','doctor_id','doctor_name','is_book','from_time','to_time','patient_address','patient_phone_number']
    
    date=serializers.DateField(format='%d-%m-%Y',input_formats=['%d-%m-%Y'])
    patient_id=serializers.PrimaryKeyRelatedField(queryset=Patient.objects.all(),source='patient',required=False)
    doctor_id=serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all(),source='doctor')
    doctor_name=serializers.CharField(source='doctor.base_user.get_full_name',read_only=True)
    

    
    
    def validate(self, attrs):
        clone_attrs=dict(attrs)
       
        calenders=Calender.objects.filter(date=clone_attrs['date'],doctor=clone_attrs['doctor'])
        for calender in calenders:
            if  clone_attrs['from_time'] >calender.from_time and  clone_attrs['from_time']<calender.to_time:
                raise ValidationError({"from_time":"error time"})
                
            if  clone_attrs['to_time'] >calender.from_time and  clone_attrs['to_time']<calender.to_time:
                raise ValidationError({"to_time":"error time"})
            
        return super().validate(attrs)
    
class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model=Rating
        fields=['patient_id','doctor_id','star','note','avatar']

    patient_id=serializers.PrimaryKeyRelatedField(queryset=Patient.objects.all(),source='patient')
    doctor_id=serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all(),source='doctor')
    avatar=serializers.SerializerMethodField()

    def get_avatar(self,instance):
        return instance.patient.base_user.avatar
    

    