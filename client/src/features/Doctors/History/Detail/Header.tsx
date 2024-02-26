import { FC } from 'react';
import { IPatient } from '../../apis/doctor.api';

interface HeaderProps {
  data: IPatient;
}

const Header: FC<HeaderProps> = ({ data }) => {
  return (
    <div className='flex align-middle gap-4'>
      <div className='w-20'>
        <img
          className='rounded-full object-cover'
          src='https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=2000'
          alt='avatar'
        />
      </div>
      <ul>
        <li>
          <span className='font-semibold pr-2'>Bệnh nhân:</span>
          {data.baseUser.fullName}
        </li>
        <li>
          <span className='font-semibold pr-2'>Ngày sinh:</span>
          {data.baseUser.phoneNumber}
        </li>
        <li>
          <span className='font-semibold pr-2'>Email:</span>
          {data.baseUser.email}
        </li>
      </ul>
    </div>
  );
};

export default Header;
