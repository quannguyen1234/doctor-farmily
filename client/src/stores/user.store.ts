import { create } from 'zustand';

import { ISearchDocterParams } from '@/types/common';

export interface IUserStore {
  isAuth: boolean;
  isBooking: boolean;
  searchParams: ISearchDocterParams;
  linkZoom: string;
  isWaiting: boolean;
  modalCallDoctorData: {
    isShow: boolean;
    patientId: string | undefined;
    patient_channel: string;
  };
  actions: {
    setIsAuth: (status: boolean) => void;
    setIsBooking: (status: boolean) => void;
    setIsWaiting: (status: boolean) => void;
    setSearchParams: (searchData: string) => void;
    setLinkZoom: (link: string) => void;
    setModalCallDoctorData: (data: {
      isShow: boolean;
      patientId: string;
      patient_channel: string;
    }) => void;
  };
}

const useUserStore = create<IUserStore>((set) => ({
  isAuth: false,
  isBooking: false,
  linkZoom: '',
  isWaiting: false,
  modalCallDoctorData: {
    isShow: false,
    patientId: undefined,
    patient_channel: ''
  },
  searchParams: {
    deId: '',
    department: '',
    address: {
      district: '',
      city: ''
    }
  },
  actions: {
    setIsAuth: (status) => set((state) => ({ ...state, isAuth: status })),
    setIsBooking: (status) => set((state) => ({ ...state, isBooking: status })),
    setIsWaiting: (status) => set((state) => ({ ...state, isWaiting: status })),
    setLinkZoom: (link: string) =>
      set((state) => ({ ...state, linkZoom: link })),
    setModalCallDoctorData: (data) =>
      set((state) => ({ ...state, modalCallDoctorData: data })),
    setSearchParams: (params) =>
      set((state) => ({
        ...state,
        searchParams: { ...state.searchParams, department: params }
      }))
  }
}));

export const useGetLinkZoom = () => useUserStore((state) => state.linkZoom);
export const useIsWaiting = () => useUserStore((state) => state.isWaiting);

export const useModalCallDoctor = () =>
  useUserStore((state) => state.modalCallDoctorData);

export const useUserActions = () => useUserStore((state) => state.actions);
export const useSearchDocterParams = () =>
  useUserStore((state) => state.searchParams);

export const useIsAuth = () => useUserStore((state) => state.isAuth);
export const useIsBooking = () => useUserStore((state) => state.isBooking);
