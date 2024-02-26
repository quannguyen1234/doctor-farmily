import { FC } from 'react';
import { HiChat, HiPhone, HiX } from 'react-icons/hi';

import { useGetDoctorById } from '@/apis/user.api';

interface DoctorProfileProps {
  doctorId: string;
}

const DoctorProfile: FC<DoctorProfileProps> = ({ doctorId }) => {
  const { data, isLoading } = useGetDoctorById(doctorId);

  if (isLoading) {
    return <div>Loading....</div>;
  }

  return (
    <>
      <div className='flex items-center w-full px-6 mb-10'>
        <div className='w-20'>
          <img
            className='w-full rounded-full'
            src={
              data?.avatar
                ? data.avatar
                : 'https://user-images.githubusercontent.com/5709133/50445980-88299a80-0912-11e9-962a-6fd92fd18027.png'
            }
            alt='avatar-bac-si'
          />
        </div>
        <div className='pl-3'>
          <h4>
            <span className='font-semibold mr-1'>Bác sĩ:</span>
            {data?.baseUser.fullName}
          </h4>
          <div className='text-sm'>
            <span className='font-semibold mr-1'>SDT:</span>
            {data?.baseUser.phoneNumber}
          </div>
          <div className='text-sm'>
            <span className='font-semibold mr-1'>Email:</span>
            {data?.baseUser.email}
          </div>
        </div>
      </div>

      <div className='px-4'>
        <ol className='relative border-l border-gray-200 dark:border-gray-700'>
          <li className='mb-10 ml-4'>
            <div className='absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700' />
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Chuyên khoa: {data?.degree}
            </h3>
          </li>
          <li className='mb-10 ml-4'>
            <div className='absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700' />

            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Địa chỉ:
              <span className='text-sm font-normal'>
                {data?.baseUser.currentAddress.street},
                {data?.baseUser.currentAddress.village},
                {data?.baseUser.currentAddress.district},
                {data?.baseUser.currentAddress.city}
              </span>
            </h3>
          </li>
        </ol>
      </div>

      <div>
        <ul className='flex items-center gap-4'>
          <li>
            <div className='p-4 bg-purple-500 rounded-2xl text-white text-lg hover:opacity-80 cursor-pointer'>
              <HiChat />
            </div>
          </li>
          <li>
            <div className='p-4 bg-green-500 rounded-2xl text-white text-lg hover:opacity-80 cursor-pointer'>
              <HiPhone />
            </div>
          </li>
          <li>
            <div className='p-4 bg-rose-500 rounded-2xl text-white text-lg hover:opacity-80 cursor-pointer'>
              <HiX />
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default DoctorProfile;
