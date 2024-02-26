import { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftOutline } from '@graywolfai/react-heroicons';

import { PUBLIC_ROUTES } from '@/utils/constant/routes';
import { checkExistEmailApi } from '../../services/authenService';
import ConfirmEmail from './ConfirmEmail';
import ConfirmOTP from './ConfirmOTP';
import ResetPassword from './ResetPassword';
import { checkOtpApi, sendOtpApi } from '@/services/otpServices';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

const ForgotPassword: FC = () => {
  const navigate = useNavigate();
  const [isExistEmail, setIsExistEmail] = useState(false);
  // const [email, setEmail] = useState('')

  const [isValidOtp, setIsValidOtp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCheckExistEmail = async (values: { email: string }) => {
    const res = await checkExistEmailApi(values);

    if (res.flag) {
      const resOtp = await sendOtpApi(values);

      setIsExistEmail(true);
      if (resOtp.flag) {
        // setEmail(values.email);
        // navigate('/')
      }
    } else {
      setErrorMessage('Email chưa được đăng ký trên hệ thống');
    }
  };

  const handleCheckOtp = async (otp: string) => {
    const res = await checkOtpApi(otp);
    console.log('handleCheckOtp', res);
  };

  return (
    <>
      <div className='flex justify-between align-middle'>
        <div>
          <h1 className='text-4xl font-bold text-left'>Quên mật khẩu ?</h1>
          <p>Đừng lo lắng, hãy cùng lập lại mật khẩu mới</p>
        </div>
        <Link
          to={PUBLIC_ROUTES.login}
          className='col-span-2 bg-gray-200 rounded w-7 h-7 grid place-items-center'
        >
          <ArrowLeftOutline className='w-6' />
        </Link>
      </div>

      <div className='login-form w-full'>
        {!isExistEmail && (
          <ConfirmEmail onCheckExistEmail={handleCheckExistEmail} />
        )}
        {isExistEmail && !isValidOtp && (
          <ConfirmOTP onCheckOtp={handleCheckOtp} />
        )}
        {isExistEmail && isValidOtp && <ResetPassword />}
        {errorMessage && <ErrorMessage title={errorMessage} />}
      </div>
    </>
  );
};

export default ForgotPassword;
