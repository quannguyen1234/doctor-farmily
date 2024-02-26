import { FC, useState } from 'react';
import { Form, Formik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { ArrowLeftOutline } from '@graywolfai/react-heroicons';
import { IAuthValidationForm } from '@/types/authentications';
import { registerSchema } from '@/utils/Validations/Authentication';
import InputValidations from '@/components/Input/InputValidation';
import Button from '@/components/Button/Button';
import CLink from '@/components/Link/Link';
import { registerAccountApi } from '@/features/Authentications/services/authenService';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import { PUBLIC_ROUTES } from '@/utils/constant/routes';
import { timestampToDate } from '@/utils/day';

const initialValues: IAuthValidationForm = {
  phoneNumber: '',
  email: '',
  fullName: '',
  password: '',
  confirmPassword: '',
  birthDay: ''
};

const Register: FC = () => {
  const [titleError, setTitleError] = useState('');
  const navigate = useNavigate();

  const handleSubmitRegisterForm = async (values: IAuthValidationForm) => {
    const res = await registerAccountApi(values);

    if (!res.flag) {
      const { baseUser } = res;
      if (baseUser.email) {
        setTitleError('Email đã tồn tại');
      } else if (baseUser.phoneNumber) {
        setTitleError('Số điện thoại đã tồn tại');
      } else {
        setTitleError('Email hoặc số điện thoại đã tồn tại');
      }
    } else {
      toast.success('Đăng ký thành công!');
      navigate(PUBLIC_ROUTES.login);
    }
  };

  return (
    <>
      <div className='flex justify-between align-middle'>
        <div>
          <h1 className='text-4xl font-bold text-left'>Đăng ký tài khoản</h1>
          <p>
            Cùng chúng tôi tạo một tài khoản của bạn để sử dụng dịch vụ của
            Docter Family
          </p>
        </div>
        <Link
          to={PUBLIC_ROUTES.login}
          className='col-span-2 bg-gray-200 rounded w-7 h-7 grid place-items-center'
        >
          <ArrowLeftOutline className='w-6' />
        </Link>
      </div>

      <div className='register-form w-full'>
        <Formik
          initialValues={initialValues}
          validationSchema={registerSchema}
          onSubmit={(values) => {
            const birthdayFm = timestampToDate(values.birthDay, 'MM-DD-YYYY');
            const valuesSubmit = { ...values, birthDay: birthdayFm };
            handleSubmitRegisterForm(valuesSubmit);
          }}
        >
          <Form className='form-group flex flex-col'>
            <div className='overflow-y-scroll max-h-[50vh]'>
              <InputValidations
                label='Số điện thoại'
                id='phoneNumber'
                name='phoneNumber'
                type='text'
                placeholder='Số điện thoại của bạn'
              />
              <InputValidations
                label='Email'
                id='email'
                name='email'
                type='email'
                placeholder='Email của bạn'
              />
              <InputValidations
                label='Tên đầy đủ'
                id='fullName'
                name='fullName'
                type='text'
                placeholder='Tên của bạn'
              />
              <InputValidations
                label='Ngày sinh'
                id='birthDay'
                name='birthDay'
                type='date'
                placeholder='Nhập ngày sinh'
              />
              <InputValidations
                label='Mật khẩu'
                id='password'
                name='password'
                type='password'
                placeholder='Mật khẩu của bạn'
              />
              <InputValidations
                label='Nhập lại mật khẩu'
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                placeholder='Mật khẩu vừa nhập'
              />
            </div>
            {titleError && <ErrorMessage title={titleError} />}

            <CLink to='/forgot-password'>Quên mật khẩu ?</CLink>

            <Button primary type='submit' className='w-full'>
              Đăng ký
            </Button>

            {/* <span className='text-center text-gray-300 font-medium mb-4'>
              or Sign in with Google
            </span>

            <Link to='https://www.google.com/'>
              <Button className='w-full'>Sign in with Google</Button>
            </Link> */}
          </Form>
        </Formik>
      </div>
    </>
  );
};

export default Register;
