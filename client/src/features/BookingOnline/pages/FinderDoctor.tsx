import { FC } from 'react';
import CardDoctorOnline from '../components/CardDoctorOnline';

interface FinderDoctorProps {
  doctors: any;
  sendJsonMessage?: any;
}

const FinderDoctor: FC<FinderDoctorProps> = ({ doctors, sendJsonMessage }) => {
  return (
    <div className='grid grid-cols-4'>
      {doctors &&
        doctors.map((doctor: any) => {
          return (
            <CardDoctorOnline
              sendJsonMessage={sendJsonMessage}
              key={doctor.doctor_id}
              doctorId={doctor.doctor_id}
            />
          );
        })}
    </div>
  );
};

export default FinderDoctor;
