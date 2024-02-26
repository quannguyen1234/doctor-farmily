import { Form, Formik } from 'formik';
import { FC } from 'react';

import Button from '@/components/Button/Button';
import InputValidations from '@/components/Input/InputValidation';
import { resetPasswordSchema } from '@/utils/Validations/Authentication';

const initialValues = {
  newPassword: '',
  confirmNewPassword: ''
};

const ResetPassword: FC = () => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={resetPasswordSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      <Form className='form-group flex flex-col'>
        <InputValidations
          label='Mật khẩu'
          id='newPassword'
          name='newPassword'
          type='password'
          placeholder='Mã OTP được gửi tới email của bạn'
        />
        <InputValidations
          label='Nhập lại mật khẩu'
          id='confirmPassword'
          name='confirmPassword'
          type='password'
          placeholder='Mã OTP được gửi tới email của bạn'
        />

        <Button primary type='submit' className='btn'>
          Xác nhận
        </Button>
      </Form>
    </Formik>
  );
};

export default ResetPassword;
