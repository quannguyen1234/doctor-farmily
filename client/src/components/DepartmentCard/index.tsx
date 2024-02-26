import { FC } from 'react';

interface DepartmentCardProps {
  title: string;
  desc: string;
  images: string;
}

const DepartmentCard: FC<DepartmentCardProps> = ({ title, images, desc }) => {
  return (
    <div className='cursor-pointer flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'>
      <div className='w-[128px] h-[128px] m-2 overflow-hidden rounded-md'>
        <img
          className='object-cover w-full rounded-t-lg h-60'
          src={images}
          alt={title}
        />
      </div>
      <div className='flex flex-col justify-between py-4 px-2 leading-normal'>
        <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
          {title}
        </h5>
        <p className='mb-3 font-normal text-gray-700 dark:text-gray-400'>
          {desc}
        </p>
      </div>
    </div>
  );
};

export default DepartmentCard;
