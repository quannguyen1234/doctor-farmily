import { FC, memo, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import IMAGE from '@/assets/images';
import { useFetchUser } from '@/features/Authentications/services/authenService';
import Loading from '@/components/Loading/Loading';
import sidebarOptions from './SidebarNav';
import AccountSettingBtn from './AccountSettingBtn';
import RoleApp from '@/enums/role';
import DoctorBookingOnline from '@/features/Doctors/BookingOnline/DoctorBookingOnline';

const Sidebar: FC = () => {
  const location = useLocation();
  const [user, setUser] = useState<any>(false);
  const { data: userData, isSuccess, isLoading } = useFetchUser();

  useEffect(() => {
    if (isSuccess) {
      if (userData.flag) {
        setUser(userData);
      }
    }
  }, [isSuccess, userData]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <aside
        id='sidebar-multi-level-sidebar'
        className='fixed h-9/10 border rounded-3xl shadow-xl 0px 8px 24px] left-4 top-10 bottom-10 z-40 w-64 transition-transform -translate-x-full sm:translate-x-0 bg-gray-0 dark:bg-gray-800'
        aria-label='Sidebar'
      >
        <div className='h-full px-3 py-4 overflow-y-auto flex flex-col justify-between'>
          <div>
            <div className='flex items-center py-2 px-3 sticky top-0 bg-gray-0 dark:bg-gray-800'>
              <img
                className='w-12'
                src={IMAGE.logoLg}
                alt='Logo Docter Family'
              />
              <h3 className='font-bold dark:text-white'>Docter Family</h3>
            </div>
            <ul className='space-y-2'>
              {isSuccess &&
                user &&
                sidebarOptions.map((option) => {
                  if (option.role.includes(user.user.role)) {
                    return (
                      <li key={option.to}>
                        <Link
                          to={option.to}
                          className={`${
                            location.pathname.includes(option.to)
                              ? 'bg-gray-300 hover:bg-gray-300'
                              : ''
                          } flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700`}
                        >
                          <i className='w-6 h-6'>{option.icon}</i>
                          <span className='ml-3'>{option.title}</span>
                        </Link>
                      </li>
                    );
                  }
                  return '';
                })}

              {userData?.flag && userData.user.role === RoleApp.docter && (
                <div>
                  <DoctorBookingOnline />
                </div>
              )}
            </ul>
          </div>
          <AccountSettingBtn />
        </div>
      </aside>
    </div>
  );
};

export default memo(Sidebar);
