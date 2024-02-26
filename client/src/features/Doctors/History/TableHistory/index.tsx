import { FC, useMemo } from 'react';
import classNames from 'classnames/bind';

import DropdownActions from './DropdownActions';
import styles from './TableHistory.module.scss';
import { useGetMedicalRecordOfDoctor } from '../../apis/doctor.api';
import { useFetchUser } from '@/features/Authentications/services/authenService';

const cx = classNames.bind(styles);

const headTitles: { id: number; name: string }[] = [
  {
    id: 1,
    name: 'Tên bệnh nhân'
  },
  {
    id: 5,
    name: 'Ngày khám'
  },
  {
    id: 6,
    name: ''
  }
];

const TableHistory: FC = () => {
  const renderColumns = useMemo(() => {
    return headTitles.map((title) => (
      <th key={title.id} scope='col' className='px-6 py-3'>
        {title.name}
      </th>
    ));
  }, []);

  const { data: doctor } = useFetchUser();

  const { data: historyData } = useGetMedicalRecordOfDoctor(
    doctor?.user.id as string
  );

  return (
    <div
      className={`${cx(
        'wrapper'
      )} relative overflow-x-visible shadow-md sm:rounded-lg`}
    >
      <table className='w-full max-h-full text-sm text-left text-gray-500 dark:text-gray-400'>
        <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
          <tr>{renderColumns}</tr>
        </thead>
        <tbody>
          {historyData &&
            historyData.map((data, index) => {
              return (
                <tr
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  className='bg-white border-b dark:bg-gray-900 dark:border-gray-700'
                >
                  <th
                    scope='row'
                    className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                  >
                    {data.patientName}
                  </th>
                  <td className='px-6 py-4'>{data.date}</td>
                  <td className='px-6 py-4 text-right'>
                    <DropdownActions id={data.patientId} />
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default TableHistory;
