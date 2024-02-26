import { FC } from 'react';
import { Navigate } from 'react-router-dom';

import IMAGE from '@/assets/images';
import { PRIVATE_ROUTES } from '@/utils/constant/routes';
import { useIsAuth } from '@/stores/user.store';

interface AuthLayoutProps {
  children?: JSX.Element;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  const isAuth = useIsAuth();

  return (
    <>
      {isAuth && <Navigate to={PRIVATE_ROUTES.patients} replace />}
      <div className='md:h-screen md:w-full overflow-hidden flex justify-center'>
        <div className='grid md:w-3/4 grid-cols-7 place-items-center content-center gap-4 '>
          <div className='col-span-3 mt-4 mb-4 max-w-md w-full'>
            <div className='flex items-center mb-8'>
              <div className='w-20 rounded-full overflow-hidden'>
                <img
                  className='w-full object-cover scale-125'
                  src={IMAGE.logoLg}
                  alt='logo-doctor-family'
                />
              </div>
              <h2 className='text-5xl font-bold'>Docter Family</h2>
            </div>

            {children}
          </div>

          <div className='col-span-4 h-full w-full grid place-items-center'>
            <img
              className='h-2/3 object-cover rounded-3xl'
              src={IMAGE.bannerAuthenLayout}
              alt={IMAGE.bannerAuthenLayout}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
