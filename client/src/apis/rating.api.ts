import { useMutation } from '@tanstack/react-query';
import http from '@/configs/api/axios.config';

interface IRating {
  doctorId: string;
  star: number;
  note: string;
}

interface IAddRatingRes extends IRating {
  avatar: string;
  flag: boolean;
  status: number;
}

const addRatingDoctor = async (payload: IRating) => {
  const res = await http.post<IAddRatingRes>('booking/ratings', payload);
  return res as unknown as IAddRatingRes;
};

export const useAddRatingDoctor = () => {
  return useMutation({
    mutationFn: (payload: IRating) => addRatingDoctor(payload)
  });
};
