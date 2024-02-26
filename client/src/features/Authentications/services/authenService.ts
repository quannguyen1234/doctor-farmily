import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { IAuthValidationForm } from '@/types/authentications.d';
import http from '@/configs/api/axios.config';
import {
  IDoctorAuthen,
  IRegisterFormDocter,
  IUserAuthen,
  IUserResponse
} from '../types';
import LOCAL_STORAGE_KEY from '@/utils/constant/localStorage';
import { IBaseResponse } from '@/types/common';

export const registerAccountApi = async ({
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

export const registerDocterApi = async ({
  phoneNumber,
  email,
  fullName,
  password,
  degree,
  currentJob,
  birthDay,
  departments,
  expreience,
  gender,
  citizenIdentification,
  city,
  district,
  street,
  village,
  notarizedImages,
  nameImages,
  diagnosticFee
}: Omit<IRegisterFormDocter, 'confirmPassword'>): Promise<IDoctorAuthen> => {
  try {
    return await http.post('user/doctors', {
      baseUser: {
        phoneNumber,
        email,
        fullName,
        password,
        birthDay,
        currentAddress: {
          city,
          district,
          street,
          village
        },
        citizenIdentification
      },
      departments,
      degree,
      gender,
      currentJob,
      expreience,
      notarizedImages,
      nameImages,
      diagnosticFee
    });
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

export const loginApi = async ({
  email,
  password
}: Pick<IAuthValidationForm, 'email' | 'password'>) => {
  const res = await http.post('auth/login', {
    email,
    password
  });
  return res as unknown as IUserResponse;
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['login'],
    mutationFn: ({
      email,
      password
    }: Pick<IAuthValidationForm, 'email' | 'password'>) =>
      loginApi({ email, password })
  });

  if (mutation.isSuccess) {
    queryClient.invalidateQueries(['fetch-user']);
  }

  return mutation;
};

export const logoutApi = async (): Promise<IBaseResponse> => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, '');
    localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, '');

    return await http.post('auth/logout');
  } catch (error) {
    console.log('logoutApi-Error:', error);
    throw error;
  }
};

export const fetchUser = async () => {
  const res = await http.get('auth/fetch-user');
  return res as unknown as IUserResponse;
};

export const useFetchUser = () => {
  return useQuery({
    queryKey: ['fetch-user'],
    queryFn: fetchUser,
    staleTime: Infinity
  });
};

export const checkExistEmailApi = async ({
  email
}: {
  email: string;
}): Promise<IBaseResponse> => {
  try {
    return await http.post('auth/check-existed-email', { email });
  } catch (error) {
    console.log('checkExistEmail-Error:', error);
    throw error;
  }
};
