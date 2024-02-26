import { FC } from 'react';
import { useParams } from 'react-router-dom';

import { useGetDoctorById } from '@/apis/user.api';

const DoctorProfile: FC = () => {
  const { id } = useParams();

  const { data: doctorData, isLoading } = useGetDoctorById(id as string);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex justify-center'>
      {doctorData && (
        <div className='flex flex-col items-center max-h-screen w-[720px]'>
          {/* Card */}
          <div className='flex items-center gap-4 mb-6 w-full'>
            <div className='w-20'>
              <img
                className='rounded-full object-cover'
                src='https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=2000'
                alt='avatar'
              />
            </div>
            <ul>
              <li>
                <span className='font-semibold pr-2'>Bác sĩ:</span>
                {doctorData.baseUser.fullName}
              </li>
              <li>
                <span className='font-semibold pr-2'>Ngày sinh:</span>
                {doctorData.baseUser.birthDay}
              </li>
              <li>
                <span className='font-semibold pr-2'>Email:</span>
                {doctorData.baseUser.email}
              </li>
              <li className='flex gap-1 text-xl'>
                {[...Array(5)].map((_, index) => {
                  index += 1;
                  return (
                    <div
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      className={
                        index <= Math.round(doctorData.meanStar)
                          ? 'text-yellow-300'
                          : 'text-gray-300'
                      }
                    >
                      <span className='star'>&#9733;</span>
                    </div>
                  );
                })}
              </li>
            </ul>
          </div>

          {/* Thông tin chi tiết */}
          <ul className='w-full'>
            <li>
              <span className='font-semibold pr-1'>Công việc hiện tại:</span>
              {doctorData.currentJob}
            </li>
            <li>
              <span className='font-semibold pr-1'>Bằng cấp:</span>
              {doctorData.degree}
            </li>
            <li>
              <span className='font-semibold pr-1'>Giá dịch vụ:</span>
              {doctorData.diagnosticFee} VND
            </li>
          </ul>

          {/* Đánh giá */}
          <div className='mt-5 mb-10 w-full'>
            <h4 className='font-bold mb-2'>Những đánh giá khác</h4>
            <ul className='flex flex-col gap-2 overflow-auto overflow-y-auto max-h-[500px]'>
              {doctorData.rating.map((rating, index) => {
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <li key={index} className='bg-gray-100 rounded-3xl py-2 px-4'>
                    <span className='font-semibold'>Bệnh nhân</span>
                    <p>{rating.note}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;
