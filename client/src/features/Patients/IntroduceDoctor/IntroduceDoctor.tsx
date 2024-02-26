import { FC } from 'react';
import { Link } from 'react-router-dom';

import { useGetAllDoctors } from '@/apis/user.api';
import { PRIVATE_ROUTES } from '@/utils/constant/routes';

const IntroduceDoctor: FC = () => {
  const { data: doctorsData, isLoading } = useGetAllDoctors();

  if (isLoading) {
    return <div>Loading.....</div>;
  }

  return (
    <>
      {doctorsData && (
        <div className='grid grid-cols-4'>
          {doctorsData.data.map((doctor) => {
            return (
              <div
                key={doctor.doctorId}
                className='w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-md hover:cursor-pointer'
              >
                <img
                  className='p-8 rounded-t-lg'
                  src={
                    doctor.avatar ||
                    'https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg?crop=0.66698xw:1xh;center,top&resize=1200:*'
                  }
                  alt='avatar'
                />
                <div className='px-5 pb-5'>
                  <div>
                    <h5 className='text-xl font-semibold tracking-tight text-gray-900 dark:text-white'>
                      {doctor.baseUser.fullName}
                    </h5>
                    {doctor.currentJob && (
                      <h6>
                        <span className='font-semibold pr-2 text-sm'>
                          Chuyên khoa:
                        </span>
                        {doctor.currentJob}
                      </h6>
                    )}
                    {doctor.diagnosticFee && (
                      <h6>
                        <span className='font-semibold pr-2 text-sm'>
                          Chi phí:
                        </span>
                        <span>{doctor.diagnosticFee}</span> VNĐ
                      </h6>
                    )}
                  </div>
                  <div className='flex items-center mt-2.5 mb-2'>
                    <svg
                      aria-hidden='true'
                      className='w-5 h-5 text-yellow-300'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <title>First star</title>
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                    <svg
                      aria-hidden='true'
                      className='w-5 h-5 text-yellow-300'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <title>Second star</title>
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                    <svg
                      aria-hidden='true'
                      className='w-5 h-5 text-yellow-300'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <title>Third star</title>
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                    <svg
                      aria-hidden='true'
                      className='w-5 h-5 text-yellow-300'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <title>Fourth star</title>
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                    <svg
                      aria-hidden='true'
                      className='w-5 h-5 text-yellow-300'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <title>Fifth star</title>
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                  </div>
                  <div className='flex justify-center gap-3 mt-3'>
                    <Link
                      to={`${PRIVATE_ROUTES.doctorProfile}/${doctor.doctorId}`}
                    >
                      <button className='ring-2 ring-gray-200 rounded-full px-4 py-2 font-semibold text-lg hover:opacity-90 min-w-[120px] hover:bg-gray-100'>
                        Thông tin
                      </button>
                    </Link>
                    <button className='ring-2 ring-primary bg-primary text-white rounded-full px-4 py-2 font-semibold text-lg hover:opacity-90 min-w-[120px]'>
                      Đặt khám
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default IntroduceDoctor;
