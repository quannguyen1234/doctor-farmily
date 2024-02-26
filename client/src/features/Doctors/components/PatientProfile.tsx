import { FC } from 'react';

import { useGetPatientById } from '@/apis/user.api';

interface PatientProfileProps {
  id: string;
}

const PatientProfile: FC<PatientProfileProps> = ({ id }) => {
  const { data: patientData, isLoading } = useGetPatientById(id);

  if (isLoading) {
    return <div>Loading....</div>;
  }

  return (
    <>
      <div className='flex items-center w-full px-6 mb-10'>
        <div className='w-20'>
          <img
            className='w-full rounded-full'
            src={
              patientData?.baseUser?.avatar
                ? patientData?.baseUser?.avatar
                : 'https://user-images.githubusercontent.com/5709133/50445980-88299a80-0912-11e9-962a-6fd92fd18027.png'
            }
            alt='avatar-benh-nhan'
          />
        </div>
        <div className='pl-3'>
          <h4>
            <span className='font-semibold mr-1'>Bệnh nhân:</span>
            {patientData?.baseUser.fullName}
          </h4>
          <div className='text-sm'>
            <span className='font-semibold mr-1'>SDT:</span>
            {patientData?.baseUser.phoneNumber}
          </div>
          <div className='text-sm'>
            <span className='font-semibold mr-1'>Email:</span>
            {patientData?.baseUser.email}
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientProfile;
