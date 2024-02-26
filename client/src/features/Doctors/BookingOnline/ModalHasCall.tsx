import { FC, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';

import { useGetPatientById } from '@/apis/user.api';
import LOCAL_STORAGE_KEY from '@/utils/constant/localStorage';
import { useGetMedicalRecordById } from '../apis/doctor.api';
import ModalMedicalRecord from '../components/ModalMedicalRecord';
import { useModalCallDoctor, useUserActions } from '@/stores/user.store';

interface ModalHasCallProps {
  patient_id: any;
  patient_channel: string;
}

const ModalHasCall: FC<ModalHasCallProps> = ({
  patient_id,
  patient_channel
}) => {
  // const navigate = useNavigate();
  const { setLinkZoom, setModalCallDoctorData } = useUserActions();
  const modalCallDoctor = useModalCallDoctor();
  const { data } = useGetPatientById(patient_id);
  const { data: patientMedical } = useGetMedicalRecordById(patient_id);

  const { lastMessage, sendJsonMessage } = useWebSocket(
    `ws://127.0.0.1:8000/booking/conversation-online/${localStorage.getItem(
      LOCAL_STORAGE_KEY.accessToken
    )}`,
    { share: true }
  );

  useEffect(() => {
    if (lastMessage?.data) {
      if (
        JSON.parse(lastMessage.data).type === 'doctor-confirm-order' &&
        JSON.parse(lastMessage.data).link_zoom
      ) {
        setLinkZoom(JSON.parse(lastMessage.data).link_zoom);
        if (modalCallDoctor) {
          setModalCallDoctorData({
            patient_channel: modalCallDoctor.patient_channel,
            patientId: modalCallDoctor.patientId as string,
            isShow: false
          });
        }
      }
    }
  }, [lastMessage?.data, modalCallDoctor, setLinkZoom, setModalCallDoctorData]);

  const handleAccept = () => {
    sendJsonMessage({
      type: 'doctor-confirm-order',
      is_receive_order: true,
      patient_id,
      patient_channel
    });
  };

  return (
    <div>
      {data && (
        <div className='flex align-middle gap-4'>
          <div className='w-20'>
            <img
              className='rounded-full object-cover'
              src='https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=2000'
              alt='avatar'
            />
          </div>
          <ul>
            <li>
              <span className='font-semibold pr-2'>Bệnh nhân:</span>
              {data.baseUser.fullName}
            </li>
            <li>
              <span className='font-semibold pr-2'>Ngày sinh:</span>
              {data.baseUser.phoneNumber}
            </li>
            <li>
              <span className='font-semibold pr-2'>Email:</span>
              {data.baseUser.email}
            </li>
          </ul>
        </div>
      )}

      <div className='flex justify-center gap-3 mt-6'>
        <button
          className='mb-10 min-w-[120px] text-slate-300 ring-2 bg-green-400 ring-green-300 text-white rounded-full px-4 py-2 font-semibold text-lg hover:bg-green-300'
          onClick={() => handleAccept()}
        >
          Chấp nhận
        </button>
        <button
          className='mb-10 min-w-[120px] text-slate-300 ring-2 bg-white ring-gray-300 rounded-full px-4 py-2 font-semibold text-lg hover:bg-gray-50'
          onClick={() => handleAccept()}
        >
          Từ chối
        </button>
      </div>

      {patientMedical?.patient && (
        <div>
          <ModalMedicalRecord patientId={patientMedical.patient.patientId} />
        </div>
      )}
    </div>
  );
};

export default ModalHasCall;
