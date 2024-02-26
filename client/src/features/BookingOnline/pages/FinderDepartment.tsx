import { FC, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { useNavigate } from 'react-router-dom';

import DepartmentCard from '@/components/DepartmentCard';
import { useGetDepartments } from '@/apis/booking.api';
import { useIsWaiting, useUserActions } from '@/stores/user.store';
import Modal from '@/components/Modal/Modal';
import Button from '@/components/Button/Button';
import LOCAL_STORAGE_KEY from '@/utils/constant/localStorage';
import FinderDoctor from './FinderDoctor';
import WaitingCall from './WaitingCall';
import { PRIVATE_ROUTES } from '@/utils/constant/routes';

const FinderDepartments: FC = () => {
  const navigate = useNavigate();
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [deIdClick, setDeIdClick] = useState<string>('');
  const [isFinderDoctor, setIsFinderDoctor] = useState<any>(false);
  const isWaiting = useIsWaiting();
  const { data, isLoading } = useGetDepartments();
  const { setSearchParams, setLinkZoom } = useUserActions();

  const { sendJsonMessage, lastMessage } = useWebSocket(
    `ws://127.0.0.1:8000/booking/conversation-online/${localStorage.getItem(
      LOCAL_STORAGE_KEY.accessToken
    )}`,
    { share: true }
  );

  const handleSelectDepartment = async (id: string) => {
    setSearchParams(id);

    sendJsonMessage({
      type: 'get-doctors',
      data: {
        de_id: id
      }
    });
  };

  useEffect(() => {
    if (lastMessage?.data) {
      if (
        JSON.parse(lastMessage.data).type === 'doctor-confirm-order' &&
        JSON.parse(lastMessage.data).link_zoom
      ) {
        setLinkZoom(JSON.parse(lastMessage.data).link_zoom);
        navigate(PRIVATE_ROUTES.linkZoom);
      }
    }
  }, [lastMessage?.data, navigate, setLinkZoom]);

  useEffect(() => {
    if (lastMessage?.data) {
      if (JSON.parse(lastMessage.data).doctors) {
        setIsFinderDoctor({
          status: true,
          data: JSON.parse(lastMessage.data).doctors
        });
      }
    }
  }, [lastMessage?.data]);

  if (isLoading) {
    return <div>...loading</div>;
  }

  if (isWaiting) {
    return <WaitingCall />;
  }

  if (isFinderDoctor?.status) {
    return (
      <FinderDoctor
        sendJsonMessage={sendJsonMessage}
        doctors={isFinderDoctor.data}
      />
    );
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
        <div className='grid grid-cols-3 gap-4'>
          {data &&
            data.map((department) => (
              <div
                onClick={() => {
                  setIsShowModal(true);
                  setDeIdClick(department.deId);
                }}
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

export default FinderDepartments;
