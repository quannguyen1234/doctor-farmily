from django.db import models
from django.core.exceptions import ValidationError
from apps.User.models import BaseUser,Doctor,Patient
from core.references import StatusTransactionEnum,TypeTransactionEnum,PaymentMethodEnum,DiagnosticFormEnum,HistoryPaymentEnum
import uuid
from core.references import FEE_DISTANCE
import datetime


import random
def generate_character(length:int):
    s=''
    for i in range(length):
        s+=str(random.randint(0,9))
    return s

# Create your models here.
class Wallet(models.Model):
    class Meta:
        constraints=[
            models.CheckConstraint(check=models.Q(available_amount__gte=0), name='available_amount_gte_0') ,
            models.UniqueConstraint(
                name="unique_wallet_person",
                fields=["base_user"],
            )

        ]
    wallet_id=models.CharField(primary_key=True,max_length=8)
    base_user=models.OneToOneField(BaseUser,null=False,on_delete=models.CASCADE,related_name='wallet')
    available_amount=models.FloatField(default=0,null=False)

    classmethod
    def check_id(cls,wallet_id):
        if cls.objects.filter(wallet_id=wallet_id).exists():
            return True
        return False
    
    @classmethod
    def generate_id(cls):
        while True:
            id=generate_character(8)
            if not Transaction.check_id(id):    
                return id
            
    def transfer_money(self,fee,to_wallet):
        if self.available_amount<fee:
            raise ValueError("dont enough Money")
        
        self.available_amount-=fee
        to_wallet.available_amount+=fee
        to_wallet.save()
        self.save()


        #transaction for own 
        Transaction.objects.create(
            transaction_id=Transaction.generate_id(),
            base_user=self.base_user,
            amount=fee,
            detail=' ',
            status=StatusTransactionEnum.MONEY_OUT.value,
            transaction_type=TypeTransactionEnum.TRANSFER_MONEY.value,
            payment_method=PaymentMethodEnum.BANKING.value
        )

        #transaction for destination 
        Transaction.objects.create(
            transaction_id=Transaction.generate_id(),
            base_user=to_wallet.base_user,
            amount=fee,
            detail=' ',
            status=StatusTransactionEnum.MONEY_IN.value,
            transaction_type=TypeTransactionEnum.RECIEVE_MONEY.value,
            payment_method=PaymentMethodEnum.BANKING.value
        )
        
        def __str__(self):
            return f"Wallet ID: {self.wallet_id} -{self.base_user.user_type}"

    

class DiagnosticBill(models.Model):
    class Meta:
        db_table="DiagnosticBill"

    doctor=models.ForeignKey(Doctor,null=True,on_delete=models.SET_NULL)
    patient=models.ForeignKey(Patient,null=True,on_delete=models.SET_NULL)
    created = models.DateTimeField(auto_now_add=True)
    pay_time= models.DateTimeField(null=True)
    diagnostic_form=models.BooleanField(max_length=32,choices=DiagnosticFormEnum.__tupple__())
    is_pay=models.BooleanField(default=False)


class DiagnosticBillDetail(models.Model):
    class Meta:
        db_table="DiagnosticBillDetail"
        constraints=[
            models.CheckConstraint(check=models.Q(distance__gte=0), name='distance_gte_0') ,
            models.CheckConstraint(check=models.Q(doctor_fee__gte=0), name='doctor_fee_gte_0') ,
          
        ]
        
    id=models.CharField(primary_key=True,max_length=36,default = uuid.uuid4)
    bill=models.OneToOneField(DiagnosticBill,on_delete=models.CASCADE,null=False,related_name='detail')
    distance=models.FloatField(default=0)
    doctor_fee=models.FloatField(default=0)
    fee_distance_per_one=models.FloatField(default=0)
    total_fee=models.FloatField(default=0,editable=False)
    
    # class method because of uneditable total_fee attribute 
    @classmethod
    def get_total_fee(cls,distance,fee_distance_per_one,doctor_fee):
        return distance*fee_distance_per_one +doctor_fee
    
def validate_month_year(value):
    current_date = value
    if current_date.month != datetime.date.today().month or current_date.year != datetime.date.today().year:
        raise ValidationError("Only dates in the current month and year are allowed.")

class Report(models.Model):
    # class Meta:
        
    holding_amount=models.FloatField(default=0)
    pay_doctor_amount=models.FloatField(default=0)
    profit=models.FloatField(default=0)
    revenue=models.FloatField(default=0)
    date=models.DateField(default=datetime.date.today, validators=[validate_month_year])
# dont care
class Transaction(models.Model):
    class Meta:
        constraints=[
            models.CheckConstraint(check=models.Q(amount__gte=0), name='transaction_amount_gte_0') ,
        ]
    transaction_id=models.CharField(max_length=8,primary_key=True)
    base_user=models.ForeignKey(BaseUser,on_delete=models.SET_NULL,null=True,related_name='transactiom_from_user')
    to_user=models.ForeignKey(BaseUser,on_delete=models.SET_NULL,null=True,related_name='transactiom_to_user')
    amount=models.FloatField(default=0,null=False)
    detail=models.TextField(default='')
    date=models.DateTimeField(auto_now=True)
    status=models.BooleanField(default=False) # true is the money in , otherwise money  out
    transaction_type=models.CharField(choices=TypeTransactionEnum.__tupple__(),max_length=32)
    payment_method=models.CharField(max_length=32,choices=PaymentMethodEnum.__tupple__())
    # 
    
    @classmethod
    def check_id(cls,transaction_id):
        if cls.objects.filter(transaction_id=transaction_id).exists():
            return True
        return False
    
    @classmethod
    def generate_id(cls):
        while True:
            id=generate_character(8)
            if not Transaction.check_id(id):    
                return id
# dont care 

class HistoryPayment(models.Model):
    from_user=models.ForeignKey(BaseUser,on_delete=models.SET_NULL,null=True,related_name='history_from_user')
    to_user=models.ForeignKey(BaseUser,on_delete=models.SET_NULL,null=True,related_name='history_to_user')
    disagnostic_bill=models.ForeignKey(DiagnosticBill,on_delete=models.SET_NULL,null=True)
    message=models.TextField(null=True)
    amount=models.FloatField(default=0)
    type=models.IntegerField(choices=HistoryPaymentEnum.__tupple__())
    date=models.DateTimeField(auto_now_add=True)
    amount_from_user=models.FloatField(default=0)
    amount_to_user=models.FloatField(default=0)
    
    