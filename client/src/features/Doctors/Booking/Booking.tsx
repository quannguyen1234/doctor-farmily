import { FC, useEffect, useState } from 'react';
import Geocode from 'react-geocode';

import { Map } from '@/components/Map';
import DoctorControl from './SidebarControl';
import { useGetPatientOrder } from '../doctors.store';
import { useGetPatientById } from '@/apis/user.api';
import { IDuration } from '@/types/common';

const DoctorBooking: FC = () => {
  const [duration, setDuration] = useState<IDuration>();
  const patient = useGetPatientOrder();

  const { data: userData } = useGetPatientById(patient.id);

  useEffect(() => {
    if (userData && userData.baseUser.currentAddress) {
      const { street, village, district, city } =
        userData.baseUser.currentAddress;
      Geocode.fromAddress(`${street}, ${village}, ${district}, ${city}`).then(
        (res) => {
          const { lat, lng } = res.results[0].geometry.location;

          setDuration({ lat, lng });
        }
      );
    }
  }, [userData]);

  return (
    <div className='w-full h-full pb-10'>
      <Map duration={duration}>
        <DoctorControl />
      </Map>
    </div>
  );
};

export default DoctorBooking;
