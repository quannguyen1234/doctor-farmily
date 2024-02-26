import { Form, Formik } from 'formik';
import { FC } from 'react';
import classNames from 'classnames/bind';

import styles from './AddLocationForm.module.scss';
import { IAddress } from '@/types/user';
import { addLocationSchema } from '@/utils/Validations/User';
import InputValidations from '../../Input/InputValidation';
import Button from '../../Button/Button';
import { useCurrentLocationActions } from '@/components/Map/mapStore';

const cx = classNames.bind(styles);

const initialValues: Omit<IAddress, 'id'> = {
  street: '',
  village: '',
  district: '',
  city: ''
};

const AddLocationForm: FC = () => {
  const { setCurrentLocation } = useCurrentLocationActions();
  const handleSubmit = (values: Omit<IAddress, 'id'>) => {
    // setCurrentLocation(values)
    console.log('values:::', values);
  };

  return (
    <div className={cx('wrapper')}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => handleSubmit(values)}
        validationSchema={addLocationSchema}
      >
        <Form>
          <InputValidations
            label='Địa chỉ'
            id='street'
            name='street'
            type='text'
            placeholder='Tên đường, ngõ...'
          />
          <InputValidations
            label='Phường/Xã'
            id='village'
            name='village'
            type='text'
            placeholder='Tên phường, xã, thôn, xóm...'
          />
          <InputValidations
            label='Quận/Huyện'
            id='district'
            name='district'
            type='text'
            placeholder='Quận, huyện, thị xã...'
          />
          <InputValidations
            label='Tỉnh/Thành phố'
            id='city'
            name='city'
            type='text'
            placeholder='Tỉnh, thành phố...'
          />
          <Button className='mt-6' type='submit'>
            Cập nhật
          </Button>
        </Form>
      </Formik>
    </div>
  );
};

export default AddLocationForm;
