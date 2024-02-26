import { FC, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';

import LOCAL_STORAGE_KEY from '@/utils/constant/localStorage';

import { useUserActions } from '@/stores/user.store';

const DoctorBookingOnline: FC = () => {
  const { setModalCallDoctorData } = useUserActions();

  const { lastMessage } = useWebSocket(
    `ws://127.0.0.1:8000/booking/conversation-online/${localStorage.getItem(
      LOCAL_STORAGE_KEY.accessToken
    )}`,
    { share: true }
  );

  useEffect(() => {
    if (lastMessage?.data) {
      if (
        JSON.parse(lastMessage.data).type === 'doctor-confirm-order' &&
        JSON.parse(lastMessage.data).patient_id
      ) {
        setModalCallDoctorData({
          isShow: true,
          patientId: JSON.parse(lastMessage.data).patient_id,
          patient_channel: JSON.parse(lastMessage.data).patient_channel
        });
      }
    }
  }, [lastMessage?.data, setModalCallDoctorData]);

  return <div className='text-white select-none'>booking</div>;
};

export default DoctorBookingOnline;
