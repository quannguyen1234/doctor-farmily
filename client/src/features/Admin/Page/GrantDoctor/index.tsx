import Table, { ColumnsType } from 'antd/es/table';
import { Modal, Space } from 'antd';
import { FC, useState } from 'react';
import classNames from 'classnames/bind';
import { toast } from 'react-toastify';

import styles from './styles.module.scss';
import Button from '@/components/Button/ButtonTable';
import { IDoctor } from '@/types/user';
import {
  useGetRequestDoctors,
  usegrantDoctor
} from '@/features/Admin/apis/doctors';
import EditDoctorModal from '../DoctorManagement/EditDoctor';

const cx = classNames.bind(styles);

const GrantDoctor: FC = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [data, setdata] = useState();
  const { data: doctorsData, isLoading } = useGetRequestDoctors();
  const grantDoctor = usegrantDoctor();

  const handleOpenModal = (record: any) => {
    setOpenModal(true);
    setdata(record);
  };

  const handleCancel = () => {
    setOpenModal(false);
  };

  const OnClickGrant = (id: string) => {
    Modal.confirm({
      title: 'Duyệt bác sĩ',
      icon: <></>,
      centered: true,
      content: 'Bạn có muốn duyệt bác sĩ này không?',
      okText: 'Confirm',
      okButtonProps: {
        style: {
          backgroundColor: '#007bff'
        }
      },
      onOk: () => {
        grantDoctor.mutate(id);
        toast.success('Duyệt thành công');
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
      // eslint-disable-next-line no-plusplus
      render: (text, record, index) => <span>{++index}</span>
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 150,
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
      width: 150,
      render: (text, record) => <span>{record?.diagnosticFee} VND</span>
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
      render: (text: any, record: IDoctor, index: any) => (
        <Space>
          <Button
            type='success'
            onClick={() => handleOpenModal(record)}
            text='Xem'
          />
          <Button
            type='primary'
            onClick={() => OnClickGrant(record.doctorId)}
            text='Duyệt'
          />
        </Space>
      )
    }
  ];

  return (
    <>
      {openModal && (
        <EditDoctorModal
          isShow={openModal}
          onCancel={handleCancel}
          isView={openModal}
          editField={data}
        />
      )}
      <section className={cx('container')}>
        <h1>Danh sách bác sĩ đăng ký</h1>
        <div className={cx('table')}>
          <Table
            rowKey={(record) => `${record.doctorId}`}
            columns={columns}
            loading={isLoading}
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

export default GrantDoctor;
