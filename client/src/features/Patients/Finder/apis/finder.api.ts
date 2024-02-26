import { useQuery } from '@tanstack/react-query';
import http from '@/configs/api/axios.config';

const getDoctorsIdle = async () => {
  const res = await http.get('booking/doctor-appointments/get-doctors');
  return res.data;
};

export const useDoctorsIdle = () => {
  return useQuery({
    queryKey: ['doctor-idle'],
    queryFn: getDoctorsIdle
  });
};
