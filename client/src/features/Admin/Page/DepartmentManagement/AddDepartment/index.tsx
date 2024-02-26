import { Modal } from 'antd';
import { Form, Formik } from 'formik';
import { FC, useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '@/components/Button/Button';
import InputValidations from '@/components/Input/InputValidation';
import { uploadImageApi } from '@/services/upload';
import {
  useCreateDepartment,
  useUpdateDepartment
} from '@/features/Admin/apis/department';
import { IDepartment } from '@/types/common';

interface ModalProps {
  isShow: boolean;
  onCancel: () => void;
  editField?: IDepartment;
  isView?: boolean;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Enter your name')
});

const AddDepartment: FC<ModalProps> = ({
  isShow = false,
  onCancel,
  editField,
  isView
}) => {
  const [imageSelected, setImageSelected] = useState({
    url: undefined,
    nameIamge: undefined
  });

  const initialValues: IDepartment = {
    deId: editField ? editField.deId : '',
    name: editField ? editField.name : '',
    images: undefined,
    imageNames: []
  };

  const createDepartment = useCreateDepartment();
  const updateDepartment = useUpdateDepartment();
  const handleSubmitRegisterForm = async (values: IDepartment) => {
    if (editField) {
      updateDepartment.mutate(values);
      toast.success('Sửa thành công');
    } else {
      createDepartment.mutate(values);
      toast.success('Thêm thành công');
    }
    onCancel();
  };

  const handleOnChangeImage = (e: { target: { files: FileList } }) => {
    Array.from(e.target.files).forEach(async (file) => {
      if (file.size <= 52428800) {
        const data = await uploadImageApi(e.target.files as FileList);
        if (!(data === undefined)) {
          setImageSelected({ url: data.urls, nameIamge: data.image_names });
        }
      } else {
        alert('Size of this file is so big!!');
      }
    });
  };

  return (
    <>
      <Modal
        open={isShow}
        title={
          <div className='text-[20px] flex justify-center font-header'>
            {editField ? 'Thông tin' : 'Thêm mới'}
          </div>
        }
        className='w-[800px]'
        footer={null}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            const valuesSubmit = {
              ...values,
              images: imageSelected.url,
              imageNames: imageSelected.nameIamge
            };
            handleSubmitRegisterForm(valuesSubmit);
          }}
        >
          <Form className='form-group flex flex-col'>
            <div className='overflow-y-scroll max-h-[50vh]'>
              <InputValidations
                label='Tên đầy đủ'
                id='name'
                name='name'
                type='text'
                placeholder='vui lòng nhập vào tên khoa'
              />
              <InputValidations
                multiple
                label='Hình ảnh khoa'
                id='images'
                name='images'
                type='file'
                placeholder='Hình ảnh khoa...'
                onChange={handleOnChangeImage}
              />
              {imageSelected ? (
                <img
                  src={imageSelected.url}
                  alt=''
                  className='w-[200px] rounded'
                />
              ) : null}

              {/* {(editField) ?
                (imageSelected ?
                  (<img src={imageSelected.url} alt='' className='w-[200px] rounded' />) :
                  (<img src={editField.images ? `${editField.images}` : ''} alt='' className='w-[200px] rounded' />)
                ) : null
              } */}
            </div>
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
    </>
  );
};

export default AddDepartment;
