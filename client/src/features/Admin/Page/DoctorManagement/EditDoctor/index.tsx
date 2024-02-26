/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable prettier/prettier */
import { Modal, Select } from 'antd';
import { Form, Formik } from 'formik';
import { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Button from '@/components/Button/Button';
import InputValidations from '@/components/Input/InputValidation';
import { UpdateDocterSchema } from '@/utils/Validations/Authentication';
import { timestampToDate } from '@/utils/day';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import { getAllDepartments } from '@/features/Admin/apis/department';
import { IDepartment } from '@/types/common';
import { updateDoctor } from '@/features/Admin/apis/doctors';
import { IDoctor } from '@/types/user';

interface ModalProps {
  isShow: boolean;
  onCancel: any;
  editField?: IDoctor;
  isView?: boolean;
}

const EditDoctorModal: FC<ModalProps> = ({
  isShow = false,
  onCancel,
  editField,
  isView
}) => {
  const [departmentRes, setDepartmentRes] = useState<IDepartment[]>([]);
  const department: Pick<IDepartment, 'deId' | 'name'>[] = [];
  const [titleError, setTitleError] = useState('');

  const initialValues: IDoctor = {
    doctorId: editField ? editField.doctorId : '',
    baseUser: {
      phoneNumber: editField ? editField.baseUser.phoneNumber : '',
      email: editField ? editField.baseUser.email : '',
      fullName: editField ? editField.baseUser.fullName : '',
      birthDay: editField ? editField.baseUser.birthDay : '',
      citizenIdentification: editField
        ? editField.baseUser.citizenIdentification
        : ''
    },
    degree: editField ? editField.degree : '',
    currentJob: editField ? editField.currentJob : '',
    departments: editField ? editField.departments : []
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

  const handleSubmit = async (values: IDoctor) => {
    if (values.baseUser.email === editField?.baseUser.email) {
      const { email, ...updatedBaseUser } = values.baseUser;
      values.baseUser = updatedBaseUser;
    }
    if (values.baseUser.phoneNumber === editField?.baseUser.phoneNumber) {
      const { phoneNumber, ...updatedBaseUser } = values.baseUser;
      values.baseUser = updatedBaseUser;
    }
    if (
      values.baseUser.citizenIdentification ===
      editField?.baseUser.citizenIdentification
    ) {
      const { citizenIdentification, ...updatedBaseUser } = values.baseUser;
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
    const valuesSubmitFinal = {
      ...valuesSubmit,
      departments: department
    };

    const res = await updateDoctor(valuesSubmitFinal);
    if (!res.flag) {
      const { baseUser } = res;
      if (baseUser.email) {
        setTitleError('Email đã tồn tại');
        toast.error('Sửa không thành công');
      } else if (baseUser.phoneNumber) {
        setTitleError('Số điện thoại đã tồn tại');
        toast.error('Sửa không thành công');
      } else if (baseUser.citizenIdentification) {
        setTitleError('CCCD/CMND đã tồn tại');
        toast.error('Sửa không thành công');
      }
    } else {
      onCancel();
      toast.success('Sửa thành công');
    }
  };

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
      <Modal
        open={isShow}
        title={
          <div className='text-[20px] flex justify-center font-header'>
            {isView ? 'Thông tin bác sĩ' : ' Sửa thông tin'}
          </div>
        }
        footer={null}
      >
        <div className='w-full'>
          <Formik
            initialValues={initialValues}
            validationSchema={UpdateDocterSchema}
            onSubmit={handleSubmit}
          >
            <Form className='form-group flex flex-col'>
              <div className='overflow-y-scroll max-h-[55vh]'>
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
                <InputValidations
                  label='CMND/CCCD'
                  id='baseUser.citizenIdentification'
                  name='baseUser.citizenIdentification'
                  type='text'
                  placeholder='CMND/CCCD'
                />
                <label htmlFor='department' className='font-semibold'>
                  Khoa
                </label>
                <Select
                  id='department'
                  placeholder={editField ? editField.departments[0]?.name : ''}
                  className=''
                  style={{
                    width: '100%',
                    borderRadius: '10px',
                    height: '40px'
                  }}
                  onChange={handleChange}
                  tokenSeparators={[',']}
                  options={options}
                />
                <InputValidations
                  label='Nhập chứng chỉ'
                  id='degree'
                  name='degree'
                  type='text'
                  placeholder='Chứng chỉ của bạn'
                />

                <InputValidations
                  label='Công việc hiện tại'
                  id='currentJob'
                  name='currentJob'
                  type='text'
                  placeholder='Công việc hiện tại của bạn'
                />
                {editField && editField.notarizedImages ? (
                  <div>
                    <label className='font-semibold'>Hình ấy chứng nhận</label>
                    {Array.isArray(editField.notarizedImages)
                      ? editField.notarizedImages.map((img: any, idx: any) => (
                          <img key={idx} src={img ?? ''} />
                        ))
                      : [editField.notarizedImages].map(
                          (img: any, idx: any) => (
                            <img key={idx} src={img ?? ''} />
                          )
                        )}
                  </div>
                ) : (
                  ''
                )}
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
                  <Button
                    className='rounded-lg mr-3'
                    onClick={() => onCancel()}
                  >
                    Hủy
                  </Button>
                  <Button className='rounded-lg mr-3' primary type='submit'>
                    Lưu
                  </Button>
                </div>
              )}
            </Form>
          </Formik>
        </div>
      </Modal>
    </>
  );
};

export default EditDoctorModal;
