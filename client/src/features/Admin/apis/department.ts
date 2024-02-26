import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { IDepartment } from '@/types/common';
import http from '@/configs/api/axios.config';

export const getAllDepartments = async (): Promise<IDepartment[]> => {
  try {
    const dataRes = await http.get('personal-management/hospital-departments');
    return dataRes.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw error;
  }
};

export const useGetDepartments = () => {
  return useQuery({
    queryKey: ['get-departments'],
    queryFn: getAllDepartments,
    staleTime: 5 * 60 * 1000
  });
};

export const createDepartment = async (
  data: IDepartment
): Promise<IDepartment> => {
  const { deId, ...rest } = data;
  const response = await http.post(
    'personal-management/hospital-departments',
    rest
  );
  return response.data;
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['create-department'],
    mutationFn: (data: IDepartment) => createDepartment(data)
  });

  if (mutation.isSuccess) {
    queryClient.invalidateQueries(['get-departments']);
  }
  return mutation;
};

export const updateDepartment = async (
  data: IDepartment
): Promise<IDepartment> => {
  const { deId, ...rest } = data;
  const response = await http.patch(
    `personal-management/hospital-departments/${data.deId}`,
    rest
  );
  return response.data;
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['update-department'],
    mutationFn: (data: IDepartment) => updateDepartment(data)
  });

  if (mutation.isSuccess) {
    queryClient.invalidateQueries(['get-departments']);
  }
  return mutation;
};

export const deleteDepartment = async (
  deId: string
): Promise<{ status: number; flag: boolean }> => {
  const response = await http.delete(
    `personal-management/hospital-departments/${deId}`
  );
  return response.data;
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['create-department'],
    mutationFn: (deId: string) => deleteDepartment(deId)
  });

  if (mutation.isSuccess) {
    queryClient.invalidateQueries(['get-departments']);
  }
  return mutation;
};
