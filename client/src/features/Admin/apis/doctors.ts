/* eslint-disable react-hooks/rules-of-hooks */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { IDoctor } from '@/types/user';
import http from '@/configs/api/axios.config';
import { registerDocterApi } from '@/features/Authentications/services/authenService';
import {
  IDoctorAuthen,
  IRegisterFormDocter
} from '@/features/Authentications/types';

export const getRequestDoctor = async (): Promise<IDoctor[]> => {
  try {
    const resDoc = await http.get('user/doctors/get-doctor?approved=1');
    return resDoc.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const useGetRequestDoctors = () => {
  return useQuery({
    queryKey: ['get-request-doctor'],
    queryFn: getRequestDoctor,
    staleTime: 5 * 60 * 1000
  });
};

export const grantDoctor = async (
  doctorId: string
): Promise<{ mes: string; flag: boolean }> => {
  try {
    return await http.post(`user/doctors/${doctorId}/active`);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const usegrantDoctor = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['grant-doctor'],
    mutationFn: (deId: string) => grantDoctor(deId)
  });
  if (mutation.isSuccess) {
    queryClient.invalidateQueries(['get-request-doctor']);
  }
  return mutation;
};

// Doctor approved
export const getAllDoctor = async (): Promise<IDoctor[]> => {
  try {
    const resDoc = await http.get('user/doctors/get-doctor?approved=0');
    return resDoc.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const useGetAllDoctors = () => {
  return useQuery({
    queryKey: ['get-doctors'],
    queryFn: getAllDoctor,
    staleTime: 5 * 60 * 1000
  });
};

export const deleteDoctor = async (
  id: string
): Promise<{ status: number; flag: boolean }> => {
  const response = await http.delete(`user/doctors/${id}`);
  return response.data;
};

export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['delete-doctor'],
    mutationFn: (id: string) => deleteDoctor(id)
  });

  if (mutation.isSuccess) {
    queryClient.invalidateQueries(['get-doctors']);
  }
  return mutation;
};

export const useCreateDoctor = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['create-patient'],
    mutationFn: (data: IRegisterFormDocter) => registerDocterApi(data)
  });

  if (mutation.isSuccess) {
    queryClient.invalidateQueries(['get-request-doctor']);
  }
  return mutation;
};

export const updateDoctor = async (data: IDoctor): Promise<IDoctorAuthen> => {
  const { doctorId, ...rest } = data;
  try {
    return await http.patch(`user/doctors/${data.doctorId}`, rest);
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['update-doctor'],
    mutationFn: (data: IDoctor) => updateDoctor(data)
  });
  if (mutation.isSuccess) {
    queryClient.invalidateQueries(['get-doctors']);
  }
  return mutation;
};

export const getDoctor = async (doctorId: string): Promise<IDoctor> => {
  return http.get(`user/doctors/${doctorId}`);
};

export const useGetDoctor = (doctorId: string) => {
  return useQuery({
    queryKey: ['get-doctor', doctorId],
    queryFn: () => getDoctor(doctorId),
    staleTime: 5 * 60 * 1000
  });
};
