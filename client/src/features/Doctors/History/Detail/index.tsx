import { FC } from 'react';
import classNames from 'classnames/bind';
import { useParams } from 'react-router-dom';

import styles from './Detail.module.scss';
import Breadcrumbs from './Breadcrumbs';
import Header from './Header';
import MedicalRecord from '@/components/MedicalRecord';
import RecordItem from '@/components/MedicalRecord/RecordItem';
import { useGetMedicalRecordById } from '../../apis/doctor.api';

const cx = classNames.bind(styles);

const HistoryDetail: FC = () => {
  const { id } = useParams();

  const { data: medicalRecordData, isLoading } = useGetMedicalRecordById(
    id as string
  );

  if (isLoading) {
    return <div>Loading....</div>;
  }

  return (
    <div>
      <Breadcrumbs />

      <div className='flex justify-center mt-12'>
        <div className={`${cx('form-control')}`}>
          {medicalRecordData && <Header data={medicalRecordData?.patient} />}

          {/* <FormDetail /> */}
          <div className='mt-10'>
            <MedicalRecord>
              {medicalRecordData &&
                medicalRecordData.records.map((record, index) => {
                  return (
                    <RecordItem
                      data={medicalRecordData.records[index]}
                      key={record.recordId}
                      title={record.name}
                      timeline={record.date}
                    />
                  );
                })}
            </MedicalRecord>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryDetail;
