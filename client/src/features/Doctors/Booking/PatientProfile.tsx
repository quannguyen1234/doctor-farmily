import { FC, useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import classNames from 'classnames/bind';
import useWebSocket from 'react-use-websocket';

import Modal from '@/components/Modal/Modal';
import formDetailSchema from '../Validations/formDetailSchema';
import InputValidations from '@/components/Input/InputValidation';
import styles from './ModalMedicalRecord.module.scss';
import { useGetPatientById } from '@/apis/user.api';
import { useAddMedicalRecord } from '../apis/doctor.api';
import LOCAL_STORAGE_KEY from '@/utils/constant/localStorage';
import ModalMedicalRecord from '../components/ModalMedicalRecord';

const cx = classNames.bind(styles);

interface PatientProfileProps {
  patientId: string;
}

const initialValues = {
  symptom: '',
  condition: '',
  diagnosis: '',
  treatmentPlan: ''
};

const PatientProfile: FC<PatientProfileProps> = ({ patientId }) => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [isModalMedicalRecord, setIsModalMedicalRecord] =
    useState<boolean>(false);
  const [prescriptions, setPrescriptions] = useState<
    {
      medicineName: string;
      note: string;
    }[]
  >([
    {
      medicineName: '',
      note: ''
    }
  ]);

  const { data: patientData, isLoading } = useGetPatientById(patientId);
  const { mutate, data: addMedicalRecordData } = useAddMedicalRecord();

  const { sendJsonMessage } = useWebSocket(
    `ws://127.0.0.1:8000/booking/conversation/${localStorage.getItem(
      LOCAL_STORAGE_KEY.accessToken
    )}`,
    { share: true }
  );

  const handleSuccessful = () => {
    sendJsonMessage({
      type: 'doctor-finish-order'
    });

    window.location.reload();
  };

  const handleSubmit = (values: typeof initialValues) => {
    mutate({ patientId, ...values, prescriptions });
  };

  useEffect(() => {
    if (addMedicalRecordData?.flag) {
      setIsShow(false);
      setIsAdded(true);
    }
  }, [addMedicalRecordData]);

  const handleAddPrescriptions = () => {
    setPrescriptions((prev) => [
      ...prev,
      {
        medicineName: '',
        note: ''
      }
    ]);
  };

  const handleChangePrescriptions = (
    event:
      | React.FormEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const data = [...prescriptions];
    data[index][event.target.name] = event.target.value;
    setPrescriptions(data);
  };

  const handleRemovePrescriptions = (indexRemove: number) => {
    setPrescriptions((prev) =>
      prev.filter((_, index) => index !== indexRemove)
    );
  };

  if (isLoading) {
    return <div>Loading......</div>;
  }

  return (
    <>
      <Modal isShow={isShow} titleHeader='Nhập hồ sơ bệnh án'>
        <Formik
          initialValues={initialValues}
          validationSchema={formDetailSchema}
          onSubmit={(values) => handleSubmit(values)}
        >
          <Form className='w-96'>
            <div className={`${cx('form')} overflow-y-auto`}>
              <InputValidations
                label='Triệu chứng'
                id='symptom'
                name='symptom'
                type='text'
                placeholder='Nhập triệu chứng của bệnh nhân'
              />
              <InputValidations
                label='Tình trạng'
                id='condition'
                name='condition'
                type='text'
                placeholder='Nhập tình trạng của bệnh nhân'
              />
              <InputValidations
                label='Chẩn đoán'
                id='diagnosis'
                name='diagnosis'
                type='text'
                placeholder='Nhập chẩn đoán bệnh'
              />
              <InputValidations
                label='Phác đồ điều trị'
                id='treatmentPlan'
                name='treatmentPlan'
                type='text'
                placeholder='Nhập phác đồ điều trị'
              />
              <div className='border mt-3 p-2 rounded-xl'>
                <h4 className='font-bold'>Nhập thuốc điều trị</h4>
                {prescriptions.map((item, index) => {
                  return (
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={index}>
                      <div className='relative flex gap-2 flex-col mb-4'>
                        <div className='flex flex-col'>
                          <label className='font-semibold mb-1'>
                            Tên thuốc
                          </label>
                          <input
                            className='py-2 border px-2 rounded-3xl'
                            name='medicineName'
                            value={item.medicineName}
                            type='text'
                            placeholder='Nhập tên thuốc'
                            onChange={(event) =>
                              handleChangePrescriptions(event, index)
                            }
                          />
                        </div>
                        <div className='flex flex-col'>
                          <label className='font-semibold mb-1'>Ghi chú</label>
                          <textarea
                            name='note'
                            className='py-2 border px-2 rounded-3xl'
                            value={item.note}
                            placeholder='Ghi chú'
                            onChange={(event) =>
                              handleChangePrescriptions(event, index)
                            }
                          />
                        </div>
                      </div>

                      <div className='flex gap-2'>
                        <button
                          onClick={handleAddPrescriptions}
                          className='ring-gray-200 ring-2 rounded-sm px-4 py-1 mb-3 font-semibold text-lg hover:bg-gray-300'
                        >
                          Thêm
                        </button>
                        {index !== 0 && (
                          <button
                            onClick={() => handleRemovePrescriptions(index)}
                            className='ring-gray-200 ring-2 rounded-sm px-4 py-1 mb-3 font-semibold text-lg hover:bg-gray-300'
                          >
                            Xóa
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className='flex gap-2 mt-6'>
              <button
                type='submit'
                className='text-white ring-2 ring-primary bg-primary rounded-full px-4 py-2 mb-3 font-semibold text-lg hover:opacity-90'
              >
                Xác nhận
              </button>
              <button
                onClick={() => setIsShow(false)}
                className='ttext-slate-300 ring-2 bg-white ring-gray-300 rounded-full px-4 py-2 mb-3 font-semibold text-lg hover:bg-gray-50'
              >
                Hủy bỏ
              </button>
            </div>
          </Form>
        </Formik>
      </Modal>

      <div className='p-4'>
        {patientData && (
          <div>
            <div className='flex items-center w-full px-6 mb-10'>
              <div className='w-20'>
                <img
                  className='w-full rounded-full'
                  src={
                    patientData.baseUser.avatar
                      ? patientData.baseUser.avatar
                      : 'https://user-images.githubusercontent.com/5709133/50445980-88299a80-0912-11e9-962a-6fd92fd18027.png'
                  }
                  alt='avatar-bac-si'
                />
              </div>
              <div className='pl-3'>
                <h4>
                  <span className='font-semibold mr-1'>Tên:</span>
                  {patientData.baseUser.fullName}
                </h4>
                <div className='text-sm'>
                  <span className='font-semibold mr-1'>SDT:</span>
                  {patientData.baseUser.phoneNumber}
                </div>
                <div className='text-sm'>
                  <span className='font-semibold mr-1'>Email:</span>
                  {patientData.baseUser.email}
                </div>
                <div className='text-sm'>
                  <span className='font-semibold mr-1'>Ngày sinh:</span>
                  {patientData.baseUser.birthDay}
                </div>
              </div>
            </div>
          </div>
        )}

        {patientId && (
          <Modal className='h-[80vh]' isShow={isModalMedicalRecord}>
            <ModalMedicalRecord patientId={patientId} />
            <button
              className='mb-10 min-w-[120px] text-slate-300 ring-2 bg-white ring-gray-300 rounded-full px-4 py-2 font-semibold text-lg hover:bg-gray-50'
              onClick={() => setIsModalMedicalRecord(false)}
            >
              Tắt
            </button>
          </Modal>
        )}

        <div className='flex justify-center gap-2'>
          {isAdded ? (
            <button
              onClick={() => {
                handleSuccessful();
              }}
              className='text-white ring-2 ring-primary bg-primary rounded-full px-4 py-2 mb-3 font-semibold text-lg hover:opacity-90'
            >
              Hoàn thành
            </button>
          ) : (
            <button
              onClick={() => setIsShow(true)}
              className='text-white ring-2 ring-primary bg-primary rounded-full px-4 py-2 mb-3 font-semibold text-lg hover:opacity-90'
            >
              Nhập bệnh án
            </button>
          )}

          <button
            onClick={() => setIsModalMedicalRecord(true)}
            className='ring-gray-300 ring-2 rounded-full px-4 py-2 mb-3 font-semibold text-lg hover:opacity-90'
          >
            Xem bệnh án
          </button>
        </div>
      </div>
    </>
  );
};

export default PatientProfile;
