/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Space, Table, Modal, Input } from 'antd';
import { FC, useState } from 'react';
import classNames from 'classnames/bind';
import { ColumnsType } from 'antd/es/table';
import { toast } from 'react-toastify';

import Button from '@/components/Button/ButtonTable';
import styles from './styles.module.scss';

import {
  useGetDepartments,
  useDeleteDepartment
} from '@/features/Admin/apis/department';
import { IDepartment } from '@/types/common';
import AddDepartment from './AddDepartment';

const cx = classNames.bind(styles);

const DepartmentManagement: FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [isShowAddModal, setIsShowAddModal] = useState(false);
  const [isShowEditModal, setIsShowEditModal] = useState(false);
  const [editField, setEditField] = useState();
  const { data: departmentData, refetch, isSuccess } = useGetDepartments();

  const handleEditClick = (record: any) => {
    setIsShowEditModal(true);
    setEditField(record);
  };

  const handleOpenModal = (record: any) => {
    setOpenModal(true);
    setEditField(record);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsShowEditModal(false);
    setIsShowAddModal(false);
    refetch();
  };

  const deleteDe = useDeleteDepartment();
  const handleDelete = (id: any) => {
    Modal.confirm({
      title: 'Xóa khoa',
      icon: <></>,
      centered: true,
      content: 'Bạn có chắn chắn muốn xóa khoa?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      okButtonProps: {
        style: {
          backgroundColor: '#007bff'
        }
      },
      onOk: () => {
        deleteDe.mutate(id);
        refetch();
        toast.success('Xóa thành công');
      }
    });
  };

  const columns: ColumnsType<IDepartment> = [
    {
      title: '#',
      dataIndex: 'stt',
      key: 'stt',
      width: 100,
      render: (text, record, index) => <span>{++index}</span>
    },
    {
      title: 'Tên khoa',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      align: 'center'
    },
    {
      title: 'Mô tả',
      dataIndex: 'desc',
      key: 'desc',
      width: '30%',
      align: 'center'
    },
    {
      title: 'Hình Ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 300,
      className: `${cx('image')}`,
      render: (text: any, record: any, index: any) => (
        <img src={record.images ? `${record.images[0]}` : ''} alt='' />
      )
    },
    {
      title: 'Hành Động',
      key: 'action',
      fixed: 'right',
      width: 240,
      render: (text, record: IDepartment, index) => (
        <Space size='middle'>
          <Button
            type='secondary'
            onClick={() => handleEditClick(record)}
            text='Sửa'
          />
          <Button
            type='danger'
            onClick={() => handleDelete(record?.deId)}
            text='Xóa'
          />
        </Space>
      )
    }
  ];

  return (
    <>
      {isShowAddModal && (
        <AddDepartment isShow={isShowAddModal} onCancel={handleCloseModal} />
      )}
      {/* {openModal && (
        <AddDepartment
          isShow={openModal}
          onCancel={handleCloseModal}
          isView={openModal}
          editField={editField}
        />
      )} */}
      {isShowEditModal && (
        <AddDepartment
          isShow={isShowEditModal}
          editField={editField}
          onCancel={handleCloseModal}
        />
      )}
      <section className={cx('container')}>
        <div>
          <Button
            type='primary'
            onClick={() => setIsShowAddModal(true)}
            text='Thêm khoa'
          />
        </div>
        <div className={cx('table')}>
          {isSuccess && (
            <Table
              onRow={(record) => {
                return {
                  onClick: (event) => handleOpenModal(record)
                };
              }}
              rowKey={(record) => `${record.deId}`}
              columns={columns}
              dataSource={departmentData}
              pagination={{ defaultPageSize: 5 }}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default DepartmentManagement;
