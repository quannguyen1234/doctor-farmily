import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .required('Yêu cầu nhập email của bạn')
    .email('Email không hợp lệ'),
  password: Yup.string().required('Yêu cầu nhập mật khẩu của bạn')
});

export const registerSchema = Yup.object().shape({
  phoneNumber: Yup.string().required('Vui lòng nhập số điện thoại'),
  email: Yup.string().email().required('Vui lòng nhập email'),
  fullName: Yup.string().required('Vui lòng nhập tên'),
  password: Yup.string()
    .required('Vui lòng nhập mật khẩu')
    .min(8, 'Mật khẩu có ít nhất 8 ký tự')
    .matches(/[0-9]/, 'Mật khẩu yêu cầu có ít nhất 1 chữ số')
    .matches(/[a-z]/, 'Mật khẩu yêu cầu có ít nhất 1 ký tự'),
  confirmPassword: Yup.string()
    .required('Vui lòng nhập lại mật khẩu')
    .oneOf([Yup.ref('password')], 'Mật khẩu phải trùng khớp'),
  birthDay: Yup.string().required('Vui lòng nhập ngày sinh')
});

export const updateUserSchema = Yup.object().shape({
  baseUser: Yup.object({
    phoneNumber: Yup.string().required('Vui lòng nhập số điện thoại'),
    email: Yup.string().email().required('Vui lòng nhập email'),
    fullName: Yup.string().required('Vui lòng nhập tên'),
    birthDay: Yup.string().required('Vui lòng nhập ngày sinh')
  })
});

export const registerDocterSchema = Yup.object().shape({
  phoneNumber: Yup.number().required('Vui lòng nhập số điện thoại'),
  email: Yup.string().email().required('Vui lòng nhập email'),
  fullName: Yup.string().required('Vui lòng nhập tên'),
  password: Yup.string()
    .required('Vui lòng nhập mật khẩu')
    .min(8, 'Mật khẩu có ít nhất 8 ký tự')
    .matches(/[0-9]/, 'Mật khẩu yêu cầu có ít nhất 1 chữ số')
    .matches(/[a-z]/, 'Mật khẩu yêu cầu có ít nhất 1 ký tự'),
  confirmPassword: Yup.string()
    .required('Vui lòng nhập lại mật khẩu')
    .oneOf([Yup.ref('password')], 'Mật khẩu phải trùng khớp'),
  degree: Yup.string().required('Vui lòng nhập chứng chỉ'),
  diagnosticFee: Yup.number().required('Vui lòng nhập giá tiền khám bệnh'),
  currentJob: Yup.string().required('Vui lòng nhập công việc hiện tại'),
  citizenIdentification: Yup.string().required('Vui lòng nhập CMND/CCCD'),
  birthDay: Yup.string().required('Vui lòng nhập ngày sinh'),
  expreience: Yup.string().required('Vui lòng nhập kinh ngiệm làm việc'),
  city: Yup.string().required('Trường này không được bỏ trống'),
  district: Yup.string().required('Trường này không được bỏ trống'),
  street: Yup.string().required('Trường này không được bỏ trống'),
  village: Yup.string().required('Trường này không được bỏ trống')
  // notarizedImages: Yup.mixed().required('Vui lòng gửi ảnh lên'),
  // .test(
  //   'filseSize',
  //   'Dung lượng ảnh quá lớn',
  //   (value: any) => value && value.size <= 160 * 1024
  // )
  // .test(
  //   'fileFormat',
  //   'Không hỗ trợ',
  //   (value: any) => value && SUPPORTED_FORMATS.includes(value.type)
  // )
});

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email().required('Yêu cầu nhập email của bạn')
});

export const otpSchema = Yup.object().shape({
  otp: Yup.string().required('Hãy nhập mã OTP của bạn')
});

export const resetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required('Trường này không được bỏ trống')
    .min(8, 'Mật khẩu có ít nhất 8 ký tự')
    .matches(/[0-9]/, 'Mật khẩu yêu cầu có ít nhất 1 chữ số')
    .matches(/[a-z]/, 'Mật khẩu yêu cầu có ít nhất 1 ký tự'),
  confirmPassword: Yup.string()
    .required('Trường này không được bỏ trống')
    .oneOf([Yup.ref('password')], 'Mật khẩu không khớp')
});

export const UpdateDocterSchema = Yup.object().shape({
  baseUser: Yup.object({
    phoneNumber: Yup.string().required('Vui lòng nhập số điện thoại'),
    email: Yup.string().email().required('Vui lòng nhập email'),
    fullName: Yup.string().required('Vui lòng nhập tên'),
    birthDay: Yup.string().required('Vui lòng nhập ngày sinh'),
    citizenIdentification: Yup.string().required('Vui lòng nhập CMND/CCCD')
  }),
  degree: Yup.string().required('Vui lòng nhập trường này'),
  currentJob: Yup.string().required('Vui lòng nhập công việc hiện tại')
});
