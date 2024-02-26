import { useQuery } from '@tanstack/react-query';

import http from '@/configs/api/axios.config';

interface IRating {
  doctorId: string;
  note: string;
  patientId: string;
  star: number;
}
interface IGetDoctorRes {
  doctorId: string;
  degree: string;
  currentJob: string;
  baseUser: {
    id: string;
    phoneNumber: string;
    email: string;
    fullName: string;
    citizenIdentification: string;
    birthDay: string;
    isActive: boolean;
    currentAddress: {
      addressId: string;
      street: string;
      village: string;
      district: string;
      city: string;
    };
  };
  notarizedImages: string[];
  departments: {
    deId: string;
    name: string;
    description: any;
  }[];
  rating: IRating[];
  meanStar: number;
  avatar: string | null;
  diagnosticFee: number;
  flag: boolean;
  status: number;
}

const getDoctorApi = async (doctorId: string) => {
  const res = await http.get<IGetDoctorRes>(`user/doctors/${doctorId}`);
  return res as unknown as IGetDoctorRes;
};

export const useGetDoctorById = (doctorId: string) => {
  return useQuery({
    queryKey: ['get-doctor', doctorId],
    queryFn: () => getDoctorApi(doctorId)
  });
};

interface IGetPatientRes {
  patientId: string;
  baseUser: {
    id: string;
    phoneNumber: string;
    email: string;
    fullName: string;
    citizenIdentification: string | null;
    birthDay: string;
    isActive: boolean;
    avatar: string;
    currentAddress: {
      addressId: string;
      street: string;
      village: string;
      district: string;
      city: string;
      date: string;
    };
  };
  flag: boolean;
  status: number;
}

export const getPatientByIdApi = async (id: string) => {
  const res = await http.get(`user/patients/${id}`);
  return res as unknown as IGetPatientRes;
};

export const useGetPatientById = (patientId: string) => {
  return useQuery({
    queryKey: ['get-patient', patientId],
    queryFn: () => getPatientByIdApi(patientId)
  });
};

export const getAllDoctorsApi = async () => {
  const res = await http.get('user/doctors/get-doctor?approved=0');
  return res as unknown as {
    data: IGetDoctorRes[];
    flag: boolean;
    status: number;
  };
};

export const useGetAllDoctors = () => {
  return useQuery({
    queryKey: ['get-all-doctors'],
    queryFn: getAllDoctorsApi
  });
};
