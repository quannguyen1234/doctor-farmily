import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

import { IPatientRes } from '@/types/user';
import http from '@/configs/api/axios.config';
import { IAuthValidationForm } from '@/types/authentications';
import { IUserAuthen } from '@/features/Authentications/types';

export const getAllPatients = async (): Promise<IPatientRes[]> => {
  const data = await http.get('user/patients');
  return data.data;
};

export const useGetPatients = () => {
  return useQuery({
    queryKey: ['get-patients'],
    queryFn: getAllPatients,
    staleTime: 5 * 60 * 1000
  });
};

export const getPatient = async (patientId: string): Promise<IPatientRes> => {
  return http.get(`user/patients/${patientId}`);
};

export const useGetPatient = (patientId: string) => {
  return useQuery({
    queryKey: ['get-patient', patientId],
    queryFn: () => getPatient(patientId),
    staleTime: 5 * 60 * 1000
  });
};

export const createPatient = async ({
  email,
  phoneNumber,
  fullName,
  password,
  birthDay
}: Omit<IAuthValidationForm, 'confirmPassword'>): Promise<IUserAuthen> => {
  try {
    return await http.post('user/patients', {
      baseUser: {
        email,
        phoneNumber,
        fullName,
        password,
        birthDay
      }
    });
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};
export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['create-patient'],
    mutationFn: (data: IAuthValidationForm) => createPatient(data)
  });

  if (mutation.isSuccess) {
    queryClient.invalidateQueries(['get-patients']);
  }
  return mutation;
};

export const updatePatient = async (
  data: IPatientRes
): Promise<IUserAuthen> => {
  const { patientId, ...rest } = data;
  try {
    return await http.patch(`user/patients/${data.patientId}`, rest);
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['update-patient'],
    mutationFn: (data: IPatientRes) => updatePatient(data)
  });

  if (mutation.isSuccess) {
    queryClient.invalidateQueries(['get-patients']);
  }
  return mutation;
};

export const deletePatient = async (
  patientId: string
): Promise<{ status: number; flag: boolean }> => {
  const response = await http.delete(`user/patients/${patientId}`);
  return response.data;
};

export const useDeletePatient = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['delete-patient'],
    mutationFn: (patientId: string) => deletePatient(patientId)
  });

  if (mutation.isSuccess) {
    queryClient.invalidateQueries(['get-patients']);
  }
  return mutation;
};
