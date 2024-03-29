from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser,PermissionsMixin
)
from django.contrib.auth.hashers import identify_hasher
import uuid
import regex,datetime
from .references import USER_TYPE 
from .references import GENDER
from .functions import generate_id
import datetime
from core.references import ImageEnum,AddressEnum
class BaseUserManager(BaseUserManager):
    def create_user(self,phone_number, email, firstname, password=None):
        """
        Creates and saves a User with the given email, date of
        birth and password.
        """
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            phone_number=phone_number,
            email=self.normalize_email(email),
            password=password,
            firstname=firstname,
        )
        user.save(using=self._db)
        return user

    def create_superuser(self,phone_number, email, firstname, password=None):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        if not email:
            raise ValueError('Users must have an email address')
        
        user = self.model(
            phone_number=phone_number,
            email=self.normalize_email(email),
            password=password,
            firstname=firstname,
        )
        user.is_superuser = True
        user.set_password(password)
        user.save(using=self._db)
        
        return user
    
class MyUserManager:
    def active_user(self):
        self.is_active=True
        self.save()

    def inactive_user(self):
        self.is_active=False
        self.save()
        
class BaseUser(MyUserManager,PermissionsMixin,AbstractBaseUser):
    class Meta:
        db_table="BaseUser"
        
    id=models.CharField(primary_key=True,max_length=36,default = uuid.uuid4)
    phone_number=models.CharField(max_length=20,unique=True)
    email = models.CharField(
        verbose_name='email address',
        max_length=100,unique=True,
        null=True
    )
    citizen_identification=models.CharField(max_length=12,unique=True,null=True)
    surname=models.CharField(max_length=30,null=True,default="",blank=True)
    firstname=models.CharField(max_length=20,null=True,default="",blank=True)
    gender=models.BooleanField(choices=GENDER,null=True)
    is_active = models.BooleanField(default=True)
    user_type=models.SmallIntegerField(choices=USER_TYPE,null=True)
    birth_day=models.DateField(null=True)
    created=models.DateField(auto_now=True)
  
    

    objects = BaseUserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['phone_number','firstname']
    

    
        
    def clean(self):        
        if regex.match("^.+@.+\..+$",self.email) is  None:
            raise ValidationError("Email is not valid ",code="error_email_not_valid")
        return super().clean()
        
    @property   
    def get_full_name(self):
        try:
            return self.surname +" "+self.firstname
        except:
            return ""
    
    @property
    def current_address(self):
        try:
            return self.addresses.filter(address_type=AddressEnum.CurrentAddress.value)[0]
        except:
            return None
    
    @property
    def living_address(self):
        try:
            return self.addresses.filter(address_type=AddressEnum.LivingAdress.value)[0]
        except:
            return None
        
    @property
    def avatar(self):
        try:
            return self.images.filter(image_type=ImageEnum.Avatar.value).values_list('url', flat=True)[0]
        except:
            return None  
             
    def save(self,*args,**kwagrs):

        if self.surname is not None:
            self.surname=self.surname.title()

        if self.firstname is not None:
            self.firstname=self.firstname.title()
            
            
        
        return super().save(*args,**kwagrs)
    
        
    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_superuser

from django.db.models.signals import post_save 
from django.dispatch import receiver
@receiver(post_save, sender=BaseUser)
def delete_image(sender, instance, created, **kwargs):
    if created:
        from apps.Transaction.models import Wallet
        Wallet.objects.create(wallet_id=Wallet.generate_id(),base_user=instance)
        

class Doctor(models.Model):

    class Meta:
        db_table="Doctor"
        constraints=[
            models.CheckConstraint(check=models.Q(diagnostic_fee__gte=0), name='diagnostic_fee_gte_0') ,
        ]

    doctor_id=models.CharField(max_length=10,primary_key=True)
    degree=models.CharField(max_length=20,null=False,default="")
    current_job=models.TextField(null=False,default="")
    expreience=models.TextField(null=False,default="")
    base_user=models.OneToOneField(BaseUser,related_name="user_doctor",on_delete=models.CASCADE)
    is_receive=models.BooleanField(default=False)
    diagnostic_fee=models.FloatField(null=True,default=0)
    def __str__(self) -> str:
        try:
            return f"{self.doctor_id}-{self.base_user.get_full_name}"  
        except:
            return "No Name"
        
    def get_id(self):
        return self.doctor_id
    
    
    @staticmethod
    def generate_doctor_id():
        id=generate_id(10)
        while Doctor.objects.filter(doctor_id=id).exists():
            id=generate_id(10)
        return id

    @property
    def notarized_images(self):
        return self.base_user.images.filter(image_type=ImageEnum.DoctorNotarizedImage.value).values_list('url', flat=True)
    
    

class Patient(models.Model):

    class Meta:
        db_table="Patient"

    patient_id=models.CharField(max_length=10,primary_key=True)
    base_user=models.OneToOneField(BaseUser,related_name="user_patient",on_delete=models.CASCADE)

    def __str__(self) -> str:
        try:
            return f"{self.patient_id}-{self.base_user.get_full_name}"  
        except:
            return "No Name"

    def get_id(self):
        return self.patient_id

    

    @staticmethod
    def generate_patient_id():
        patient_id=generate_id(10)
        while Patient.objects.filter(patient_id=patient_id).exists():
            patient_id=generate_id(10)
        return patient_id


   
class Admin(models.Model):

    class Meta:
        db_table="Admin"

    admin_id=models.CharField(max_length=10,primary_key=True)
    base_user=models.OneToOneField(BaseUser,related_name="user_admin",on_delete=models.CASCADE)

    def __str__(self) -> str:
        try:
            return f"{self.admin_id}-{self.base_user.get_full_name}"  
        except:
            return "No Name"

    def get_id(self):
        return self.admin_id