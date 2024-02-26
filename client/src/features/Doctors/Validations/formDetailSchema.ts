import * as Yup from 'yup';

const formDetailSchema = Yup.object().shape({
  symptom: Yup.string().required('Không được bỏ trống'),
  diagnosis: Yup.string().required('Không được bỏ trống'),
  treatmentPlan: Yup.string().required('Không được bỏ trống'),
  condition: Yup.string().required('Không được bỏ trống')
});

export default formDetailSchema;
