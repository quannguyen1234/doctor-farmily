import React, { FC, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';
import {
  ArrowRightOutline,
  UserCircleOutline,
  WrenchOutline
} from '@graywolfai/react-heroicons';
import {
  logoutApi,
  useFetchUser
} from '@/features/Authentications/services/authenService';
import { useUserActions } from '@/stores/user.store';
import RoleApp from '@/enums/role';
import { PRIVATE_ROUTES } from '@/utils/constant/routes';

const AccountSettingBtn: FC = () => {
  const { setIsAuth } = useUserActions();
  const { data: userData } = useFetchUser();

  const handleLogout = async () => {
    const res = await logoutApi();
    if (res?.flag) {
      setIsAuth(false);
    }
  };

  return (
    <Menu>
      <div className='space-y-2'>
        <Menu.Button className='fixed bottom-2 left-0 w-full flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'>
          <i className='w-6 h-6'>
            <UserCircleOutline />
          </i>
          <span className='ml-3'>Tài khoản</span>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <div className='px-1 py-1'>
          <Menu.Items className='absolute bottom-full left-0 mb-5 w-56 origin-bottom-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
            <Menu.Item>
              <Link
                to={
                  userData?.user.role === RoleApp.admin
                    ? `${PRIVATE_ROUTES.doctorSetting}/${userData?.user.id}`
                    : `${PRIVATE_ROUTES.patientSetting}/${userData?.user.id}`
                }
                className='group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
              >
                <i className='mr-2 h-5 w-5' aria-hidden='true'>
                  <WrenchOutline />
                </i>
                <span>Trang cá nhân</span>
              </Link>
            </Menu.Item>

            <Menu.Item>
              <button
                onClick={handleLogout}
                className='group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
              >
                <i className='mr-2 h-5 w-5' aria-hidden='true'>
                  <ArrowRightOutline />
                </i>
                <span>Đăng xuất</span>
              </button>
            </Menu.Item>
          </Menu.Items>
        </div>
      </Transition>
    </Menu>
  );
};

export default AccountSettingBtn;
