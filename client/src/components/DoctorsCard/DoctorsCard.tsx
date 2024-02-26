import { useJsApiLoader } from '@react-google-maps/api';
import { FC, useEffect, useState } from 'react';
import Geocode from 'react-geocode';

import { IDuration } from '@/types/common';
import { useCurrentLocation } from '../Map';
import { useUserBookingActions } from '@/features/Patients/stores/booking.store';

type Libraries = (
  | 'drawing'
  | 'geometry'
  | 'localContext'
  | 'places'
  | 'visualization'
)[];

interface DoctorsCardProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullName: string;
  department: string;
  address: string;
  avatar: string;
}

const DoctorsCard: FC<DoctorsCardProps> = ({
  fullName,
  address,
  avatar,
  department
}) => {
  const [libraries] = useState<Libraries>(['places']);
  useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API as string,
    libraries
  });
  const currentLocation = useCurrentLocation();
  const { setDistance, setDoctorDistance } = useUserBookingActions();

  // tọa độ của bác sĩ
  const [duration, setDuration] = useState<IDuration>();
  // Khoản cách
  const [distanceCard, setDistanceCard] = useState('');

  useEffect(() => {
    if (address) {
      Geocode.fromAddress(address).then((res) => {
        const { lat, lng } = res.results[0].geometry.location;

        setDuration({ lat, lng });
      });
    }
  }, [address]);

  useEffect(() => {
    if (duration) {
      const calculateRoute = async () => {
        const directionsService = new google.maps.DirectionsService();

        const result = await directionsService.route({
          origin: currentLocation.location,
          destination: duration,
          travelMode: google.maps.TravelMode.DRIVING
        });

        setDistanceCard(result.routes[0].legs[0].distance?.text as string);
        setDistance(result.routes[0].legs[0].distance?.text as string);
        setDoctorDistance(distanceCard);
      };

      calculateRoute();
    }
  }, [
    currentLocation.location,
    distanceCard,
    duration,
    setDistance,
    setDoctorDistance
  ]);

  return (
    <div className='w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-md hover:cursor-pointer'>
      <img
        className='p-8 rounded-t-lg'
        src={
          avatar ||
          'https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg?crop=0.66698xw:1xh;center,top&resize=1200:*'
        }
        alt='avatar'
      />
      <div className='px-5 pb-5'>
        <div>
          <h5 className='text-xl font-semibold tracking-tight text-gray-900 dark:text-white'>
            {fullName}
          </h5>
          {department && (
            <h6>
              <span className='font-semibold pr-2 text-sm'>Chuyên khoa:</span>
              {department}
            </h6>
          )}
          <p>
            <span className='font-semibold pr-2 text-sm'>Địa chỉ:</span>
            {address}
          </p>
          <p>
            <span className='font-semibold pr-2 text-sm'>Cách đây:</span>
            {distanceCard}
          </p>
        </div>
        <div className='flex items-center mt-2.5 mb-2'>
          <svg
            aria-hidden='true'
            className='w-5 h-5 text-yellow-300'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <title>First star</title>
            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
          </svg>
          <svg
            aria-hidden='true'
            className='w-5 h-5 text-yellow-300'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <title>Second star</title>
            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
          </svg>
          <svg
            aria-hidden='true'
            className='w-5 h-5 text-yellow-300'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <title>Third star</title>
            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
          </svg>
          <svg
            aria-hidden='true'
            className='w-5 h-5 text-yellow-300'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <title>Fourth star</title>
            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
          </svg>
          <svg
            aria-hidden='true'
            className='w-5 h-5 text-yellow-300'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <title>Fifth star</title>
            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
          </svg>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-3xl font-bold text-gray-900 dark:text-white'>
            {Number(distanceCard.slice(0, -3)) &&
              Number(distanceCard.slice(0, -3)) * 10000}
            <span className='text-sm pl-2'>VNĐ</span>
          </span>
        </div>
        <div className='flex justify-center gap-3 mt-3'>
          <button className='ring-2 ring-primary bg-primary text-white rounded-full px-4 py-2 font-semibold text-lg hover:opacity-90 min-w-[120px]'>
            Thông tin
          </button>
          <button className='ring-2 ring-gray-200 rounded-full px-4 py-2 font-semibold text-lg hover:opacity-90 min-w-[120px]'>
            Đặt khám
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorsCard;
