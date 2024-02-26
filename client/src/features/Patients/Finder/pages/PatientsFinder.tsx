import { FC, useEffect, useState } from 'react';
import Geocode from 'react-geocode';

import { Map } from '@/components/Map';
import PatientsControl from './PatientsControl';
import { useDataDoctorBooking } from '@/features/Patients/stores/booking.store';
import { IDuration } from '@/types/common';

const PatientsFinder: FC = () => {
  const doctorDataBooking = useDataDoctorBooking();
  const [duration, setDuration] = useState<IDuration>();

  useEffect(() => {
    if (doctorDataBooking) {
      Geocode.fromAddress(doctorDataBooking.address).then((res) => {
        const { lat, lng } = res.results[0].geometry.location;

        setDuration({ lat, lng });
      });
    }
  }, [doctorDataBooking]);

  return (
    <div className='w-full h-full pb-10'>
      <Map duration={duration}>
        <PatientsControl />
      </Map>
    </div>
  );
};

export default PatientsFinder;
