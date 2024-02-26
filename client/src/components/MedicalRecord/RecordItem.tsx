import { FC } from 'react';

import { IRecord } from '@/features/Doctors/apis/doctor.api';

interface RecordItemProps {
  title: string;
  timeline: string;
  data: IRecord;
}

const RecordItem: FC<RecordItemProps> = ({ title, timeline, data }) => {
  return (
    <li className='mb-10 ml-6'>
      <span className='absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900'>
        <svg
          aria-hidden='true'
          className='w-3 h-3 text-blue-800 dark:text-blue-300'
          fill='currentColor'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
            clipRule='evenodd'
          />
        </svg>
      </span>
      <h3 className='flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white'>
        {title}
      </h3>
      <time className='block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500'>
        {timeline}
      </time>
      <div className='mb-4 text-base font-normal text-gray-500 dark:text-gray-400'>
        <ul className='space-y-4 text-gray-500 list-disc list-inside dark:text-gray-400'>
          <li>Bác sĩ phụ trách: {data.doctorName}</li>
          <li>Khoa: {data.currentJob}</li>
          <li>Triệu chứng: {data.symptom}</li>
          <li>Chẩn đoán: {data.diagnosis}</li>
          <li>Kế hoạch điều trị: {data.treatmentPlan}</li>
          <li>Tình trạng: {data.condition}</li>
          <li>
            Đơn thuốc
            <ul className='pl-5 mt-2 space-y-1 list-decimal list-inside'>
              {data.prescriptions &&
                data.prescriptions.map((prescription) => (
                  <li
                    className='flex flex-col'
                    key={prescription.prescriptionId}
                  >
                    <div>
                      <span>Tên thuốc:</span>
                      {prescription.medicineName}
                    </div>
                    <div>
                      <span>Ghi chú:</span>
                      {prescription.note}
                    </div>
                    <hr className='w-96' />
                  </li>
                ))}
            </ul>
          </li>
        </ul>
      </div>
    </li>
  );
};

export default RecordItem;
