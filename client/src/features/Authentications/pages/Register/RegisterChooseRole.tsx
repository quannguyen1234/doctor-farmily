import { FC } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftOutline } from '@graywolfai/react-heroicons';

import Button from '@/components/Button/Button';
import { PUBLIC_ROUTES } from '@/utils/constant/routes';

const RegisterChooseRole: FC = () => {
  return (
    <>
      <div className='flex justify-between align-middle mb-4'>
        <div>
          <h1 className='text-4xl font-bold text-left'>Đăng ký tài khoản</h1>
          <p>
            Chọn tư cách người dùng của bạn để tiếp tục đăng ký tài khoản trên
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

      <div className='flex flex-col gap-2'>
        <Link to={PUBLIC_ROUTES.registerUser}>
          <Button className='w-full' primary>
            Người dùng
          </Button>
        </Link>
        <Link to={PUBLIC_ROUTES.registerDocter}>
          <Button className='w-full'>Đăng ký với tư cách Bác sĩ</Button>
        </Link>
      </div>
    </>
  );
};

export default RegisterChooseRole;
