import * as Yup from 'yup';

export const departmentSchema = Yup.object().shape({
  name: Yup.string().required('Yêu cầu nhập tên khoa')
  //   desc: Yup.string().required('Yêu cầu nhập mô tả')
});
