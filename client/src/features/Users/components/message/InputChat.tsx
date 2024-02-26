/* eslint-disable react/void-dom-elements-no-children */
import React from 'react';
import classNames from 'classnames/bind';

import { PhotoOutline } from '@graywolfai/react-heroicons';
import styles from './style.module.scss';
import Button from '@/components/Button/Button';

const cx = classNames.bind(styles);

export const InputChat = () => {
  return (
    <div className='flex items-center  justify-between '>
      <input
        className='bg-gray-50 text-base rounded-full border-gray-200 hover:border-primary border-solid border-2 px-3 py-2 caret-primary focus:outline-primary focus:border-primary w-2/3'
        type='text'
        placeholder='Nhập tin nhắn'
      />
      <div className='flex items-center justify-between'>
        <PhotoOutline className='w-10 pr-2' />
        <input type='file' style={{ display: 'none' }} id='file' />
        <label htmlFor='file'>
          <img src='' alt='' />
        </label>
        <Button primary onClick={() => console.log('a')}>
          Send
        </Button>
      </div>
    </div>
  );
};
