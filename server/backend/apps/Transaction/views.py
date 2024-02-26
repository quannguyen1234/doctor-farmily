from rest_framework.viewsets import ModelViewSet,GenericViewSet
from rest_framework.decorators import api_view,permission_classes
from .serializers import DiagnosticBillSerializer,HistoryPaymentSerializer
from rest_framework.decorators import action
from .models import DiagnosticBill,DiagnosticBillDetail,Transaction,Report,HistoryPayment
from apps.User.models import BaseUser,Admin
from .models import Wallet
from channels.db import database_sync_to_async
from django.http import JsonResponse
from django.db.transaction import atomic
from django.db.models import Q
from rest_framework import response,status
from core.utils import is_valid
from core.references import FEE_DISTANCE,HistoryPaymentEnum
import datetime
from collections import OrderedDict
from apps.User.permission import IsAdmin,IsDoctor,IsPatient
from rest_framework.permissions import IsAuthenticated

class CheckAmount:
    
    def __init__(self,base_user) -> None:
        self.base_user=base_user
        self.wallet=None

    def set_wallet(self):
        try:
            wallet=Wallet.objects.get(base_user=self.base_user)
            self.wallet=wallet
        except:
            pass

    def check_amount(self,fee):
        if self.wallet.available_amount>=fee:
            return True
        return False
    
class CheckAmountAysnc(CheckAmount):

    
    def __init__(self, base_user) -> None:
        super().__init__(base_user)
        
    @database_sync_to_async
    def check_amount(self, fee):
        return super().check_amount(fee)
    
    @database_sync_to_async
    def set_wallet(self):
        return super().set_wallet()

class HoldMoney:
    def __init__(self,base_user) -> None:
        self.base_user=base_user

    def run(self,fee):
        pass

class PatientHoldMoney(HoldMoney):
    def __init__(self, base_user) -> None:
        super().__init__(base_user)
    

    def run(self,fee):
        
        patients_wallet=Wallet.objects.get(
            base_user=self.base_user
        )

        admin_wallet=Wallet.objects.get(
            base_user=Admin.objects.get(admin_id='1').base_user
        )

        patients_wallet.transfer_money(fee,admin_wallet)

    def return_money(self,fee):

        patients_wallet=Wallet.objects.get(
            base_user=self.base_user
        )
        
        admin_wallet=Wallet.objects.get(
            base_user=Admin.objects.get(admin_id='1').base_user
        )
    
        admin_wallet.transfer_money(fee,patients_wallet)


class TransferMoney:
    def __init__(self,base_user) -> None:
        self.base_user=base_user

    def transfer(self,fee,to_base_user):
        from_wallet=Wallet.objects.get(
            base_user=self.base_user
        )
        to_wallet=Wallet.objects.get(
            base_user=to_base_user
        )
        from_wallet.transfer_money(fee,to_wallet)
        
    
class Fee:
    def __init__(self,doctor) -> None:
        self.doctor=doctor

    def get_fee(self):
        pass

class FeeBooking(Fee):

    def __init__(self, doctor,distance) -> None:
        super().__init__(doctor)
        self.distance=distance

    def get_fee(self):
    
        return self.doctor.diagnostic_fee + self.distance*FEE_DISTANCE


class FeeBookCalerdar(Fee):
    def __init__(self, doctor) -> None:
        super().__init__(doctor)

    def get_fee(self):
        return self.doctor.diagnostic_fee


class DiagnosticBillAPI(ModelViewSet):
    serializer_class=DiagnosticBillSerializer
    queryset=DiagnosticBill.objects.all()
    permission_classes=[]

    @atomic
    def create(self, request, *args, **kwargs):
        
        
        serializer = self.get_serializer(data=data)

        check,dict_error=is_valid(serializer,400)
        if not check:
            return JsonResponse({**dict_error,**dict_error})
        
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        data={
            'data':data,
            'flag':True,
            'status':200
        }
        return response.Response(data, status=status.HTTP_201_CREATED, headers=headers)


@api_view(['GET'])
@permission_classes([IsAuthenticated & IsAdmin])
def get_financial_figure(request):
    reports=Report.objects.all()
    revenue=0
    pay_doctor_amount=0
    profit=0
    for report in reports:
        revenue+=report.revenue
        pay_doctor_amount+=report.pay_doctor_amount
        profit+=report.profit

    data={
        'revenue':revenue,
        'pay_doctor_amount':pay_doctor_amount,
        'profit':profit
    }
    return JsonResponse({'flag':True,'status':200,**data})
    
@api_view(['GET'])
@permission_classes([IsAuthenticated & IsAdmin])
def get_revenue_profit_figure_API(request):
    MONTH_TARGET=6
    data=get_revenue_profit_figure(MONTH_TARGET)
    return JsonResponse({'data':data,'flag':True,'status':200})

def get_range_month(target_range_month):
    month_in_year=[1,2,3,4,5,6,7,8,9,10,11,12]
    today=datetime.date.today()
    months={}
    for i in range(0,target_range_month):

        if today.month-i-1<0:
            months[month_in_year[today.month-i-1]]=today.year-1
        else:
            months[month_in_year[today.month-i-1]]=today.year
    return months

def get_revenue_profit_figure(target_range_month):
    reversed_months=get_range_month(target_range_month)
    months = OrderedDict(reversed(list(reversed_months.items())))
    data={
        'revenue':{
            'range_month':[],
            'value':[]
        },
        'profit':{
            'range_month':[],
            'value':[]
        }
    }

    for month,year in months.items():
        try:
            report=Report.objects.get(
                date__year=year,
                date__month=month
            )
            month_revenue=report.revenue
            profit_revenue=report.profit
        except:
            month_revenue=0
            profit_revenue=0

        data['revenue']['range_month'].append(month)
        data['revenue']['value'].append(month_revenue)
        data['profit']['range_month'].append(month)
        data['profit']['value'].append(profit_revenue)
    
    return data

class HistoryPaymentAPI(ModelViewSet):
    queryset=HistoryPayment.objects.all().order_by('-date') 
    permission_classes=[]
    serializer_class=HistoryPaymentSerializer
    
    @action(methods=['GET'],detail=False,url_path='get-revenue')
    def get_revenue(self,requets):
        payments=HistoryPayment.objects.all().order_by('-date') 
        data=HistoryPaymentSerializer(payments,many=True).data
        for payment_data in data:
            transfer_type=payment_data['type']
            if transfer_type in ['ADMIN_TRANSFER_DOCTOR','ADMIN_TRANSFER_PATIENT']:
                payment_data.pop('amount_to_user')
            elif transfer_type in ['PATIENT_TRANSFER_ADMIN']:
                payment_data.pop('amount_from_user')
                
        return JsonResponse({'data':data,'flag':True,'status':200})
    
    @action(methods=['GET'],detail=False,url_path='get-profit')
    def get_profit(self,requets):
        payments=HistoryPayment.objects.filter(
           type=HistoryPaymentEnum.ADMIN_TRANSFER_DOCTOR.value  
        ) 
        data=HistoryPaymentSerializer(payments,many=True).data
        for payment_data in data:
            payment_data['profit']=10*payment_data['amount']/90
            payment_data.pop('amount_to_user')
        
        return JsonResponse({'data':data,'flag':True,'status':200})
    
    @action(methods=['GET'],detail=False,url_path='get-sent-doctor-money')
    def get_sent_doctor_money(self,requets):
        payments=HistoryPayment.objects.filter(
           type=HistoryPaymentEnum.ADMIN_TRANSFER_DOCTOR.value  
        ) 
        data=HistoryPaymentSerializer(payments,many=True).data
        for payment_data in data:
            payment_data.pop('amount_to_user')
        
        return JsonResponse({'data':data,'flag':True,'status':200})

    @action(methods=['GET'],detail=False,url_path='get-invidual-transactions')
    def get_invidual_transactions(self,request):
        user=request.user
        payments=HistoryPayment.objects.filter(
            Q(from_user=user) | Q(to_user=user)
        ).order_by('-date') 
        data=[]
        for payment in payments:
            payment_data=HistoryPaymentSerializer(payment).data
            if payment.from_user==user:
                payment_data.pop('amount_to_user')
            else:
                payment_data.pop('amount_from_user')
            data.append(payment_data)

        return JsonResponse({'data':data,'flag':True,'status':200})

    @action(methods=['GET'],detail=False,url_path='get-revenue-transactions-doctor')
    def get_revenue_transactions_doctor(self,request):
        today=datetime.date.today()
        payments=HistoryPayment.objects.filter(
            to_user=self.request.user,
            date__month=today.month,
            date__year=today.year,
            type=HistoryPaymentEnum.ADMIN_TRANSFER_DOCTOR.value  
        )
        data={
            'order_numbers':[
                0,0,0,0
            ],
            'revenue_figures':[
                0,0,0,0
            ]
        }
        MILESTONES=[8,16,24,31]
        check_milestone=0
        
        for payment in payments:
            if not payment.date.day<=MILESTONES[check_milestone]:
                check_milestone+=1
            data['order_numbers'][check_milestone]+=1
            data['revenue_figures'][check_milestone]+=payment.amount

        # data['milestone']=
        return JsonResponse({"data":data,'flag':True,'status':200}) 

    