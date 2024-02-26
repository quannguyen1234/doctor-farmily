import {
  useJsApiLoader,
  GoogleMap,
  MarkerF,
  DirectionsRenderer
} from '@react-google-maps/api';
import { FC, memo, useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import { useCurrentLocation } from './mapStore';
import styles from './Map.module.scss';
import { IDuration } from '@/types/common';

const cx = classNames.bind(styles);

type Libraries = (
  | 'drawing'
  | 'geometry'
  | 'localContext'
  | 'places'
  | 'visualization'
)[];

interface MapProps {
  children: JSX.Element;
  duration?: IDuration;
}

const Map: FC<MapProps> = ({ children, duration }) => {
  const [directionRes, setDirectionRes] =
    useState<google.maps.DirectionsResult | null>(null);
  const [libraries] = useState<Libraries>(['places']);
  const currentLocation = useCurrentLocation();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API as string,
    libraries
  });

  useEffect(() => {
    if (duration) {
      const calculateRoute = async () => {
        const directionsService = new google.maps.DirectionsService();

        const result = await directionsService.route({
          origin: currentLocation.location,
          destination: duration,
          travelMode: google.maps.TravelMode.DRIVING
        });

        setDirectionRes(result);
      };

      calculateRoute();
    }
  }, [currentLocation.location, duration]);

  if (!isLoaded) {
    return <div>Loading map....</div>;
  }

  return (
    <div className='google-map flex h-full w-full border shadow-xl overflow-hidden rounded-xl'>
      <div className='w-full'>
        {currentLocation.location.lat && (
          <GoogleMap
            center={currentLocation.location}
            zoom={17}
            mapContainerStyle={{ width: '100%', height: '100%' }}
          >
            <MarkerF animation={1} position={currentLocation.location} />
            {directionRes && <DirectionsRenderer directions={directionRes} />}
          </GoogleMap>
        )}
      </div>
      <aside
        className={`${cx(
          'sidebar'
        )} w-full flex flex-col overflow-y-scroll items-center pt-4 pb-4`}
      >
        {children}
      </aside>
    </div>
  );
};

export default memo(Map);
