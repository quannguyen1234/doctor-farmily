from rest_framework.viewsets import GenericViewSet,ModelViewSet
from apps.User.models import Doctor,Patient
from apps.PersonalManagement.models import Address
from .models import Calender,Rating
from .serializers import DoctorAppointmentsSerializer,DoctorAppointmentCalenderSerializer,RatingSerializer
from rest_framework.decorators import action
from apps.User.permission import IsDoctor
from apps.PersonalManagement.models import Address 
from core.references import AddressEnum
from django.db.transaction import atomic
from django.http import JsonResponse
import datetime
from core.utils import is_valid
from .functions import get_mean_star
from .import permissions
from rest_framework.permissions import IsAuthenticated
# from .models import Appointment
from rest_framework.exceptions import NotAcceptable
from apps.User.permission import IsDoctor,IsPatient
from rest_framework.decorators import api_view,permission_classes
class DoctorAppointmentsAPI(GenericViewSet):
    # permission_classes = [IsAuthenticated & (IsDoctor&DoctorAppointmentsPer)]
    permission_classes=[]
    queryset=Doctor.objects.all()
    serializer_class=DoctorAppointmentsSerializer   
    
    def get_permissions(self):
        
        setattr(self.request,'action',self.action)
        return super().get_permissions()
    
    # @action(methods=['post'],detail=False,url_path='get-doctors')
    # def get_doctors(self,request):
    #     data=request.data
    #     address=data.pop('address')
    #     department=data.pop('de_id')
    #     district=address.get('district')
    #     city=address.get('city')
     
    #     addresses=Address.objects.filter(
    #         district__iregex=f"{district}",
    #         city__iregex=f"{city}",

    #     )
        
    #     #filter doctors is free
    #     doctors=Doctor.objects.filter(
    #         is_receive=True,
    #         departments__de_id=department,
    #         base_user__address__in=addresses
    #     )
    #     if len(doctors)==0:
    #         return JsonResponse({
    #             'flag':False,
    #             'status':200,
    #             'message':'No doctors'
    #         })
    #     doctors_data=DoctorAppointmentsSerializer(doctors,many=True).data
       
    #     data=[]
    #     for doctor_data in doctors_data:
    #         data.append(dict(doctor_data))
    
    #     # return JsonResponse({'doctors':data})
    #     return JsonResponse({'doctors':data,'flag':True,'status':200})

    @atomic
    @action(methods=['POST'],detail=False,url_path='receive-order')
    def receive_order(self,request,*args, **kwargs):
        try:
            doctor=request.user.user_doctor
            status=request.data.get('status')
            doctor.is_receive=status
            doctor.save()
            address=request.data.get('address')
            Address.objects.filter(base_user__email=request.user.email,address_type=AddressEnum.CurrentAddress.value).delete()
            if status:
                Address.objects.create(**address,base_user=request.user,address_type=AddressEnum.CurrentAddress.value)
            return JsonResponse({
                'status':200,
                'flag':True
            })
        except:
            return JsonResponse({
                'status':409,
                'flag':False
            })

class DoctorAppointmentCalenderAPI(ModelViewSet):
    serializer_class=DoctorAppointmentCalenderSerializer
    # permission_classes=[IsAuthenticated & ( 
    #                         (IsDoctor & permissions.DoctorCalendarPerm) | 
    #                         (IsPatient & permissions.PatientCalendarPerm)
    # )]
    
    queryset=Calender.objects.all().order_by('-date')

    def get_permissions(self):
        setattr(self.request,'action',self.action)
        
        return super().get_permissions()
    
    @action(methods=['GET'],detail=False,url_path='doctor/(?P<doctor_id>.+)/get_doctor_notification$')
    def get_doctor_notification(self,request,doctor_id):
       
        try:
            doctor=Doctor.objects.get(doctor_id=doctor_id)
        except:
            raise NotAcceptable({'message':'doctor dont existed'})
        
        calenders=Calender.objects.filter(
            date__gte=datetime.date.today(),
            is_book=True,
            doctor=doctor
        ).order_by('-date')
        
        data=DoctorAppointmentCalenderSerializer(calenders,many=True).data
        for order in data:
            order['fee']=doctor.diagnostic_fee
        return JsonResponse({'data':data,'status':200,'flag':True})
    
    @action(methods=['GET'],detail=False,url_path='patient/(?P<patient_id>.+)/get_patient_notification$')
    def get_patient_notification(self,request,patient_id):
       
        try:
            patient=Patient.objects.get(patient_id=patient_id)
        except:
            raise NotAcceptable({'message':'patient dont existed'})
        
        calenders=Calender.objects.filter(
            date__gte=datetime.date.today(),
            is_book=True,
            patient=patient
        ).order_by('-date')
        
        try:
            doctor=calenders[0].doctor
            fee=doctor.diagnostic_fee
        except:
            fee=0
        
        data=DoctorAppointmentCalenderSerializer(calenders,many=True).data
        for order in data:
            order['fee']=fee
        return JsonResponse({'data':data,'status':200,'flag':True})
        

    @action(methods=['GET'],detail=False,url_path='doctor/(?P<doctor_id>.+)/$')
    def get_calender_by_doctor(self,request,doctor_id):
        DAY_OF_WEEK=7
        try:
            doctor=Doctor.objects.get(doctor_id=doctor_id)
        except:
            raise NotAcceptable({'message':'doctor dont existed'})
        
        week=request.query_params['week']
        calenders=Calender.objects.all()

        calenders=Calender.objects.filter(
            date__gte=datetime.date.today(),
            date__lte=datetime.date.today()+datetime.timedelta(days=int(DAY_OF_WEEK*week)),
            doctor=doctor
        )
        data=DoctorAppointmentCalenderSerializer(calenders,many=True).data
        
        return JsonResponse({'fee':doctor.diagnostic_fee,'data':data,'status':200,'flag':True})
    
    @atomic
    def create(self, request, *args, **kwargs):
        doctor_id=self.request.user.user_doctor.doctor_id
        doctor_name=self.request.user.get_full_name
        request.data['doctor_id']=doctor_id
        request.data['doctor_name']=doctor_name

        serializer = self.get_serializer(data=request.data)
        check,dict_error=is_valid(serializer,400)
        if not check:
            return JsonResponse({**dict_error,**dict_error})

        self.perform_create(serializer)
        
        return JsonResponse({**serializer.data,'flag':True,'status':'200'})
    
    @atomic
    @action(methods=['POST'],detail=False,url_path='update-calendar')
    def update_calendar(self,request):

        doctor_id=self.request.user.user_doctor.doctor_id
        doctor_name=self.request.user.get_full_name
        

        calendar=request.data
        Calender.objects.filter(doctor__doctor_id=doctor_id,is_book=False).delete()
        for date_order in calendar:
                date_order['doctor_id']=doctor_id
                date_order['doctor_name']=doctor_name
                date_order.pop('calender_id')
                instance_canlendar=DoctorAppointmentCalenderSerializer(data=date_order)
                if instance_canlendar.is_valid(raise_exception=True):
                    instance_canlendar.save()

        return JsonResponse({'status':200,'flag':True})
    
    @atomic
    @action(methods=['POST'],detail=True,url_path='book')
    def book(self,request,pk=None):
        calender_instance=self.get_object() 
        if calender_instance.is_book==True:
            return JsonResponse({'message':'calender was booked','flag':False,'status':400})
        
        calender_instance.is_book=True
        calender_instance.patient=request.user.user_patient
        calender_instance.patient_address=request.data['patient_address']
        calender_instance.patient_phone_number=request.data['patient_phone_number']
        calender_instance.save()
        
        
        return JsonResponse({'flag':True,'status':200})

    @atomic
    @action(methods=['POST'],detail=True,url_path='cancel-book')
    def cancel_book(self,request,pk=None):
        calender_instance=self.get_object()
        if not calender_instance.patient.base_user == request.user:
            return JsonResponse({'message':'only patient booked canlender have permission','flag':False,'status':400})
        
        
        calender_instance.patient=None
        calender_instance.patient_address=None
        calender_instance.is_book=False
        calender_instance.save()
        return JsonResponse({'flag':True,'status':200})
    
    
    @atomic
    @action(methods=['POST'],detail=True,url_path='finish-order')
    def finish_order(self,request,pk=None):
        calender_instance=self.get_object()
        if not calender_instance.is_book:
            return JsonResponse({'message':'calendar have not booked','flag':False,'status':400})
        
        calender_instance.delete()
        return JsonResponse({'flag':True,'status':200})
    
class RatingAPI(ModelViewSet):
    serializer_class=RatingSerializer
    permission_classes=[]
    queryset=Rating.objects.all()

    def create(self, request, *args, **kwargs):
        request.data['patient_id']=request.user.user_patient.patient_id
        serializer = self.get_serializer(data=request.data)
        check,dict_error=is_valid(serializer,400)
        if not check:
            return JsonResponse({**dict_error,**dict_error})

        self.perform_create(serializer)
        
        return JsonResponse({**serializer.data,'flag':True,'status':'200'})
    

    @action(methods=['GET'],detail=False,url_path='doctor/(?P<doctor_id>.+)/$')
    def get_rating(self,request,doctor_id):
        try:
            doctor=Doctor.objects.get(doctor_id=doctor_id)
        except:
            raise NotAcceptable({'message':'doctor dont existed'})
        resulf=get_mean_star(doctor)
        return JsonResponse({"star":resulf,'status':200,'flag':True})


        
def receive_order(base_user,data):
    address=data.get('address')
    Address.objects.filter(base_user__email=base_user.email,address_type=AddressEnum.CurrentAddress.value).delete()
    Address.objects.create(**address,base_user=base_user,address_type=AddressEnum.CurrentAddress.value)
    

def delete_address(base_user,type):
    base_user.addresses.filter(
        address_type=type
    ).delete()


@api_view(['POST'])
@permission_classes([])
def get_living_doctors(request):
    data=request.data
    address=data.pop('address')
    department=data.pop('de_id')
    city=address.get('city')
    
    addresses=Address.objects.filter(
        city__iregex=f"{city}",
        address_type=AddressEnum.LivingAdress.value
    )
    
    #filter doctors is free
    doctors=Doctor.objects.filter(
        departments__de_id=department,
        base_user__address__in=addresses
    )
    if len(doctors)==0:
        return JsonResponse({
            'flag':False,
            'status':200,
            'message':'No doctors'
        })
    
    
    data=[]
    for doctor in doctors:
        data.append({
            'doctor_id':doctor.doctor_id,
            'doctor_name':doctor.base_user.get_full_name
        })

    return JsonResponse({'doctors':data,'flag':True,'status':200})