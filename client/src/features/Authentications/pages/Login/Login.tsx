import { FC, useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';

import { IAuthValidationForm } from '@/types/authentications';
import { loginSchema } from '@/utils/Validations/Authentication';
import InputValidations from '@/components/Input/InputValidation';
import Button from '@/components/Button/Button';
import CLink from '@/components/Link/Link';
import { useLogin } from '@/features/Authentications/services/authenService';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import { PRIVATE_ROUTES } from '@/utils/constant/routes';
import { useUserActions } from '@/stores/user.store';

type ILoginValues = Pick<IAuthValidationForm, 'email' | 'password'>;

const initialValues: ILoginValues = {
  email: '',
  password: ''
};

const Login: FC = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { setIsAuth } = useUserActions();
  const loginMutation = useLogin();

  const handleSubmit = async (values: ILoginValues) => {
    loginMutation.mutate(values);
  };

  useEffect(() => {
    if (loginMutation.isSuccess) {
      if (!loginMutation.data?.flag) {
        setErrorMessage('Incorrect email or password!');
      } else {
        localStorage.setItem('user', JSON.stringify(loginMutation.data.user));
        setIsAuth(true);
        navigate(PRIVATE_ROUTES.patients);
      }
    }
  }, [loginMutation.data, loginMutation.isSuccess, navigate, setIsAuth]);

  return (
    <>
      <h1 className='text-4xl font-bold text-left'>Đăng nhập</h1>
      <p>Hãy bắt đầu sử dụng Docter Family tại đây</p>
      <div className='login-form w-full'>
        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={(values) => {
            handleSubmit(values);
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
            <InputValidations
              label='Password'
              id='password'
              name='password'
              type='password'
              placeholder='Password'
            />

            {errorMessage && <ErrorMessage title={errorMessage} />}

            <CLink to='/forgot-password'>Quên mật khẩu ?</CLink>

            <Button primary type='submit' className='btn'>
              Đăng nhập
            </Button>

            <Link to='/register'>
              <Button className='w-full'>Đăng ký</Button>
            </Link>

            <span className='text-center text-gray-300 font-medium mb-4'>
              hoặc Đăng nhập với Google
            </span>

            <Link to='https://www.google.com/'>
              <Button className='w-full'>Đăng nhập với Google</Button>
            </Link>
          </Form>
        </Formik>
      </div>
    </>
  );
};

export default Login;
