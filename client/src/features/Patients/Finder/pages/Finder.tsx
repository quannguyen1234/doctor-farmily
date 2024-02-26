import { FC, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

import DepartmentCard from '@/components/DepartmentCard';
import Search from '@/components/Input/Search';
import { useGetDepartments } from '@/apis/booking.api';
import { useUserActions } from '@/stores/user.store';
import Modal from '@/components/Modal/Modal';
import Button from '@/components/Button/Button';
import { PRIVATE_ROUTES } from '@/utils/constant/routes';
import useConvertAddress from '@/hooks/useConvertAddress';

const Finder: FC = () => {
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [deIdClick, setDeIdClick] = useState<string>('');
  const navigate = useNavigate();
  const { data, isLoading } = useGetDepartments();
  const { setSearchParams } = useUserActions();
  const address = useConvertAddress();

  const handleSelectDepartment = async (id: string) => {
    setSearchParams(id);

    navigate(PRIVATE_ROUTES.patientsFinderDocter, {
      state: {
        deId: id,
        address
      }
    });
  };

  const handleChooseDoctor = (departmentId: string) => {
    setIsShowModal(true);
    setDeIdClick(departmentId);
  };

  if (isLoading) {
    return <div>...loading</div>;
  }

  return (
    <>
      {isShowModal && (
        <Modal
          titleHeader='Bạn muốn tìm bác sĩ ở khoa này?'
          isShow={isShowModal}
        >
          <div className='flex gap-2'>
            <div
              onClick={() => {
                setIsShowModal(false);
              }}
            >
              <Button>Hủy</Button>
            </div>
            <div onClick={() => handleSelectDepartment(deIdClick)}>
              <Button primary>Xác nhận</Button>
            </div>
          </div>
        </Modal>
      )}
      <div>
        <div className='mb-5'>
          <h1 className='text-4xl font-bold mb-5'>
            Chọn khoa ban đang cần tìm
          </h1>
          <div className='flex justify-center'>
            <Search
              id='search-departments'
              type='text'
              leftIcon={<AiOutlineSearch className='text-3xl' />}
              placeholder='Tìm kiếm'
            />
          </div>
        </div>

        <div className='grid grid-cols-3 gap-4'>
          {data &&
            data.map((department) => (
              <div
                onClick={() => handleChooseDoctor(department.deId)}
                key={department.deId}
              >
                <DepartmentCard
                  key={department.deId}
                  title={department.name}
                  desc='khoa nay lam gi'
                  images={department.images[0]}
                />
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Finder;
