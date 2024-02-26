import { FC, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { useLocation, useNavigate } from 'react-router-dom';

import DoctorsCard from '@/components/DoctorsCard/DoctorsCard';
import PatientsFinder from './PatientsFinder';
import {
  useBookingStatus,
  useGetDistance,
  useGetDoctorsBooking,
  useUserBookingActions
} from '../../stores/booking.store';
import LOCAL_STORAGE_KEY from '@/utils/constant/localStorage';
import useConvertAddress from '@/hooks/useConvertAddress';
import { PRIVATE_ROUTES } from '@/utils/constant/routes';

const FinderDocter: FC = () => {
  const doctorsRes = useGetDoctorsBooking();
  const {
    setBookingStatus,
    setDataBookingSocket,
    setDoctorsRes,
    setDoctorWaitingId
  } = useUserBookingActions();
  const bookingStatus = useBookingStatus();
  const address = useConvertAddress();
  const { state } = useLocation();
  const distance = useGetDistance();
  const navigate = useNavigate();

  const { sendJsonMessage, lastMessage } = useWebSocket(
    `ws://127.0.0.1:8000/booking/conversation/${localStorage.getItem(
      LOCAL_STORAGE_KEY.accessToken
    )}`,
    { share: true }
  );

  const handleSubmit = (doctorId: string) => {
    sendJsonMessage({
      type: 'patient-choose-doctor',
      doctor: doctorId,
      address,
      distance
    });

    setDoctorWaitingId(doctorId);
    setBookingStatus('waiting');
  };

  useEffect(() => {
    if (lastMessage) {
      const dataFinish = JSON.parse(lastMessage?.data);
      if (dataFinish.type === 'doctor-finish-order') {
        navigate(PRIVATE_ROUTES.rating);
      }
    }
  }, [lastMessage, navigate]);

  useEffect(() => {
    if (state.deId && state.address) {
      sendJsonMessage({
        type: 'get-doctors',
        de_id: state.deId,
        address: state.address
      });
    }
  }, [sendJsonMessage, state.address, state.deId]);

  useEffect(() => {
    if (lastMessage) {
      if (JSON.parse(lastMessage?.data)) {
        setDoctorsRes(JSON.parse(lastMessage?.data).doctors);
      }
    }
  }, [lastMessage, setDoctorsRes]);

  useEffect(() => {
    if (lastMessage) {
      const dataConfirm = JSON.parse(lastMessage?.data);

      if (dataConfirm) {
        if (dataConfirm.type === 'doctor-confirm-order' && dataConfirm.flag) {
          setDataBookingSocket(dataConfirm);
          setBookingStatus('booked');
        }
      }
    }
  }, [lastMessage, setDataBookingSocket, setBookingStatus]);

  if (bookingStatus !== 'idle') {
    return <PatientsFinder />;
  }

  return (
    <>
      {doctorsRes?.length ? (
        <div className='grid grid-cols-4 gap-4'>
          {doctorsRes.map((doctor) => (
            <div
              key={doctor.doctor_id}
              onClick={() => handleSubmit(doctor.doctor_id)}
            >
              <DoctorsCard
                fullName={doctor.full_name}
                avatar={doctor.avatar}
                address={doctor.address}
                department={doctor?.departments[0]?.name}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center text-3xl'>Đang tìm kiếm bác sĩ ...</div>
      )}
    </>
  );
};

export default FinderDocter;
