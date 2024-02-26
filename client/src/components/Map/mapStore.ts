import { create } from 'zustand';

// import { ILocation } from '@/types/map';

interface ICurrentLocation {
  isLocation: boolean;
  location: google.maps.LatLng | google.maps.LatLngLiteral;
  actions: {
    setCurrentLocation: (
      payload: google.maps.LatLng | google.maps.LatLngLiteral
    ) => void;
  };
}

const useCurrentLocationStore = create<ICurrentLocation>((set) => ({
  isLocation: false,
  location: {
    lat: 0,
    lng: 0
  },
  actions: {
    setCurrentLocation: (payload) =>
      set((state) => ({ ...state, location: payload }))
  }
}));

export const useCurrentLocation = () =>
  useCurrentLocationStore((state) => state);

export const useCurrentLocationActions = () =>
  useCurrentLocationStore((state) => state.actions);
