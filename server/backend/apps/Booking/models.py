from apps.Transaction.models import DiagnosticBill
from django.db import models
from apps.User.models import Patient,Doctor
import uuid,datetime

# Create your models here.
class ConnectDoctor(models.Model):
    class Meta:
        constraints=[
            models.UniqueConstraint(fields=['doctor','patient'],name='unique_conversation')
        ]
    doctor=models.ForeignKey(Doctor,on_delete=models.CASCADE,unique=True)
    doctor_channel=models.TextField()
    patient=models.ForeignKey(Patient,on_delete=models.CASCADE,null=True,unique=True)
    patient_channel=models.TextField(null=True)
    is_confirm=models.BooleanField(default=False)
    fee=models.FloatField(default=0)
    distance=models.FloatField(default=0)
    diagnostic_bill=models.OneToOneField(DiagnosticBill,on_delete=models.CASCADE,null=True)
    zoom_link=models.TextField(null=True)



class Calender(models.Model):
    class Meta:
        db_table="Calender"
        constraints=[
            models.CheckConstraint(check=models.Q(from_time__lt=models.F("to_time")),name='check_fromtime_lt_totime')
        ]

    
        
    def full_clean(self, *agrs,**kwagrs) -> None:
        
        # calenders=Calender.objects.filter(date=self.date,doctor=self.doctor)
        # for calender in calenders:
            
        #     if calender.calender_id==self.calender_id:
        #         continue
            
        #     if  self.from_time >=calender.from_time and  self.from_time<=calender.to_time:
        #         raise ValueError("error time")
            
        #     if  self.to_time >=calender.from_time and  self.to_time<=calender.to_time:
        #         raise ValueError("error time")
            
        return super().full_clean( *agrs,**kwagrs)
    
    calender_id=models.CharField(primary_key=True,max_length=36,default=uuid.uuid4)
    date=models.DateField(default=datetime.date.today)
    patient=models.ForeignKey(Patient,null=True,on_delete=models.CASCADE)
    doctor=models.ForeignKey(Doctor,null=False,on_delete=models.CASCADE)
    is_book=models.BooleanField(default=False)
    from_time=models.TimeField()
    to_time=models.TimeField()
    patient_address=models.TextField(null=True)
    patient_phone_number=models.CharField(max_length=12,default='')
    


class Rating(models.Model):
    class Meta:
        db_table="Rating"
    
    patient=models.ForeignKey(Patient,null=True,on_delete=models.CASCADE)
    doctor=models.ForeignKey(Doctor,null=False,on_delete=models.CASCADE,related_name='doctor_ratings')
    star=models.IntegerField(default=1)
    note=models.TextField(null=True)
        
    
class MedicalExaminationNotice(models.Model):
    doctor=models.ForeignKey(Doctor,on_delete=models.CASCADE)
    patient=models.ForeignKey(Patient,on_delete=models.CASCADE)
    patient_address=models.TextField(default='')
    patient_phone_number=models.CharField(max_length=12)
    date=models.DateTimeField()
    fee=models.FloatField(default=0)
