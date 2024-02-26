import { FC } from 'react';

import MedicalRecord from '@/components/MedicalRecord';
import RecordItem from '@/components/MedicalRecord/RecordItem';
import { useGetMedicalRecordById } from '../apis/doctor.api';

interface ModalMedicalRecordProps {
  patientId: string;
}

const ModalMedicalRecord: FC<ModalMedicalRecordProps> = ({ patientId }) => {
  const { data: medicalRecordData } = useGetMedicalRecordById(patientId);
  return (
    <div>
      {medicalRecordData && (
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
      )}
    </div>
  );
};

export default ModalMedicalRecord;
