import { FC, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';

import { useFetchUser } from '@/features/Authentications/services/authenService';
import RoleApp from '@/enums/role';
import LOCAL_STORAGE_KEY from '@/utils/constant/localStorage';
import { useDoctorsActions, useIsReadly } from '../doctors.store';
import useConvertAddress from '@/hooks/useConvertAddress';
import PatientProfile from './PatientProfile';
import { getPatientByIdApi } from '@/apis/user.api';
import Modal from '@/components/Modal/Modal';
import ModalMedicalRecord from '../components/ModalMedicalRecord';

interface DoctorControlProps {
  className?: string;
}

interface IPatientSocket {
  type: string;
  message: string;
  patient_id: string;
  patient_name: string;
  patient_channel: string;
  address: string;
}

const DoctorControl: FC<DoctorControlProps> = () => {
  const { data: userData, isLoading } = useFetchUser();
  const [patient, setPatient] = useState<IPatientSocket>();
  const [patientRes, setPatientRes] = useState<any>(null);
  const [isAccept, setIsAccept] = useState<boolean>(false);
  const [isModalMedicalRecord, setIsModalMedicalRecord] =
    useState<boolean>(false);

  const isReadly = useIsReadly();
  const { setIsReadly, setPatientOrder } = useDoctorsActions();
  const address = useConvertAddress();

  const { sendJsonMessage, lastMessage } = useWebSocket(
    `ws://127.0.0.1:8000/booking/conversation/${localStorage.getItem(
      LOCAL_STORAGE_KEY.accessToken
    )}`,
    { share: true }
  );

  const handleSendMessage = () => {
    sendJsonMessage({ type: 'doctor-set-address', address });

    if (!JSON.parse(lastMessage?.data).data.channel) {
      setIsReadly(true);
    }
  };

  const handleConnect = () => {
    if (isReadly) {
      sendJsonMessage({ type: 'disconnect' });

      if (JSON.parse(lastMessage?.data).data.message === 'disconnect') {
        setIsReadly(false);
      }
    } else {
      handleSendMessage();
    }
  };

  const handleAccept = () => {
    sendJsonMessage({
      type: 'doctor-confirm-order',
      is_receive_order: true,
      patient_id: patient?.patient_id,
      patient_channel: patient?.patient_channel
    });

    setIsAccept(true);
    if (patient?.patient_id) {
      setPatientOrder({
        id: patient?.patient_id,
        address: patient?.address
      });
    }
  };

  const handleReject = () => {
    sendJsonMessage({
      type: 'doctor-confirm-order',
      is_receive_odrder: false,
      patient_id: patient?.patient_id,
      patient_channel: patient?.patient_channel
    });
  };

  useEffect(() => {
    if (lastMessage?.data) {
      if (JSON.parse(lastMessage?.data).type === 'doctor-confirm-order') {
        const id = JSON.parse(lastMessage?.data).patient_id;

        const getPatient = async () => {
          const res = await getPatientByIdApi(id);

          if (res.flag) {
            setPatientRes(res);
          }
        };
        setPatient(JSON.parse(lastMessage?.data));
        getPatient();
      }
    }
  }, [lastMessage?.data]);

  if (isAccept) {
    if (patient) {
      return <PatientProfile patientId={patient?.patient_id} />;
    }
  }

  if (lastMessage?.data) {
    if (JSON.parse(lastMessage?.data).type === 'doctor-confirm-order') {
      return (
        <div className='flex flex-col'>
          {patientRes && (
            <div>
              <div className='flex flex-col item-center'>
                <div className='flex items-center w-full px-6 mb-10'>
                  <div className='w-20'>
                    <img
                      className='w-full rounded-full'
                      src={
                        patientRes.avatar
                          ? patientRes.avatar
                          : 'https://user-images.githubusercontent.com/5709133/50445980-88299a80-0912-11e9-962a-6fd92fd18027.png'
                      }
                      alt='avatar-bac-si'
                    />
                  </div>
                  <div className='pl-3'>
                    <h4>
                      <span className='font-semibold mr-1'>Tên bệnh nhân:</span>
                      {patientRes.baseUser?.fullName}
                    </h4>
                    <div className='text-sm'>
                      <span className='font-semibold mr-1'>SDT:</span>
                      {patientRes.baseUser?.phoneNumber}
                    </div>
                    <div className='text-sm'>
                      <span className='font-semibold mr-1'>Email:</span>
                      {patientRes.baseUser?.email}
                    </div>
                    <div className='text-sm'>
                      <span className='font-semibold mr-1'>Ngày sinh:</span>
                      {patientRes.baseUser?.birthDay}
                    </div>
                  </div>
                </div>
                <div className='mx-4 flex justify-center'>
                  {patientRes.patientId && (
                    <Modal className='h-[80vh]' isShow={isModalMedicalRecord}>
                      <ModalMedicalRecord patientId={patientRes.patientId} />
                      <button
                        className='mb-10 min-w-[120px] text-slate-300 ring-2 bg-white ring-gray-300 rounded-full px-4 py-2 font-semibold text-lg hover:bg-gray-50'
                        onClick={() => setIsModalMedicalRecord(false)}
                      >
                        Tắt
                      </button>
                    </Modal>
                  )}
                  <button
                    onClick={() => setIsModalMedicalRecord(true)}
                    className='text-slate-300 ring-2 bg-white ring-gray-300 rounded-full px-4 py-2 mb-3 font-semibold text-lg hover:bg-gray-50'
                  >
                    Xem hồ sơ bệnh án
                  </button>
                </div>
              </div>
              <div className='w-full px-4'>
                <ul>
                  <li>
                    <span className='font-semibold pr-2'>Địa chỉ:</span>
                    120,
                    {patientRes?.baseUser?.currentAddress.street},
                    {patientRes?.baseUser?.currentAddress.district},
                    {patientRes?.baseUser?.currentAddress.city}
                  </li>
                </ul>
              </div>
            </div>
          )}
          <div className='flex justify-center gap-3 mt-10'>
            <button
              className='text-white ring-2 ring-primary bg-primary rounded-full px-4 py-2 mb-3 font-semibold text-lg hover:opacity-90'
              onClick={handleAccept}
            >
              Chấp nhận
            </button>
            <button
              className='text-slate-300 ring-2 bg-white ring-gray-300 rounded-full px-4 py-2 mb-3 font-semibold text-lg hover:bg-gray-50'
              onClick={handleReject}
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      );
    }
  }

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      {userData?.user.role === RoleApp.docter && (
        <div>
          <button
            onClick={() => {
              handleConnect();
            }}
            className={`ring-2 ${
              isReadly
                ? 'ring-rose-600 bg-rose-500 text-white'
                : 'ring-primary bg-primary text-white'
            } rounded-full px-4 py-2 mb-3 font-semibold text-lg hover:opacity-90 min-w-[120px]`}
          >
            {isReadly ? 'Hủy' : 'Nhận cuộc hẹn gấp'}
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorControl;
