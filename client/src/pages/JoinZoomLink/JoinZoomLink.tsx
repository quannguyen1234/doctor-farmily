import { FC } from 'react';
import { useGetLinkZoom } from '@/stores/user.store';

const JoinZoomLink: FC = () => {
  const linkZoom = useGetLinkZoom();

  return (
    <div className='flex justify-center items-center h-full'>
      <div className='w-[400px] h-[300px] bg-white shadow-lg border rounded-3xl flex flex-col p-4 items-center justify-center'>
        <p className='text-center mb-4 font-semibold'>
          Để khám trực tuyến với bác sĩ, vui lòng tham gia phòng khám trực tuyến
          bằng cách nhấn nút dưới đây
        </p>
        {linkZoom && (
          <a
            className='py-2 px-4 bg-green-600 text-white rounded-md font-bold'
            href={linkZoom}
            target='_blank'
            rel='noreferrer'
          >
            Tham gia phòng khám trực tuyến
          </a>
        )}
      </div>
    </div>
  );
};

export default JoinZoomLink;
