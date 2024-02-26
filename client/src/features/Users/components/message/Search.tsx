import React from 'react';
import classNames from 'classnames/bind';
import { MagnifyingGlassOutline } from '@graywolfai/react-heroicons';

import styles from './style.module.scss';
import IconWrapper from '@/components/IconWrapper/IconWrapper';

const cx = classNames.bind(styles);
export const Search = () => {
  return (
    <>
      <div className='relative flex items-center w-96'>
        <IconWrapper className='absolute left-2' size='w-5'>
          <MagnifyingGlassOutline />
        </IconWrapper>
        <input
          className=' bg-gray-100 w-full py-2 pl-10 border-2 rounded-full focus:outline-none border-gray-300'
          type='text'
          placeholder='Tìm kiếm trên Message'
          id=''
        />
      </div>
      <div className='cursor-pointer p-3 flex items-center gap-3 hover:bg-[#e3e6eb] active:bg-[#e5f3ff]'>
        <img
          className='w-12 h-12 object-cover rounded-full'
          src='https://go.yolo.vn/wp-content/uploads/2019/08/hinh-anh-cho-pomsky-dep-45.jpg'
          alt=''
        />
        <div>
          <span>Nhung</span>
        </div>
      </div>
    </>
  );
};
