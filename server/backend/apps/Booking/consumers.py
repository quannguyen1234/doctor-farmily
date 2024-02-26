from core.references import AddressEnum,DiagnosticFormEnum,HistoryPaymentEnum,FEE_DISTANCE
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from apps.User.models import Doctor,Patient,Admin
from apps.PersonalManagement.models import Address
from .models import ConnectDoctor
from .views import receive_order,get_mean_star
from apps.Transaction.views import FeeBooking,PatientHoldMoney,TransferMoney,CheckAmountAysnc
from apps.Transaction.models import Report,DiagnosticBill,DiagnosticBillDetail,HistoryPayment
import json,datetime
from channels.db import database_sync_to_async
from apps.User.references import REVERSE_USER_TYPE,USER_TYPE
from channels.layers import get_channel_layer
from channels.db import database_sync_to_async
from .serializers import DoctorAppointmentsSerializer
from asgiref.sync import async_to_sync
from django.db import transaction,models
from .call_online import get_doctors as get_doctors_call_online
from .zoom.zoom import createMeeting



class AuthenToken:

    async def websocket_connect(self, event):
        await self.accept()
        user=self.scope['user']
        if isinstance(user,AnonymousUser):
            await self.send(json.dumps({
                'data':{
                    "message": "Token is not correct or expired",
                    'status': 401,
                    'flag': False
                }     
            }))
           
            await self.close()
            return False
        return True            
         



class BaseConversation(AuthenToken,AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.base_user=None
        self.user=None
        self.user_type=None

    async def websocket_connect(self, event):
        check=await super().websocket_connect(event)
        
        if not check:        
            return
        has_permission=False
        self.base_user=self.scope['user']
        self.user_type=await database_sync_to_async(lambda:self.base_user.user_type)()
       
        if ( await database_sync_to_async(lambda:hasattr(self.base_user,'user_doctor'))()
           and await database_sync_to_async(lambda:hasattr(self.base_user,'user_patient'))() ):
            await self.send(json.dumps({
                'data':{
                    "message": "Forbiden",
                    'status': 404,
                    'flag': False
                }     
            }))
            await self.close()
            return 
            
        elif self.user_type == REVERSE_USER_TYPE['Doctor']:
            self.user= await database_sync_to_async(lambda:self.base_user.user_doctor)()
            
            # await database_sync_to_async(lambda:ConnectDoctor.objects.filter(doctor=self.user).delete())()
            
            action,to_user=await create_or_update_conversation(self.user,self.channel_name,'doctor')

            if action=='update':
                await self.reconnect_conversation(to_user,'to_patient')

                
            has_permission=True

        elif self.user_type == REVERSE_USER_TYPE['Patient']:
            self.user= await database_sync_to_async(lambda:self.base_user.user_patient)()
            action,to_user=await create_or_update_conversation(self.user,self.channel_name,'patient')

            if action=='update':
                await self.reconnect_conversation(to_user,'to_doctor')

            has_permission=True
        
        if has_permission:
           
            await self.send(json.dumps(
                {
                    'data':{
                        'message':'Access successfully!',
                        'channel':self.channel_name,
                        'user_type':USER_TYPE[self.user_type],
                        'status':200,
                        'flag':True
                    }     
                }  
            )) 
        else:
            self.close()    

    async def send_message_to_channel(self,channel_name, data): 
      
        channel_layer = get_channel_layer()
        # print(async_to_sync(channel_layer.channel_layer.group_channel_layer.group_channel_layer.has_channel)(channel_name))
        await channel_layer.send(channel_name, {
            'type': 'chat',
            'data':{**data},
        })
        
    async def reconnect_conversation(self,to_user,flag='to_doctor'):
        to_base_user=await database_sync_to_async(lambda:to_user.base_user)()
        connect=await get_connect(self.base_user)
        zoom_link=await database_sync_to_async(lambda:connect.zoom_link)()
        if flag=='to_doctor':    
            await self.send(json.dumps({
                    'type':'reconect-patient',
                    'data':{
                        "message": "Reconnect",
                        'status':200,
                        'zoom_link':zoom_link,
                        'flag': True,
                        'doctor_name':await database_sync_to_async(lambda:to_base_user.get_full_name)(),
                        'doctor_id':await database_sync_to_async(lambda:to_user.doctor_id)()
                    }     
            }))
        else:
            await self.send(json.dumps({
                    'type':'reconect-doctor',
                    'data':{
                        "message": "Reconnect",
                        'status':200,
                        'zoom_link':zoom_link,
                        'flag': True,
                        'patient_name':await database_sync_to_async(lambda:to_base_user.get_full_name)(),
                        'patient_id':await database_sync_to_async(lambda:to_user.patient_id)()
                    }     
            }))

    async def chat(self,event):
        
        data = event["data"]
        
        await self.send(text_data=json.dumps(data))
class ConversationOnline(BaseConversation):
    
    async def receive(self, text_data=None, bytes_data=None):
        data=json.loads(text_data)
        
        if data['type']=='get-doctors':
            resulf=await get_doctors_call_online(data['data']['de_id'])
            await self.send(json.dumps(resulf))

        elif data['type']=='patient-choose-doctor':
    
            doctor_id=data['doctor']
            connect=await database_sync_to_async(lambda:ConnectDoctor.objects.get(doctor__doctor_id=doctor_id))()
            doctor_target_channel=await database_sync_to_async(lambda:connect.doctor_channel)()
            
            
            if await check_booked_doctor_async(self.user,connect):
                await self.send(json.dumps({
                    'type':'booked-doctor',
                    'data':{
                        "message": "doctor was booked",
                    }     
                }))
                return
            
            await database_sync_to_async(lambda:connect.save())() 

            # send to doctor interface a message about confirmings
            await self.send_message_to_channel(doctor_target_channel,{
                
                'type':'doctor-confirm-order',
                'message':'Confirming Order!',
                'patient_id':await database_sync_to_async(lambda:self.user.patient_id)(),
                'patient_name':await database_sync_to_async(lambda:self.user.base_user.get_full_name)(),
                "patient_channel":self.channel_name
            })
        
       
        elif data['type']=='doctor-confirm-order':  

            is_receive_order=data.get('is_receive_order')
            patient_channel=data.get('patient_channel')

            if is_receive_order:
                zoom_link=await createMeeting_async()
                connect=await database_sync_to_async(lambda:ConnectDoctor.objects.get(doctor=self.user))()
                patient=await database_sync_to_async(Patient.objects.get)(patient_id=data.get('patient_id'))
                fee=await database_sync_to_async(lambda:connect.fee)()
                connect.patient=patient
                connect.patient_channel=data.get('patient_channel')
                connect.zoom_link=zoom_link
                connect.is_confirm=True

                await database_sync_to_async(lambda:connect.save())()
                

                # send the message to client interface
                
                await self.send_message_to_channel(patient_channel,
                    {
                        'type':'doctor-confirm-order',
                        'flag':True,
                        'status':200,
                        'link_zoom':zoom_link,
                        'message':'The doctor has received order',
                        'doctor_id':await database_sync_to_async(lambda:self.user.doctor_id)(),
                        'doctor_name':await database_sync_to_async(lambda:self.user.base_user.get_full_name)()
                    } 
                )
                
                await self.send(json.dumps({
                    'type':'doctor-confirm-order',
                        'flag':True,
                        'status':200,
                        'link_zoom':zoom_link,
                        'doctor_id':await database_sync_to_async(lambda:self.user.doctor_id)(),
                        'doctor_name':await database_sync_to_async(lambda:self.user.base_user.get_full_name)()
                })) 
                    
            else:
                await self.send_message_to_channel(patient_channel,
                    {
                        'type':'doctor-confirm-order',
                        'flag':False,
                        'status':200,
                        'message':'The doctor has not received order',
                        'doctor_id':await database_sync_to_async(lambda:self.user.doctor_id)(),
                        'doctor_name':await database_sync_to_async(lambda:self.user.base_user.get_full_name)()
                    }               
                )     
                await self.send()
        
        elif data['type']=='doctor-finish-order':
            await database_sync_to_async(lambda:ConnectDoctor.objects.filter(doctor=self.user).delete())()
            await self.websocket_disconnect()





class Conversation(AuthenToken,AsyncWebsocketConsumer):
    
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.base_user=None
        self.user=None
        self.user_type=None

    async def websocket_connect(self, event):
        check=await super().websocket_connect(event)
        
        if not check:        
            return
        has_permission=False
        self.base_user=self.scope['user']
        self.user_type=await database_sync_to_async(lambda:self.base_user.user_type)()
        print(self.user_type)
        if ( await database_sync_to_async(lambda:hasattr(self.base_user,'user_doctor'))()
           and await database_sync_to_async(lambda:hasattr(self.base_user,'user_patient'))() ):
            await self.send(json.dumps({
                'data':{
                    "message": "Forbiden",
                    'status': 404,
                    'flag': False
                }     
            }))
            await self.close()
            return 
            
        elif self.user_type == REVERSE_USER_TYPE['Doctor']:
            self.user= await database_sync_to_async(lambda:self.base_user.user_doctor)()
            
            # await database_sync_to_async(lambda:ConnectDoctor.objects.filter(doctor=self.user).delete())()
            
            action,to_user=await create_or_update_conversation(self.user,self.channel_name,'doctor')

            if action=='update':
                await self.reconnect_conversation(to_user,'to_patient')

                
            has_permission=True

        elif self.user_type == REVERSE_USER_TYPE['Patient']:
            self.user= await database_sync_to_async(lambda:self.base_user.user_patient)()
            action,to_user=await create_or_update_conversation(self.user,self.channel_name,'patient')

            if action=='update':
                await self.reconnect_conversation(to_user,'to_doctor')

            has_permission=True
        
        if has_permission:
           
            await self.send(json.dumps(
                {
                    'data':{
                        'message':'Access successfully!',
                        'channel':self.channel_name,
                        'user_type':USER_TYPE[self.user_type],
                        'status':200,
                        'flag':True
                    }     
                }  
            )) 
        else:
            self.close()

    
    async def websocket_disconnect(self,*agrs,**kwagrs):
        # if isinstance(self.user,AnonymousUser): 
        
        if  self.user_type is not  None:
            if self.user_type==REVERSE_USER_TYPE['Doctor']:
                pass
                # await database_sync_to_async(lambda:ConnectDoctor.objects.filter(doctor=self.user).delete())()
                
                # turn off receving order signal 
                # self.user.is_receive=True
                # await database_sync_to_async(lambda:self.user.save())()
            

            if self.user_type==REVERSE_USER_TYPE['Patient']:
                pass
                # await database_sync_to_async(lambda:ConnectDoctor.objects.filter(patient=self.user).delete())()
        await self.disconnect(code=None)
                
    async def disconnect(self,code):
        await self.send(json.dumps({
                "data": {
                    "message":"disconnect",
                    "flag":True,
                    "status":200
                },
            }))
        
        await self.close()
            
    
    async def receive(self, text_data=None, bytes_data=None):

        data=json.loads(text_data)
       
        if data['type']=='doctor-set-address':
          
            await database_sync_to_async(lambda:receive_order(self.base_user,data))()  
            await self.send(json.dumps({
                "data": {
                    "message:":"turn on receiving order doctor signal ",
                    "flag":True,
                    "status":200
                },
            }))
            self.user.is_receive=True
            await database_sync_to_async(lambda:self.user.save())()

        elif data['type']=='patient-choose-doctor':

            patient=self.user
            doctor_id=data['doctor']
            connect=await database_sync_to_async(lambda:ConnectDoctor.objects.get(doctor__doctor_id=doctor_id))()
            await database_sync_to_async(lambda:receive_order(self.base_user,data))()  
            doctor_target_channel=await database_sync_to_async(lambda:connect.doctor_channel)()
            doctor= await database_sync_to_async(lambda:connect.doctor)()
            distance=extract_distance(data['distance'])
            fee=FeeBooking( doctor,distance).get_fee()
            

            
            check_instance=  CheckAmountAysnc(self.base_user)
            await check_instance.set_wallet()
            await show(self.base_user)
            if not  await check_instance.check_amount(fee):
                
                await self.send(json.dumps({
                    'type':'patient-out-of-money',
                    'data':{
                        "message": "Run out of money",
                    }     
                }))
                return 
            if await check_booked_doctor_async(self.user,connect):
                await self.send(json.dumps({
                    'type':'booked-doctor',
                    'data':{
                        "message": "doctor was booked",
                    }     
                }))
                return

            connect.distance=distance
            connect.fee=fee
            await database_sync_to_async(lambda:connect.save())() 

            # send to doctor interface a message about confirmings
            await self.send_message_to_channel(doctor_target_channel,{
                
                'type':'doctor-confirm-order',
                'message':'Confirming Order!',
                'patient_id':await database_sync_to_async(lambda:self.user.patient_id)(),
                'patient_name':await database_sync_to_async(lambda:self.user.base_user.get_full_name)(),
                "patient_channel":self.channel_name
            })
            
        elif data['type']=='get-doctors':
            resulf=await get_doctors(data)
            await self.send(json.dumps(resulf))

        elif data['type']=='cancel-order':
            try:
                resulf,detail=await cancel_order(data)
            except:
                await self.send(json.dumps({"message":"loi gi do"}))
                return 
            
            conversation=detail['conversation']
            await return_money_patient_with_atomic(conversation)

            conversation.patient_id=None
            conversation.patient_channel=None
            conversation.fee=0
            await database_sync_to_async(lambda:conversation.save())()
            await self.send(json.dumps(resulf))
            await self.send_message_to_channel(detail['doctor_channel'],{
                'message':"patient cancel order",
                'patient_id':detail['patient_id'],
                'flag':True,
                'status':200,
            })

        elif data['type']=='doctor-confirm-order':  
            is_receive_order=data.get('is_receive_order')
            patient_channel=data.get('patient_channel')

            if is_receive_order:
                connect=await database_sync_to_async(lambda:ConnectDoctor.objects.get(doctor=self.user))()
                patient=await database_sync_to_async(Patient.objects.get)(patient_id=data.get('patient_id'))
                fee=await database_sync_to_async(lambda:connect.fee)()
                connect.patient=patient
                connect.patient_channel=data.get('patient_channel')
                connect.is_confirm=True

                await create_bill_booking(connect)

                await database_sync_to_async(lambda:connect.save())()
                
                await hold_money_patient_with_atomic(connect,patient,fee)
                
                # send the message to client interface
                
                await self.send_message_to_channel(patient_channel,
                    {
                        'type':'doctor-confirm-order',
                        'flag':True,
                        'status':200,
                        'message':'The doctor has received order',
                        'address':await get_address(self.base_user),
                        'doctor_id':await database_sync_to_async(lambda:self.user.doctor_id)(),
                        'doctor_name':await database_sync_to_async(lambda:self.user.base_user.get_full_name)()
                    } 
                )
                patient_base_user=await database_sync_to_async(lambda:patient.base_user)()
                await self.send(json.dumps({
                    "data": {
                        "message:":"The doctor has received order",
                        "address":await get_address(patient_base_user),
                        "status":200
                    }
                })) 
                    
            else:
                await self.send_message_to_channel(patient_channel,
                    {
                        'type':'doctor-confirm-order',
                        'flag':False,
                        'status':200,
                        'message':'The doctor has not received order',
                        'doctor_id':await database_sync_to_async(lambda:self.user.doctor_id)(),
                        'doctor_name':await database_sync_to_async(lambda:self.user.base_user.get_full_name)()
                    }               
                )   
                await self.send(json.dumps({
                    {
                        "data": {
                            "message:": "turn on receiving order doctor signal ",
                            "flag": True,
                            "status": 200
                        }
                    } 
                })) 

        elif data['type']=='doctor-finish-order':
            connect,patient_channel,patient_base_user,fee=await finish_odrer(self.user)
            
            #doctor receive money
            doctor_base_user=self.base_user
            _,admin_base_user=await get_admin()
            transfer=TransferMoney(admin_base_user)
            await self.send_message_to_channel(patient_channel,{
                'type':'doctor-finish-order',
                'data':{
                    'message':'doctor has confirmed order'
                }
            }),
            
            await transfer_money_with_atomic(connect,transfer,fee,doctor_base_user)
            await bill_paid(connect)
            await disable_receving_order(self.user)
            await self.websocket_disconnect()
        
        elif data['type']=='disconnect':
            await self.websocket_disconnect()

        elif data['type']=='turn-off-receiving-order':
            await disable_receving_order(self.user)
            await self.websocket_disconnect()
            

        

    async def send_message_to_channel(self,channel_name, data): 
      
        channel_layer = get_channel_layer()
        # print(async_to_sync(channel_layer.channel_layer.group_channel_layer.group_channel_layer.has_channel)(channel_name))
        await channel_layer.send(channel_name, {
            'type': 'chat',
            'data':{**data},
        })
        
    async def reconnect_conversation(self,to_user,flag='to_doctor'):
        to_base_user=await database_sync_to_async(lambda:to_user.base_user)()
        address= await get_address(to_base_user)

        if flag=='to_doctor':    
            await self.send(json.dumps({
                    'type':'reconect-patient',
                    'data':{
                        "message": "Reconnect",
                        'status':200,
                        'flag': True,
                        'address':address,
                        'doctor_name':await database_sync_to_async(lambda:to_base_user.get_full_name)(),
                        'doctor_id':await database_sync_to_async(lambda:to_user.doctor_id)()
                    }     
            }))
        else:
            await self.send(json.dumps({
                    'type':'reconect-doctor',
                    'data':{
                        "message": "Reconnect",
                        'status':200,
                        'flag': True,
                        'address':address,
                        'patient_name':await database_sync_to_async(lambda:to_base_user.get_full_name)(),
                        'patient_id':await database_sync_to_async(lambda:to_user.patient_id)()
                    }     
            }))

        
        
    async def chat(self,event):
        
        data = event["data"]
        
        await self.send(text_data=json.dumps(data))

def get_channel_from_connect_table(user_id,flag):
    if flag=='doctor':
        return ConnectDoctor.objects.get(doctor__doctor_id=user_id).doctor_channel
    else:
        return ConnectDoctor.objects.get(patient__patient_id=user_id).patient_channel

@database_sync_to_async
def get_doctors(data):
    
    address=data.pop('address')
    department=data.pop('de_id')
    district=address.get('district')
    city=address.get('city')
    
    addresses=Address.objects.filter(
        district__iregex=f"{district}",
        city__iregex=f"{city}",
        address_type=AddressEnum.CurrentAddress.value
    )
    list_doctor_having_order=list(ConnectDoctor.objects.exclude(
        patient=None
    ).values_list('doctor__doctor_id',flat=True))
    
    
    #filter doctors is free
    doctors=Doctor.objects.filter(
        is_receive=True,
        departments__de_id=department,
        base_user__address__in=addresses,
    ).exclude(doctor_id__in=list_doctor_having_order)
    

    if len(doctors)==0:
        return {
            'flag':False,
            'status':200,
            'message':'No doctors'
        }
    else:
        doctors_data=DoctorAppointmentsSerializer(doctors,many=True).data
        
        data=[]
        for doctor_data in doctors_data:
            data.append(dict(doctor_data))    
        return {'doctors':data,'flag':True,'status':200}




@database_sync_to_async
def cancel_order(data):
    patient_id=data.get('patient_id')
    conversation=ConnectDoctor.objects.filter(patient__patient_id=patient_id)
    if len(conversation)>0:
        conversation=conversation[0]
        patient_id=conversation.patient_id
        doctor_channel=conversation.doctor_channel
        conversation.save()
        return {'flag':True,'status':200,'message':"cancel order successfully!"},{'conversation':conversation,'doctor_channel':doctor_channel,'patient_id':patient_id}
    raise ValueError("loi")



@database_sync_to_async
def get_address(base_user):
    
    return Address.objects.get(base_user=base_user,address_type=AddressEnum.CurrentAddress.value).full_address
    

@database_sync_to_async
def create_or_update_conversation(user,channel_name,flag='doctor'):
    if flag=='doctor':

            # await database_sync_to_async(lambda:ConnectDoctor.objects.filter(doctor=self.user).delete())()
        try:
            conversation=ConnectDoctor.objects.get(
                doctor=user
            )
        except:
            conversation=None
        #create doctor
        if conversation is None:
            conversation=ConnectDoctor.objects.create(
                doctor=user,
                doctor_channel=channel_name   
            )
        #update doctor
        else:
            conversation.doctor_channel=channel_name
            conversation.save()
            if conversation.patient!=None:
                return 'update',conversation.patient
    else:
        
        try:
            conversation=ConnectDoctor.objects.get(
                patient=user
            )
        except:
            conversation=None        

        if not conversation is None:
            conversation.patient_channel=channel_name
            conversation.save()
            return 'update',conversation.doctor
    return ' ',None
    

@database_sync_to_async
def finish_odrer(doctor):
    conversation=ConnectDoctor.objects.filter(doctor=doctor)[0]
    patient_channel=conversation.patient_channel
    # conversation.delete()
    return conversation,patient_channel,conversation.patient.base_user,conversation.fee

@database_sync_to_async
def disable_receving_order(doctor):
    ConnectDoctor.objects.filter(doctor=doctor).delete()
    Address.objects.filter(base_user=doctor.base_user,address_type=AddressEnum.CurrentAddress.value).delete()

def extract_distance(msg_distance):
    # distance: 4.6 km
    return float(msg_distance.split(' ')[-2])


@database_sync_to_async
def get_admin():
    return get_admin_with_out_async()
 
def get_admin_with_out_async():
    admin=Admin.objects.get(admin_id='1')
    return admin,admin.base_user

@database_sync_to_async
def hold_money_patient_with_atomic(conversation,patient,fee):
    with transaction.atomic():
        hold_money = PatientHoldMoney(patient.base_user)
        hold_money.run(fee)
        HistoryPayment.objects.create(
            from_user=patient.base_user,
            to_user=get_admin_with_out_async()[1],
            type=HistoryPaymentEnum.PATIENT_TRANSFER_ADMIN.value,
            disagnostic_bill=conversation.diagnostic_bill,
            amount=conversation.fee
        )
        report=get_report()
        report.holding_amount+=fee
        report.save()


@database_sync_to_async
def return_money_patient_with_atomic(conversation):
    with transaction.atomic(): 
        hold_money=PatientHoldMoney(conversation.patient.base_user)
        hold_money.return_money(conversation.fee)
        report=get_report()
        report.holding_amount-=conversation.fee
        report.save()
        from_user=get_admin_with_out_async()[1]
        to_user=conversation.patient.base_user
        HistoryPayment.objects.create(
            from_user=from_user,
            to_user=to_user,
            type=HistoryPaymentEnum.ADMIN_TRANSFER_PATIENT.value,
            disagnostic_bill=conversation.diagnostic_bill,
            amount=conversation.fee,
            amount_from_user=from_user.wallet.available_amount,
            amount_to_user=to_user.wallet.available_amount
        )

@database_sync_to_async
def transfer_money_with_atomic(conversation,transfer,fee,doctor_base_user):
    with transaction.atomic(): 
        profit=fee-fee*90/100   
        revenue=fee
        fee=fee*90/100
        transfer.transfer(fee,doctor_base_user)
        report=get_report()
        report.holding_amount-=revenue
        report.revenue+=revenue #  cong vao doanh thu
        report.pay_doctor_amount+=fee # tra tien cho bac so
        report.profit+=profit # lay hoa hong
        report.save()
        HistoryPayment.objects.create(
            from_user=get_admin_with_out_async()[1],
            to_user=conversation.doctor.base_user,
            type=HistoryPaymentEnum.ADMIN_TRANSFER_DOCTOR.value,
            disagnostic_bill=conversation.diagnostic_bill,
            amount=fee
        )

def get_report():
    today=datetime.date.today()
    try:
        rerport=Report.objects.get(
            date__month=today.month,
            date__year=today.year
        )
    except:
        rerport=Report.objects.create()
    return rerport

@database_sync_to_async
def create_bill_booking(conversation):
    instance=DiagnosticBill.objects.create(
        doctor=conversation.doctor,
        patient=conversation.patient,
        diagnostic_form=DiagnosticFormEnum.ONLINE.value,
        is_pay=False
    )

    DiagnosticBillDetail.objects.create(
        bill=instance,
        distance=conversation.distance,
        doctor_fee=conversation.fee,
        fee_distance_per_one=FEE_DISTANCE,
        total_fee=DiagnosticBillDetail.get_total_fee(conversation.distance,FEE_DISTANCE,conversation.fee)
    )
    conversation.diagnostic_bill=instance   
    conversation.save()

@database_sync_to_async
def bill_paid(conversation):
    try:
        conversation.diagnostic_bill.is_pay=True
        conversation.diagnostic_bill.save()
    except:
        pass

@database_sync_to_async
def check_booked_doctor_async(patient,conversation):
    return check_booked_doctor(patient,conversation) 

def check_booked_doctor(patient,conversation):
    if conversation.patient==None or conversation.patient==patient:
        return False # doctor was not booked
    return True 

@database_sync_to_async
def createMeeting_async():
    return createMeeting()

@database_sync_to_async
def get_connect(base_user):
    return ConnectDoctor.objects.filter(
        models.Q(doctor__base_user=base_user) | models.Q(patient__base_user=base_user)
    )[0]
    
from apps.Transaction.models import Wallet
@database_sync_to_async
def show(base_user):
    wallet=Wallet.objects.get(base_user=base_user)
    print(wallet.available_amount)