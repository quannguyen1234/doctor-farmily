import React from 'react';
import classNames from 'classnames/bind';

import styles from './style.module.scss';
import { InputChat } from './InputChat';
import { Messages } from './Messages';

const cx = classNames.bind(styles);
export const Chat = () => {
  return (
    <div className={cx('chat')}>
      <div className='border-b-2 border-[#07070748] h-14 p-2 flex items-center shadow-md'>
        <span className='text-lg font-medium'>Nhung</span>
      </div>
      <Messages />
      <InputChat />
    </div>
  );
};
