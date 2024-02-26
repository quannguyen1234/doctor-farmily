import { useQuery } from '@tanstack/react-query';

import http from '@/configs/api/axios.config';
import { ISearchDocterParams } from '@/types/common';

interface IDepartments {
  deId: string;
  name: string;
  images: string[];
}

export const getDepartmentsApi = async (): Promise<IDepartments[]> => {
  const res = await http.get('personal-management/hospital-departments');
  return res.data;
};

export const useGetDepartments = () => {
  return useQuery({
    queryKey: ['get-departments'],
    queryFn: getDepartmentsApi,
    staleTime: 5 * 60 * 1000
  });
};

export const getDoctorsWithAddress = async (
  payload: Omit<ISearchDocterParams, 'department'>
) => {
  const res = await http.post(
    'booking/doctor-appointments/get-doctors',
    payload
  );
  return res;
};

// export const useGetDoctorsAddress = () => {
//   return useQuery({
//     queryKey: ['get-doctors-with-address', payload],
//     queryFn: (payload: ISearchDocterParams) => getDoctorsWithAddress(payload)
//   });
// };
