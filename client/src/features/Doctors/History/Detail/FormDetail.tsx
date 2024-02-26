import { Form, Formik } from 'formik';
import { FC, useState } from 'react';

import InputValidations from '@/components/Input/InputValidation';
import formDetailSchema from '../../Validations/formDetailSchema';

// interface FormDetailProps {

// }

const initialValues = {
  patient_id: '234234',
  symptom: 'abcabc',
  diagnosis: 'abcabc',
  treatmentPlan: 'abcabc',
  condition: 'nhe',
  prescriptions: [
    {
      medicine_name: 'paradol',
      note: 'abcabc'
    },
    {
      medicine_name: 'thuốc lào',
      note: 'abcabcabcabc'
    }
  ]
};

const FormDetail: FC = () => {
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const handleSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={formDetailSchema}
      onSubmit={(values) => {
        handleSubmit(values);
      }}
    >
      <Form>
        <InputValidations
          label='Triệu chứng'
          id='symptom'
          name='symptom'
          type='text'
          placeholder='Nhập triệu chứng của bệnh nhân'
        />
      </Form>
    </Formik>
  );
};

export default FormDetail;
