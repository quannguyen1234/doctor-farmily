/* eslint-disable no-plusplus */
import { Space, Table, Modal } from 'antd';
import { FC, useState } from 'react';
import classNames from 'classnames/bind';
import { ColumnsType } from 'antd/es/table';
import { toast } from 'react-toastify';

import {
  EyeSlashOutline,
  MagnifyingGlassOutline
} from '@graywolfai/react-heroicons';
import styles from './styles.module.scss';
import { IDoctor } from '@/types/user';
import Button from '@/components/Button/ButtonTable';
import {
  useDeleteDoctor,
  useGetAllDoctors
} from '@/features/Admin/apis/doctors';
import AddDocter from './AddDoctor';
import EditDoctorModal from './EditDoctor';

const cx = classNames.bind(styles);

const DoctorManagement: FC = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isShowAddModal, setIsShowAddModal] = useState(false);
  const [isShowEditModal, setIsShowEditModal] = useState(false);
  const [editField, setEditField] = useState();
  const { data: doctorsData, refetch } = useGetAllDoctors();

  const handleOpenModal = (record: any) => {
    setOpenModal(true);
    setEditField(record);
  };

  const handleEditClick = (record: any) => {
    setIsShowEditModal(true);
    setEditField(record);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsShowEditModal(false);
    setIsShowAddModal(false);
    refetch();
  };

  const deleteDoctor = useDeleteDoctor();
  const handleDelete = (id: any) => {
    Modal.confirm({
      title: 'Xóa bác sĩ',
      icon: <></>,
      centered: true,
      content: 'Bạn có chắn chắn muốn xóa bác sĩ?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      okButtonProps: {
        style: {
          backgroundColor: '#007bff'
        }
      },
      onOk: () => {
        deleteDoctor.mutate(id);
        refetch();
        toast.success('Xóa thành công');
      }
    });
  };

  const columns: ColumnsType<IDoctor> = [
    {
      title: '#',
      dataIndex: 'stt',
      key: 'stt',
      width: 50,
      fixed: 'left',
      render: (text, record, index) => <span>{++index}</span>
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 120,
      fixed: 'left',
      render: (text, record) => record?.baseUser.fullName
    },
    {
      title: 'email',
      dataIndex: 'email',
      key: 'demailesc',
      align: 'center',
      width: 200,
      render: (text, record) => record?.baseUser.email
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      align: 'center',
      width: 120,
      render: (text, record) => record?.baseUser.phoneNumber
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birthday',
      key: 'birthday',
      align: 'center',
      width: 120,
      render: (text, record) => record?.baseUser.birthDay
    },
    {
      title: 'Giá tiền khám bệnh',
      dataIndex: 'diagnosticFee',
      key: 'diagnosticFee',
      align: 'center',
      width: 120,
      render: (text, record) => record?.diagnosticFee
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'currentAddress',
      key: 'currentAddress',
      align: 'center',
      width: 250,
      render: (text, record) => (
        <p>
          {record?.baseUser.currentAddress?.street} -{' '}
          {record?.baseUser.currentAddress?.village} -{' '}
          {record?.baseUser.currentAddress?.district} -{' '}
          {record?.baseUser.currentAddress?.city}{' '}
        </p>
      )
    },
    {
      title: 'Khoa',
      dataIndex: 'departments',
      key: 'departments',
      align: 'center',
      width: 100,
      render: (text, record) => record?.departments[0]?.name
    },
    {
      title: 'Bằng cấp',
      dataIndex: 'degree',
      key: 'degree',
      width: 200,
      align: 'center',
      render: (text, record) => record?.degree
    },
    {
      title: 'Hình Ảnh Giấy tờ',
      dataIndex: 'image',
      key: 'image',
      width: 250,
      className: `${cx('image')}`,
      render: (text: any, record: any, index: any) => (
        <img
          src={record?.notarizedImages ? `${record.notarizedImages}` : ''}
          alt=''
        />
      )
    },
    {
      title: 'Hành Động',
      key: 'action',
      fixed: 'right',
      width: 250,
      render: (text, record: IDoctor, index) => (
        <Space size='small'>
          <Button
            type='success'
            onClick={() => handleOpenModal(record)}
            text='Xem'
          />

          <Button
            type='secondary'
            onClick={() => handleEditClick(record)}
            text='Sửa'
          />

          <Button
            type='danger'
            onClick={() => handleDelete(record?.doctorId)}
            text='Xóa'
          />
        </Space>
      )
    }
  ];
  return (
    <>
      {isShowAddModal && (
        <AddDocter isShow={isShowAddModal} onCancel={handleCloseModal} />
      )}
      {openModal && (
        <EditDoctorModal
          isShow={openModal}
          onCancel={handleCloseModal}
          isView={openModal}
          editField={editField}
        />
      )}
      {isShowEditModal && (
        <EditDoctorModal
          isShow={isShowEditModal}
          editField={editField}
          onCancel={handleCloseModal}
        />
      )}
      <section className={cx('container')}>
        <div className={cx('table')}>
          <Button
            type='primary'
            onClick={() => setIsShowAddModal(true)}
            text='Thêm bác sĩ'
          />
          <Table
            rowKey={(record) => `${record.doctorId}`}
            columns={columns}
            dataSource={doctorsData}
            pagination={{ defaultPageSize: 5 }}
            scroll={{
              x: 1300
            }}
          />
        </div>
      </section>
    </>
  );
};

export default DoctorManagement;
