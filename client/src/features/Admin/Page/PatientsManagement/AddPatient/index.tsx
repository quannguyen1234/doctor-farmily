import { Modal } from 'antd';
import { Form, Formik } from 'formik';
import { FC, useState } from 'react';
import { toast } from 'react-toastify';

import InputValidations from '@/components/Input/InputValidation';
import { registerSchema } from '@/utils/Validations/Authentication';
import { timestampToDate } from '@/utils/day';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import Button from '@/components/Button/Button';
import { IAuthValidationForm } from '@/types/authentications';
import { registerAccountApi } from '@/features/Authentications/services/authenService';

interface ModalProps {
  isShow: boolean;
  onCancel: any;
}

const AddPatientModal: FC<ModalProps> = ({ isShow = false, onCancel }) => {
  const [titleError, setTitleError] = useState('');
  const initialValues: IAuthValidationForm = {
    phoneNumber: '',
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    birthDay: ''
  };

  const handleSubmitRegisterForm = async (values: IAuthValidationForm) => {
    const res = await registerAccountApi(values);

    if (!res.flag) {
      const { baseUser } = res;
      if (baseUser.email) {
        setTitleError('Email đã tồn tại');
        toast.error('Thêm không thành công');
      } else if (baseUser.phoneNumber) {
        setTitleError('Số điệnt thoại đã tồn tại');
        toast.error('Thêm không thành công');
      } else {
        setTitleError('Email hoặc số điện thoại đã tồn tại');
        toast.error('Thêm không thành công');
      }
    } else {
      onCancel();
      toast.success('Thêm thành công');
    }
  };

  return (
    <Modal
      open={isShow}
      title={
        <div className='text-[20px] flex justify-center font-header'>
          Thêm mới
        </div>
      }
      className='w-[800px]'
      footer={null}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={registerSchema}
        onSubmit={(values) => {
          const birthdayFm = timestampToDate(values.birthDay, 'MM-DD-YYYY');
          const valuesSubmit = { ...values, birthDay: birthdayFm };
          handleSubmitRegisterForm(valuesSubmit);
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
              placeholder='Email'
            />
            <InputValidations
              label='Tên đầy đủ'
              id='fullName'
              name='fullName'
              type='text'
              placeholder='Họ tên'
            />
            <InputValidations
              label='Ngày sinh'
              id='birthDay'
              name='birthDay'
              type='date'
              placeholder='Nhập ngày sinh'
            />
            <InputValidations
              label='Mật khẩu'
              id='password'
              name='password'
              type='password'
              placeholder='Mật khẩu'
            />
            <InputValidations
              label='Nhập lại mật khẩu'
              id='confirmPassword'
              name='confirmPassword'
              type='password'
              placeholder='Mật khẩu vừa nhập'
            />
          </div>
          {titleError && <ErrorMessage title={titleError} />}
          <div className='pt-8 flex justify-end'>
            <Button className='rounded-lg mr-3' onClick={() => onCancel()}>
              Hủy
            </Button>
            <Button className='rounded-lg mr-3' primary type='submit'>
              Lưu
            </Button>
          </div>
        </Form>
      </Formik>
    </Modal>
  );
};

export default AddPatientModal;
