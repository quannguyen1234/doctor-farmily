import { create } from 'zustand';

import { IDoctor } from '@/types/user';
import { BookingStatus } from '@/types/common';

export interface IUserBookingStore {
  doctors: IDoctor[] | undefined;
  doctorWaitingId: string;
  bookingStatus: BookingStatus;
  dataBookingSocket: any;
  doctorDistance: string;
  distance: string;
  actions: {
    setDoctorsRes: (doctors: IDoctor[]) => void;
    setBookingStatus: (status: BookingStatus) => void;
    setDataBookingSocket: (data: any) => void;
    setDistance: (data: string) => void;
    setDoctorWaitingId: (doctorId: string) => void;
    setDoctorDistance: (distance: string) => void;
  };
}

const useUserBookingStore = create<IUserBookingStore>((set) => ({
  doctors: undefined,
  bookingStatus: 'idle',
  dataBookingSocket: undefined,
  distance: '',
  doctorDistance: '',
  doctorWaitingId: '',
  actions: {
    setDoctorsRes: (doctorsList: IDoctor[]) =>
      set((state) => ({ ...state, doctors: doctorsList })),
    setBookingStatus: (status: BookingStatus) =>
      set((state) => ({ ...state, bookingStatus: status })),
    setDataBookingSocket: (data) =>
      set((state) => ({ ...state, dataBookingSocket: data })),
    setDistance: (data) => set((state) => ({ ...state, distance: data })),
    setDoctorWaitingId: (doctorId) =>
      set((state) => ({ ...state, doctorWaitingId: doctorId })),
    setDoctorDistance: (distance: string) =>
      set((state) => ({ ...state, doctorDistance: distance }))
  }
}));

export const useGetDistance = () =>
  useUserBookingStore((state) => state.distance);

export const useDoctorWaitingId = () =>
  useUserBookingStore((state) => state.doctorWaitingId);

export const useDoctorDistance = () =>
  useUserBookingStore((state) => state.doctorDistance);

export const useBookingStatus = () =>
  useUserBookingStore((state) => state.bookingStatus);

export const useDataDoctorBooking = () =>
  useUserBookingStore((state) => state.dataBookingSocket);

export const useGetDoctorsBooking = () =>
  useUserBookingStore((state) => state.doctors);

export const useUserBookingActions = () =>
  useUserBookingStore((state) => state.actions);
