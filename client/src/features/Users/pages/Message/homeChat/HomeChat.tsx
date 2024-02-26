import { FC, useState } from 'react';
import classNames from 'classnames/bind';

import { Chat } from '@/features/Users/components/message/Chat';
import styles from './homechat.module.scss';
import { SideBarChat } from '@/features/Users/components/message/SideBarChat';

const cx = classNames.bind(styles);
const HomeChat: FC = () => {
  return (
    <div className={cx('home')}>
      <div className={cx('container')}>
        <SideBarChat />
        <Chat />
      </div>
    </div>
  );
};

export default HomeChat;
