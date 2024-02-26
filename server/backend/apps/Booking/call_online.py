from apps.User.models import Doctor
from .serializers import DoctorAppointmentsSerializer
from .models import ConnectDoctor
from channels.db import database_sync_to_async





@database_sync_to_async
def get_doctors(department):
    
    list_doctor_having_order=list(ConnectDoctor.objects.exclude(
        patient=None
    ).values_list('doctor__doctor_id',flat=True))

    doctors=Doctor.objects.filter(
        is_receive=True,
        departments__de_id=department,
    ).exclude(doctor_id__in=list_doctor_having_order)

    if len(doctors)==0:
        return {
            'flag':False,
            'status':200,
            'message':'No doctors'
        }
    else:
        
        data=[]
        for doctor in doctors:
            data.append({
                'doctor_id':doctor.doctor_id,
                'doctor_name':doctor.base_user.get_full_name
            })
        return {'doctors':data,'flag':True,'status':200}
