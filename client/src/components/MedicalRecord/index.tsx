import { FC } from 'react';

interface MedicalRecordProps {
  children: JSX.Element[] | undefined;
}

const MedicalRecord: FC<MedicalRecordProps> = ({ children }) => {
  return (
    <ol className='relative border-l border-gray-200 dark:border-gray-700'>
      {children}
    </ol>
  );
};

export default MedicalRecord;
