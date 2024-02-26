import Geocode from 'react-geocode';
import { useEffect, useState } from 'react';

import { useCurrentLocation } from '@/components/Map/mapStore';

const useConvertAddress = () => {
  const [address, setAddress] = useState<any>({
    street: '',
    village: '',
    district: '',
    city: ''
  });
  const currentLocation = useCurrentLocation();

  useEffect(() => {
    if (currentLocation.location.lat) {
      const { location } = currentLocation;
      const getAddress = async () => {
        const response = await Geocode.fromLatLng(
          String(location.lat),
          String(location.lng)
        );

        const locationAddress = response.results[0].address_components.filter(
          (addressItem: any) => {
            return (
              (addressItem.types[0] === 'administrative_area_level_1' &&
                addressItem.types[1] === 'political') ||
              (addressItem.types[0] === 'administrative_area_level_2' &&
                addressItem.types[1] === 'political') ||
              addressItem.types[0] === 'route'
            );
          }
        );

        setAddress({
          street: locationAddress[0]?.long_name || '',
          village: '',
          district: locationAddress[1]?.long_name || '',
          city: locationAddress[2]?.long_name || ''
        });
      };

      getAddress();
    }
  }, [currentLocation]);

  return address;
};

export default useConvertAddress;
