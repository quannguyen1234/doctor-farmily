import { lazy } from 'react';

import { IRoutes } from '@/types/routes';
import AuthLayout from '@/features/Authentications/layouts/AuthLayout/AuthLayout';
import { PUBLIC_ROUTES } from '@/utils/constant/routes';

const Login = lazy(
  () => import('@/features/Authentications/pages/Login/Login')
);
const Register = lazy(
  () => import('@/features/Authentications/pages/Register/Register')
);
const ForgotPassword = lazy(
  () => import('@/features/Authentications/pages/ForgotPassword')
);

const RegisterChooseRole = lazy(
  () => import('@/features/Authentications/pages/Register/RegisterChooseRole')
);
const RegisterDocter = lazy(
  () => import('@/features/Authentications/pages/Register/RegisterDocter')
);
const HomePage = lazy(() => import('@/features/Home'));

export const publicRoutes: IRoutes[] = [
  {
    path: PUBLIC_ROUTES.login,
    page: <Login />,
    title: 'Login',
    layout: AuthLayout
  },
  {
    path: PUBLIC_ROUTES.registerUser,
    page: <Register />,
    title: 'Đăng ký người dùng',
    layout: AuthLayout
  },
  {
    path: PUBLIC_ROUTES.register,
    page: <RegisterChooseRole />,
    title: 'Chọn tư cách đăng ký',
    layout: AuthLayout
  },
  {
    path: PUBLIC_ROUTES.registerDocter,
    page: <RegisterDocter />,
    title: 'Đăng ký bác sĩ',
    layout: AuthLayout
  },
  {
    path: PUBLIC_ROUTES.forgotPassword,
    page: <ForgotPassword />,
    title: 'Forgot Password',
    layout: AuthLayout
  },
  {
    path: PUBLIC_ROUTES.home,
    page: <HomePage />,
    title: 'Forgot Password'
  }
];
