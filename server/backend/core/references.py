from enum import Enum
 
class ImageEnum(Enum):

    DoctorNotarizedImage = 1    
    Avatar = 2
    DepartmentImage = 3

    @classmethod
    def __tupple__(cls):
        arr=[]
        for i in cls.__iter__():
            arr.append((i.value,i.name))
        return tuple(arr)
    
class AddressEnum(Enum):

    CurrentAddress = 1    
    BookingCalendarAddress = 2
    LivingAdress=3

    @classmethod
    def __tupple__(cls):
        arr=[]
        for i in cls.__iter__():
            arr.append((i.value,i.name))
        return tuple(arr)


class TypeTransactionEnum(Enum):

    TRANSFER_MONEY = 0  
    RECIEVE_MONEY = 1
   

    @classmethod
    def __tupple__(cls):
        arr=[]
        for i in cls.__iter__():
            arr.append((i.value,i.name))
        return tuple(arr)
    

class StatusTransactionEnum(Enum):

    MONEY_IN = True
    MONEY_OUT = False


class PaymentMethodEnum(Enum):
    BANKING = 0
    CASH = 1

    @classmethod
    def __tupple__(cls):
        arr=[]
        for i in cls.__iter__():
            arr.append((i.value,i.name))
        return tuple(arr)
    

class DiagnosticFormEnum(Enum):
    ONLINE = 0
    OFLINE = 1

    @classmethod
    def __tupple__(cls):
        arr=[]
        for i in cls.__iter__():
            arr.append((i.value,i.name))
        return tuple(arr)
    
class HistoryPaymentEnum(Enum):
    
    PATIENT_TRANSFER_ADMIN=0
    ADMIN_TRANSFER_PATIENT=1
    ADMIN_TRANSFER_DOCTOR=2

    @classmethod
    def __tupple__(cls):
        arr=[]
        for i in cls.__iter__():
            arr.append((i.value,i.name))
        return tuple(arr)
    
    @classmethod
    def get_key_by_value(enum_class, value):
        for key, member in enum_class.__members__.items():
            if member.value == value:
                return key

FEE_DISTANCE=10000