import { Form, Formik } from 'formik';
import { FC } from 'react';

import Button from '@/components/Button/Button';
import InputValidations from '@/components/Input/InputValidation';
import { otpSchema } from '@/utils/Validations/Authentication';

interface ConfirmOtp {
  onCheckOtp: (otp: string) => void;
}

const initialValues = {
  otp: ''
};

const ConfirmOTP: FC<ConfirmOtp> = ({ onCheckOtp }) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={otpSchema}
      onSubmit={(values) => {
        onCheckOtp(values.otp);
      }}
    >
      <Form className='form-group flex flex-col'>
        <InputValidations
          label='OTP của bạn'
          id='otp'
          name='otp'
          type='text'
          placeholder='Mã OTP được gửi tới email của bạn'
        />

        <Button primary type='submit' className='btn'>
          Xác thực
        </Button>
      </Form>
    </Formik>
  );
};

export default ConfirmOTP;
