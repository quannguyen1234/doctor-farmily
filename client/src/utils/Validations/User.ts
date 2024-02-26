import * as Yup from 'yup';

import { IAddress } from '@/types/user';
import { IMedicalRecord } from '@/types/medicalRecode';

export const addLocationSchema: Yup.Schema<Omit<IAddress, 'id'>> = Yup.object<
  Yup.Schema<Omit<IAddress, 'id'>>
>().shape({
  street: Yup.string().required('Vui lòng nhập địa chỉ!'),
  village: Yup.string().required('Vui lòng nhập phường/xã!'),
  district: Yup.string().required('Vui lòng nhập quận/huyện!'),
  city: Yup.string().required('Vui lòng nhập tỉnh/thành phố!')
});

export const addMedicalRecordSchema = Yup.object().shape({
  symptom: Yup.string().required('Vui lòng nhập triệu chứng'),
  diagnosis: Yup.string().required('Vui lòng nhập chẩn đoán bệnh'),
  treatmentPlan: Yup.string().required('Vui lòng nhập phương án điều trị'),
  condition: Yup.string().required('Vui lòng nhập tình trạng bệnh nhân'),
  prescriptions: Yup.object({
    medicineName: Yup.string().required('Vui lòng nhập tên thuốc'),
    note: Yup.string().required('Vui lòng nhập ghi chú')
  })
});
