import { FC } from 'react';

import { LayoutProps } from '@/types/common';
// import Sidebar from '../components/Sidebar/Sidebar';
import Sidebar from '@/layouts/components/Sidebar/Sidebar';

const DefaultLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className='flex overflow-hidden'>
      <div className='flex-shrink-0 w-[270px]'>
        <Sidebar />
      </div>
      <div className='ml-[20px] w-full min-h-screen pt-10 pr-4 overflow-hidden'>
        {children}
      </div>
    </div>
  );
};

export default DefaultLayout;
