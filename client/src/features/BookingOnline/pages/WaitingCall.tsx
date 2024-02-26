import { FC } from 'react';
import { FiPhoneCall } from 'react-icons/fi';

const WaitingCall: FC = () => {
  return (
    <div className='h-screen flex flex-col items-center justify-center text-3xl'>
      <FiPhoneCall />
      <span>Đang chờ ...</span>
    </div>
  );
};

export default WaitingCall;
