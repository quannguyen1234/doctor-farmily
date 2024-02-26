import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './styles.module.scss';
import { useGetPatient } from '@/features/Admin/apis/patient';
import InfoItem from '../../components/InfoItem';
import Button from '@/components/Button/ButtonTable';
import EditPatientModal from '@/features/Admin/Page/PatientsManagement/EditPatient';
import IMAGE from '@/assets/images';

const cx = classNames.bind(styles);
const SettingProfile: FC = () => {
  const { id } = useParams();
  const [isShowEditModal, setIsShowEditModal] = useState(false);

  const { data: patient, refetch } = useGetPatient(String(id));

  const handleEditClick = () => {
    setIsShowEditModal(true);
  };

  const handleCloseModal = () => {
    setIsShowEditModal(false);
    refetch();
  };

  return (
    <>
      {isShowEditModal && (
        <EditPatientModal
          isShow={isShowEditModal}
          editField={patient}
          onCancel={handleCloseModal}
        />
      )}
      <div>
        <h2 className='border-b-2'>Thông tin cá nhân</h2>
        <div className={cx('profile-info')}>
          <div className={cx('avatarBox')}>
            <img
              src={IMAGE.bannerAuthenLayout}
              alt=''
              className={cx('image')}
            />
          </div>

          <div className='flex flex-col ml-[40px]  w-full'>
            <InfoItem title='Email' initialValue={patient?.baseUser.email} />
            <InfoItem
              title='Họ và tên'
              initialValue={patient?.baseUser.fullName}
            />

            <InfoItem
              title='Số điện thoại'
              initialValue={patient?.baseUser.phoneNumber}
            />
            <InfoItem
              title='Ngày sinh'
              initialValue={patient?.baseUser.birthDay}
            />
            <Button
              className='mt-10 w-max'
              type='primary'
              onClick={() => handleEditClick()}
              text='Chỉnh sửa thông tin'
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingProfile;
