import { FC } from 'react';
import { Form, Formik } from 'formik';

import { forgotPasswordSchema } from '@/utils/Validations/Authentication';
import InputValidations from '@/components/Input/InputValidation';
import Button from '@/components/Button/Button';

const initialValues = {
  email: ''
};

interface ConfirmEmailProps {
  onCheckExistEmail: (values: { email: string }) => void;
}

const ConfirmEmail: FC<ConfirmEmailProps> = ({ onCheckExistEmail }) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={forgotPasswordSchema}
      onSubmit={(values) => {
        onCheckExistEmail(values);
      }}
    >
      <Form className='form-group flex flex-col'>
        <InputValidations
          label='Email'
          id='email'
          name='email'
          type='text'
          placeholder='Email'
        />

        <Button primary type='submit' className='btn'>
          Nhận mã OTP
        </Button>
      </Form>
    </Formik>
  );
};

export default ConfirmEmail;
