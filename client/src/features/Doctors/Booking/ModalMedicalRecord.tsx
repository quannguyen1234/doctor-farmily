import { FC } from 'react';

import InputValidations from '@/components/Input/InputValidation';

const ModalMedicalRecord: FC = () => {
  return (
    <div className='w-96'>
      <InputValidations
        label='Triệu chứng'
        id='symptom'
        name='symptom'
        type='text'
        placeholder='Nhập triệu chứng của bệnh nhân'
      />
      <InputValidations
        label='Tình trạng'
        id='condition'
        name='condition'
        type='text'
        placeholder='Nhập tình trạng của bệnh nhân'
      />
      <InputValidations
        label='Chẩn đoán'
        id='diagnosis'
        name='diagnosis'
        type='text'
        placeholder='Nhập chẩn đoán bệnh'
      />
      <InputValidations
        label='Phác đồ điều trị'
        id='treatmentPlan'
        name='treatmentPlan'
        type='text'
        placeholder='Nhập phác đồ điều trị'
      />
    </div>
  );
};

export default ModalMedicalRecord;
