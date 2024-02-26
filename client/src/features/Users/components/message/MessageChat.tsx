import React from 'react';
import classNames from 'classnames/bind';
import styles from './style.module.scss';

const cx = classNames.bind(styles);
export const MessageChat = () => {
  return (
    <div className={cx('message', 'owner')}>
      <div className={cx('messageInfo')}>
        <img
          className='w-10 h-10 rounded-full object-cover'
          src='https://haycafe.vn/wp-content/uploads/2022/06/anh-cho-hai-husky-cuoi.jpg'
          alt=''
        />
        <span>Just now</span>
      </div>
      <div className='max-w-[80%] flex flex-col gap-2 '>
        <span className='bg-[#e3e6eb] px-3 py-3 rounded-tl-none rounded-tr-3xl rounded-bl-lg rounded-br-lg'>
          ĐI nhậu k
        </span>
        <img
          className='w-1/2 '
          src='https://haycafe.vn/wp-content/uploads/2022/06/anh-cho-hai-husky-cuoi.jpg'
          alt=''
        />
      </div>
    </div>
  );
};
