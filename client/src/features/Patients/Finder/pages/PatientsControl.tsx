import { FC } from 'react';

import Button from '@/components/Button/Button';
import { useFetchUser } from '@/features/Authentications/services/authenService';
import RoleApp from '@/enums/role';
import {
  useBookingStatus,
  useDataDoctorBooking,
  useDoctorDistance,
  useDoctorWaitingId
} from '../../stores/booking.store';
import DoctorProfile from '../components/DoctorProfile';
import { useGetDoctorById } from '@/apis/user.api';

interface PatientsControlProps {
  className?: string;
}

const PatientsControl: FC<PatientsControlProps> = () => {
  const { data: userData, isLoading } = useFetchUser();
  const bookingStatus = useBookingStatus();
  const dataDoctorBooking = useDataDoctorBooking();
  const doctorId = useDoctorWaitingId();
  const { data: doctorRes } = useGetDoctorById(doctorId);
  const deliveryPrice = useDoctorDistance();

  if (bookingStatus === 'waiting') {
    return (
      <>
        <div className='flex flex-col justify-center'>
          <div className='w-full text-yellow-400 mb-6 text-lg font-semibold'>
            Đang chờ xác nhận từ bác sĩ ...
          </div>
          {doctorRes && (
            <div>
              <div className='flex items-center w-full px-6 mb-10'>
                <div className='w-20'>
                  <img
                    className='w-full rounded-full'
                    src={
                      doctorRes.avatar
                        ? doctorRes.avatar
                        : 'https://user-images.githubusercontent.com/5709133/50445980-88299a80-0912-11e9-962a-6fd92fd18027.png'
                    }
                    alt='avatar-bac-si'
                  />
                </div>
                <div className='pl-3'>
                  <h4>
                    <span className='font-semibold mr-1'>Bác sĩ:</span>
                    {doctorRes.baseUser?.fullName}
                  </h4>
                  <div className='text-sm'>
                    <span className='font-semibold mr-1'>SDT:</span>
                    {doctorRes.baseUser?.phoneNumber}
                  </div>
                  <div className='text-sm'>
                    <span className='font-semibold mr-1'>Email:</span>
                    {doctorRes.baseUser?.email}
                  </div>
                  <div className='text-sm'>
                    <span className='font-semibold mr-1'>Ngày sinh:</span>
                    {doctorRes.baseUser?.birthDay}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className='w-full px-4'>
          <ul>
            <li>
              <span className='font-semibold pr-2'>Địa chỉ:</span>
              120,
              {doctorRes?.baseUser?.currentAddress?.street},
              {doctorRes?.baseUser?.currentAddress?.district},
              {doctorRes?.baseUser?.currentAddress?.city}
            </li>
            <li>
              <span className='font-semibold pr-2'>Cách đây:</span>
              {deliveryPrice}
            </li>
            <li>
              <span className='font-semibold pr-2'>Chi phí khám:</span>
              {doctorRes?.diagnosticFee} VNĐ
            </li>
            <li>
              <span className='font-semibold pr-2'>Thành tiền:</span>
              <span className='pr-2'>
                {doctorRes?.diagnosticFee &&
                  doctorRes.diagnosticFee +
                    Number(deliveryPrice.slice(0, -3)) * 10000}
              </span>
              VNĐ
            </li>
          </ul>
        </div>
      </>
    );
  }

  if (bookingStatus === 'booked') {
    return <DoctorProfile doctorId={dataDoctorBooking.doctor_id} />;
  }

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      {userData?.user.role === RoleApp.docter && (
        <div>
          <Button primary>Sẵn sàng</Button>
        </div>
      )}
    </div>
  );
};

export default PatientsControl;
