/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Space, Table, Modal } from 'antd';
import { FC, useState } from 'react';
import classNames from 'classnames/bind';
import { ColumnsType } from 'antd/es/table';
import { toast } from 'react-toastify';

import Button from '@/components/Button/ButtonTable';
import styles from './styles.module.scss';
import {
  useGetPatients,
  useDeletePatient
} from '@/features/Admin/apis/patient';
import { IPatientRes } from '@/types/user';
import AddPatientModal from './AddPatient';
import EditPatientModal from './EditPatient';

const cx = classNames.bind(styles);

const PatientsManagement: FC = () => {
  const [isShowAddModal, setIsShowAddModal] = useState(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isShowEditModal, setIsShowEditModal] = useState(false);
  const [editField, setEditField] = useState();
  const { data: patientstData, refetch } = useGetPatients();

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
    setIsShowAddModal(false);
    setIsShowEditModal(false);
    refetch();
  };

  const deletePatient = useDeletePatient();
  const handleDelete = (id: any) => {
    Modal.confirm({
      title: 'Xóa bệnh nhân',
      icon: <></>,
      centered: true,
      content: 'Bạn có chắn chắn muốn xóa?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      okButtonProps: {
        style: {
          backgroundColor: '#007bff'
        }
      },
      onOk: () => {
        deletePatient.mutate(id);
        refetch();
        toast.success('Xóa thành công');
      }
    });
  };

  const columns: ColumnsType<IPatientRes> = [
    {
      title: '#',
      dataIndex: 'stt',
      key: 'stt',
      width: 100,
      render: (text, record, index) => <span>{++index}</span>
    },
    {
      title: 'Tên',
      dataIndex: 'fullName',
      sortDirections: ['ascend', 'descend'],
      sorter: (a, b) =>
        a.baseUser.fullName
          .toLocaleLowerCase()
          .localeCompare(b.baseUser.fullName.toLocaleLowerCase()),
      key: 'fullName',
      width: '20%',
      align: 'center',
      render: (text, record: IPatientRes, index) => record?.baseUser.fullName
    },
    {
      title: 'email',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
      width: '20%',
      render: (text, record) => record?.baseUser.email
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: '20%',
      align: 'center',
      render: (text, record) => record?.baseUser.phoneNumber
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birthday',
      key: 'birthday',
      width: 180,
      align: 'center',
      render: (text, record) => record?.baseUser.birthDay
    },

    {
      title: 'Hành Động',
      key: 'action',
      fixed: 'right',
      width: 300,
      render: (text, record: IPatientRes, index) => (
        <Space size='small'>
          <Button
            type='success'
            onClick={() => handleOpenModal(record)}
            text='Hồ sơ'
          />
          <Button
            type='secondary'
            text='Sửa'
            onClick={() => handleEditClick(record)}
          />
          <Button
            type='danger'
            onClick={() => handleDelete(record?.patientId)}
            text='Xóa'
          />
        </Space>
      )
    }
  ];
  return (
    <>
      {isShowAddModal && (
        <AddPatientModal isShow={isShowAddModal} onCancel={handleCloseModal} />
      )}
      {openModal && (
        <EditPatientModal
          isShow={openModal}
          onCancel={handleCloseModal}
          isView={openModal}
          editField={editField}
        />
      )}
      {isShowEditModal && (
        <EditPatientModal
          isShow={isShowEditModal}
          editField={editField}
          onCancel={handleCloseModal}
        />
      )}
      <section className={cx('container')}>
        <div className={cx('btn-create')}>
          <Button
            type='primary'
            onClick={() => setIsShowAddModal(true)}
            text='Thêm mới'
          />
        </div>
        <div className={cx('table')}>
          <Table
            rowKey={(record) => `${record.patientId}`}
            columns={columns}
            dataSource={patientstData}
            pagination={{ defaultPageSize: 7 }}
          />
        </div>
      </section>
    </>
  );
};

export default PatientsManagement;
