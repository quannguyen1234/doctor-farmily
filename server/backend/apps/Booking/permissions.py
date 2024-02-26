from rest_framework.permissions import BasePermission

class ListAppointmentPermission:
    doctor_per=['receive_order']

class DoctorAppointmentsPer(BasePermission):
    def has_permission(self, request, view):
      
        if request.user.user_doctor is not None and request.action in ListAppointmentPermission.doctor_per :
            return True
        return False

doctor_perm=['create','update','finish_order','update_calendar','get_calender_by_doctor']
patient_perm=['cancel_book','book']

class DoctorCalendarPerm(BasePermission):

    def has_permission(self, request, view):
        if request.action in doctor_perm:
            return True
        return False
    
    def has_object_permission(self, request, view, obj):
        
        if request.action in doctor_perm:
            if obj.patient.base_user==self.user:
                return True
        return False
    
class PatientCalendarPerm(BasePermission):

    def has_permission(self, request, view):
        
        return True
    
    def has_object_permission(self, request, view, obj):
        
        if request.action in patient_perm:
            action=request.action
            if action == 'book':
                return True
            elif action == 'cancel_book':
                if request.user == obj.patient.base_user:
                    return True
                return False
        return False

    

        
    