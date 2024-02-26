import { Modal } from 'antd';
import { FC, useState } from 'react';
import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';

import InputValidations from '@/components/Input/InputValidation';
import { updateUserSchema } from '@/utils/Validations/Authentication';
import { timestampToDate } from '@/utils/day';
import { updatePatient } from '@/features/Admin/apis/patient';
import Button from '@/components/Button/Button';
import { IPatientRes } from '@/types/user';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

interface ModalProps {
  isShow: boolean;
  onCancel: any;
  editField?: IPatientRes;
  isView?: boolean;
}

const EditPatientModal: FC<ModalProps> = ({
  isShow = false,
  onCancel,
  editField,
  isView
}) => {
  const [titleError, setTitleError] = useState('');
  const initialValues: IPatientRes = {
    patientId: editField ? editField.patientId : '',
    baseUser: {
      phoneNumber: editField ? editField.baseUser.phoneNumber : '',
      email: editField ? editField.baseUser.email : '',
      fullName: editField ? editField.baseUser.fullName : '',
      birthDay: editField ? editField.baseUser.birthDay : ''
    }
  };

  const handleSubmit = async (values: IPatientRes) => {
    if (values.baseUser.email === editField?.baseUser.email) {
      const { email, ...updatedBaseUser } = values.baseUser;
      values.baseUser = updatedBaseUser;
    }
    if (values.baseUser.phoneNumber === editField?.baseUser.phoneNumber) {
      const { phoneNumber, ...updatedBaseUser } = values.baseUser;
      values.baseUser = updatedBaseUser;
    }
    let valuesSubmit = values;
    if (values.baseUser.birthDay === editField?.baseUser.birthDay) {
      const birthdayFm = timestampToDate(
        values.baseUser.birthDay,
        'MM-DD-YYYY'
      );
      valuesSubmit = {
        ...values,
        baseUser: {
          ...values.baseUser,
          birthDay: birthdayFm
        }
      };
    }
    const res = await updatePatient(valuesSubmit);
    if (!res.flag) {
      const { baseUser } = res;
      if (baseUser.email) {
        setTitleError('Email đã tồn tại');
        toast.error('Sửa không thành công');
      } else if (baseUser.phoneNumber) {
        setTitleError('Số điện thoại đã tồn tại');
        toast.error('Sửa không thành công');
      } else {
        setTitleError('Email hoặc số điện thoại đã tồn tại');
        toast.error('Sửa không thành công');
      }
    } else {
      onCancel();
      toast.success('Sửa thành công');
    }
  };

  return (
    <Modal
      open={isShow}
      title={
        <div className='text-[20px] flex justify-center font-header'>
          {isView ? 'Thông tin bệnh nhân' : ' Sửa thông tin'}
        </div>
      }
      className='w-[800px]'
      footer={null}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={updateUserSchema}
        onSubmit={handleSubmit}
      >
        <Form className='form-group flex flex-col'>
          <div className='overflow-y-scroll max-h-[50vh]'>
            <InputValidations
              label='Email'
              id='baseUser.email'
              name='baseUser.email'
              type='email'
              placeholder='Email'
            />
            <InputValidations
              label='Số điện thoại'
              id='baseUser.phoneNumber'
              name='baseUser.phoneNumber'
              type='text'
              placeholder='Số điện thoại của bạn'
            />
            <InputValidations
              label='Tên đầy đủ'
              id='baseUser.fullName'
              name='baseUser.fullName'
              type='text'
              placeholder='Họ tên'
            />
            <InputValidations
              label='Ngày sinh'
              id='baseUser.birthDay'
              name='baseUser.birthDay'
              type='date'
              placeholder='Nhập ngày sinh'
            />
          </div>
          {titleError && <ErrorMessage title={titleError} />}
          {isView ? (
            <Button
              className='rounded-2xl mr-3 mt-6'
              onClick={() => onCancel()}
            >
              Đóng
            </Button>
          ) : (
            <div className='pt-8 flex justify-end'>
              <Button className='rounded-lg mr-3' onClick={() => onCancel()}>
                Hủy
              </Button>
              <Button className='rounded-lg mr-3' primary type='submit'>
                Lưu
              </Button>
            </div>
          )}
        </Form>
      </Formik>
    </Modal>
  );
};

export default EditPatientModal;
