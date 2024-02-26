import { Select } from 'antd';
import { Form, Formik } from 'formik';
import { FC, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { ArrowLeftOutline } from '@graywolfai/react-heroicons';
import Button from '@/components/Button/Button';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import InputValidations from '@/components/Input/InputValidation';
import CLink from '@/components/Link/Link';
import { PUBLIC_ROUTES } from '@/utils/constant/routes';
import { registerDocterSchema } from '@/utils/Validations/Authentication';
import { IRegisterFormDocter } from '../../types';
import { registerDocterApi } from '../../services/authenService';
import { uploadImageApi } from '@/services/upload';
import { timestampToDate } from '@/utils/day';
import { getAllDepartments } from '@/features/Admin/apis/department';
import { IDepartment } from '@/types/common';

const initialValues: IRegisterFormDocter = {
  phoneNumber: '',
  email: '',
  fullName: '',
  password: '',
  confirmPassword: '',
  citizenIdentification: '',
  degree: '',
  currentJob: '',
  birthDay: '',
  departments: [],
  expreience: '',
  gender: 'other',
  city: '',
  district: '',
  street: '',
  village: '',
  notarizedImages: undefined,
  nameImages: {
    avatar: '',
    notarizedImages: []
  },
  diagnosticFee: 0
};

const RegisterDocter: FC = () => {
  const [titleError, setTitleError] = useState('');
  const [files, setFiles] = useState<FileList>();
  const [departmentRes, setDepartmentRes] = useState<IDepartment[]>([]);
  const [department, setDepartment] = useState<
    Pick<IDepartment, 'deId' | 'name'>[]
  >([]);
  const navigate = useNavigate();

  const handleSubmitRegisterForm = async (values: IRegisterFormDocter) => {
    const res = await registerDocterApi(values);
    if (!res.flag) {
      const { baseUser } = res;
      if (baseUser.email) {
        setTitleError('Email đã tồn tại');
      } else if (baseUser.phoneNumber) {
        setTitleError('Số điện thoại đẫ tồn tại');
      } else if (baseUser.citizenIdentification) {
        setTitleError('CCCD/CMND đã tồn tại');
      }
    } else {
      toast.success('Đăng ký thành công!');
      navigate(PUBLIC_ROUTES.login);
    }
  };

  const handleChange = (value: string[]) => {
    department.push({
      deId: departmentRes[Number(value)].deId,
      name: departmentRes[Number(value)].name
    });
  };

  useEffect(() => {
    getAllDepartments().then((res) => {
      setDepartmentRes(res);
    });
  }, []);

  const options = [];
  if (departmentRes) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < departmentRes.length; i++) {
      options.push({
        value: i,
        label: departmentRes[i].name
      });
    }
  }

  return (
    <>
      <div className='flex justify-between align-middle'>
        <div>
          <h1 className='text-4xl font-bold text-left'>Đăng ký tài khoản</h1>
          <p>
            Cùng chúng tôi tạo một tài khoản của bạn để sử dụng dịch vụ của
            Docter Family.
          </p>
          <p> Chúng tôi sẽ liên hệ cho bạn ngay sau khi bạn đăng ký.</p>
        </div>
        <Link
          to={PUBLIC_ROUTES.register}
          className='col-span-2 bg-gray-200 rounded w-7 h-7 grid place-items-center'
        >
          <ArrowLeftOutline className='w-6' />
        </Link>
      </div>

      <div className='register-form w-full'>
        <Formik
          initialValues={initialValues}
          validationSchema={registerDocterSchema}
          onSubmit={async (values) => {
            const valuesSubmit = { ...values, notarizedImages: files };
            const resImage = await uploadImageApi(
              valuesSubmit.notarizedImages as FileList
            );
            const birthdayFm = timestampToDate(
              valuesSubmit.birthDay,
              'MM-DD-YYYY'
            );
            if (!(resImage === undefined)) {
              const valuesSubmitFinal = {
                ...values,
                birthDay: birthdayFm,
                departments: department,
                notarizedImages: resImage.urls,
                nameImages: { notarizedImages: resImage.image_names }
              };
              handleSubmitRegisterForm(valuesSubmitFinal);
            }
          }}
        >
          <Form className='form-group flex flex-col'>
            <div className='overflow-y-scroll max-h-[50vh]'>
              <InputValidations
                label='Số điện thoại'
                id='phoneNumber'
                name='phoneNumber'
                type='text'
                placeholder='Số điện thoại của bạn'
              />
              <InputValidations
                label='Email'
                id='email'
                name='email'
                type='email'
                placeholder='Email của bạn'
              />
              <InputValidations
                label='Tên đầy đủ'
                id='fullName'
                name='fullName'
                type='text'
                placeholder='Tên của bạn'
              />

              <label htmlFor='department' className='font-semibold'>
                Khoa
              </label>
              <Select
                id='department'
                placeholder='Chọn khoa'
                style={{ width: '100%' }}
                onChange={handleChange}
                tokenSeparators={[',']}
                options={options}
              />
              <InputValidations
                label='Mật khẩu'
                id='password'
                name='password'
                type='password'
                placeholder='Nhập mật khẩu'
              />

              <InputValidations
                label='Nhập lại mật khẩu'
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                placeholder='Mật khẩu vừa nhập'
              />
              <InputValidations
                label='Ngày sinh'
                id='birthDay'
                name='birthDay'
                type='date'
                placeholder='Nhập ngày sinh'
              />
              <InputValidations
                label='Nhập giá tiền khám bệnh'
                id='diagnosticFee'
                name='diagnosticFee'
                type='text'
                placeholder='Giá tiền khám bệnh'
              />
              <InputValidations
                label='Nhập chứng chỉ'
                id='degree'
                name='degree'
                type='text'
                placeholder='Chứng chỉ của bạn'
              />
              <InputValidations
                label='Giới tính'
                id='gender'
                name='gender'
                type='text'
                placeholder='Giới tính'
              />
              <div>
                <InputValidations
                  label='Địa chỉ'
                  id='street'
                  name='street'
                  type='text'
                  placeholder='Địa chỉ'
                />
                <InputValidations
                  label='Phường/Xã'
                  id='village'
                  name='village'
                  type='text'
                  placeholder='Phường/Xã'
                />
                <InputValidations
                  label='Quận/Huyện'
                  id='district'
                  name='district'
                  type='text'
                  placeholder='Quận/Huyện'
                />
                <InputValidations
                  label='Tỉnh/Thành phố'
                  id='city'
                  name='city'
                  type='text'
                  placeholder='Tỉnh/Thành phố'
                />
              </div>
              <InputValidations
                label='CMND/CCCD'
                id='citizenIdentification'
                name='citizenIdentification'
                type='text'
                placeholder='CMND/CCCD'
              />

              <InputValidations
                label='Công việc hiện tại'
                id='currentJob'
                name='currentJob'
                type='text'
                placeholder='Công việc hiện tại của bạn'
              />
              <InputValidations
                label='Kinh nghiệm làm việc'
                id='expreience'
                name='expreience'
                type='text'
                placeholder='Kinh nghiệm làm việc'
              />
              <InputValidations
                multiple
                label='Hình ảnh công chứng'
                id='notarizedImages'
                name='notarizedImages'
                type='file'
                placeholder='Hình ảnh công chứng bằng cấp, chứng chỉ...'
                onChange={(e: { target: { files: FileList } }) => {
                  setFiles(e.target.files);
                }}
              />
            </div>

            {titleError && <ErrorMessage title={titleError} />}

            <CLink to='/forgot-password'>Quên mật khẩu ?</CLink>

            <Button primary type='submit' className='w-full'>
              Đăng ký
            </Button>
          </Form>
        </Formik>
      </div>
    </>
  );
};

export default RegisterDocter;
