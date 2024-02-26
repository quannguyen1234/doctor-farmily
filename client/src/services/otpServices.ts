import http from '@/configs/api/axios.config';
import { IBaseResponse } from '@/types/common';

export const sendOtpApi = async (email: {
  email: string;
}): Promise<IBaseResponse> => {
  try {
    console.log(email);
    return await http.post('auth/otp/send-otp', { email });
  } catch (error) {
    console.log('Check-OTP-Error:', error);
    throw error;
  }
};

export const checkOtpApi = async (otp: string): Promise<IBaseResponse> => {
  try {
    return await http.post('auth/otp/verify-otp', { otp });
  } catch (error) {
    console.log('Check-OTP-Error:', error);
    throw error;
  }
};
