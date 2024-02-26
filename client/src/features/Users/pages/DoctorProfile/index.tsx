/* eslint-disable react/no-array-index-key */
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InfoItem from '../../components/InfoItem';
import Button from '@/components/Button/ButtonTable';
import { useGetDoctor } from '@/features/Admin/apis/doctors';
import EditDoctorModal from '@/features/Admin/Page/DoctorManagement/EditDoctor';

const SettingProfile: FC = () => {
  const { id } = useParams();
  const [isShowEditModal, setIsShowEditModal] = useState(false);
  const { data: doctor, refetch } = useGetDoctor(String(id));

  useEffect(() => {
    if (doctor) {
      console.log(Object.keys(doctor.baseUser));
    }
  }, [doctor]);

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
        <EditDoctorModal
          isShow={isShowEditModal}
          editField={doctor}
          onCancel={handleCloseModal}
        />
      )}
      <div>
        <h2 className='border-b-2'>Thông tin cá nhân</h2>

        <div className='flex flex-col items-center'>
          <InfoItem title='Email' initialValue={doctor?.baseUser.email} />
          <InfoItem
            title='Họ và tên'
            initialValue={doctor?.baseUser.fullName}
            desc='Vui lòng nhập tên'
          />
          <InfoItem
            title='Số điện thoại'
            initialValue={doctor?.baseUser.phoneNumber}
            desc='Vui lòng nhập số điện thoại'
          />
          <InfoItem
            title='Ngày sinh'
            initialValue={doctor?.baseUser.birthDay}
          />
          <InfoItem
            title='CMND/CCCD'
            initialValue={doctor?.baseUser.citizenIdentification}
          />
          <InfoItem title='Khoa' initialValue={doctor?.departments[0]?.name} />
          <InfoItem title='Chứng chỉ' initialValue={doctor?.degree} />

          <InfoItem
            title='Công việc hiện tại'
            initialValue={doctor?.currentJob}
          />

          <div>
            <label className='font-semibold'>Hình ấy chứng nhận</label>
            {Array.isArray(doctor?.notarizedImages)
              ? doctor?.notarizedImages.map((img: any, idx: any) => (
                  <img key={idx} src={img ?? ''} alt='' />
                ))
              : [doctor?.notarizedImages].map((img: any, idx: any) => (
                  <img key={idx} src={img ?? ''} alt='' />
                ))}
          </div>
        </div>
        <div>
          <Button
            type='primary'
            onClick={() => handleEditClick()}
            text='Chỉnh sửa thông tin'
          />
        </div>
      </div>
    </>
  );
};

export default SettingProfile;
