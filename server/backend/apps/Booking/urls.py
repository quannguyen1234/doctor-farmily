from django.urls import path,include
from rest_framework.routers import DefaultRouter
from . import views

router=DefaultRouter(trailing_slash=False)
router.register('doctor-appointments',views.DoctorAppointmentsAPI)
router.register('calender-appointments',views.DoctorAppointmentCalenderAPI)
router.register('ratings',views.RatingAPI)



urlpatterns=[
    path('get-living-doctors',views.get_living_doctors)
]
urlpatterns+=router.urls