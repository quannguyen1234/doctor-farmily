import { create } from 'zustand';

export interface IDoctorsStore {
  isReadly: boolean;
  isBooking: boolean;
  patientOrder: {
    id: string;
    address: string;
  };
  actions: {
    setIsReadly: (status: boolean) => void;
    setIsBooking: (status: boolean) => void;
    setPatientOrder: (patient: { id: string; address: string }) => void;
  };
}

const useDoctorsStore = create<IDoctorsStore>((set) => ({
  isReadly: false,
  isBooking: false,
  patientOrder: {
    id: '',
    address: ''
  },
  actions: {
    setIsReadly: (status) => set((state) => ({ ...state, isReadly: status })),
    setIsBooking: (status) => set((state) => ({ ...state, isBooking: status })),
    setPatientOrder: (patient) =>
      set((state) => ({ ...state, patientOrder: patient }))
  }
}));

export const useDoctorsActions = () =>
  useDoctorsStore((state) => state.actions);

export const useGetPatientOrder = () =>
  useDoctorsStore((state) => state.patientOrder);

export const useIsReadly = () => useDoctorsStore((state) => state.isReadly);
export const useIsBooking = () => useDoctorsStore((state) => state.isBooking);
