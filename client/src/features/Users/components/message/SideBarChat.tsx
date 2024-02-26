import classNames from 'classnames/bind';

import { MagnifyingGlassOutline } from '@graywolfai/react-heroicons';

import styles from './style.module.scss';
import { NavBarChat } from './NavBarChat';
import { Search } from './Search';
import { Chats } from './Chats';

const cx = classNames.bind(styles);
export const SideBarChat = () => {
  return (
    <div className={cx('sidebar')}>
      <NavBarChat />
      <Search />
      <Chats />
      {/* <Chat/> */}
      {/* <Search
              type='text'
              id='home-search'
              placeholder='Tìm kiếm trên Message'
              leftIcon={<MagnifyingGlassOutline />}
          /> */}
    </div>
  );
};
