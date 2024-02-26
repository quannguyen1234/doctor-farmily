import { FC, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { useGetDoctorById } from '@/apis/user.api';
import { useDataDoctorBooking } from '../../stores/booking.store';
import { useAddRatingDoctor } from '@/apis/rating.api';

const FinishOrder: FC = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const data = useDataDoctorBooking();
  const navigate = useNavigate();

  const { data: doctorData } = useGetDoctorById(data.doctor_id);

  const { mutate, data: addRatingData } = useAddRatingDoctor();

  const handleSubmit = (values: { note: string }) => {
    mutate({
      note: values.note,
      doctorId: doctorData?.doctorId as string,
      star: rating || 5
    });
  };

  useEffect(() => {
    if (addRatingData?.flag) {
      toast.success('Đánh giá của bạn đã được gửi đi!');
      navigate('/patients/finder');
    }
  }, [addRatingData?.flag, navigate]);

  const formik = useFormik({
    initialValues: {
      note: ''
    },
    validationSchema: Yup.object({
      note: Yup.string().required('Vui lòng nhập đánh giá trước khi gửi')
    }),
    onSubmit: (values) => handleSubmit(values)
  });

  return (
    <div className='flex flex-col items-center max-h-screen'>
      <div>
        <div className='flex gap-4 mb-6'>
          <div className='w-20'>
            <img
              className='rounded-full object-cover'
              src='https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=2000'
              alt='avatar'
            />
          </div>
          <ul>
            <li>
              <span className='font-semibold pr-2'>Bác sĩ:</span>
              Nguyễn Văn Bác Sĩ
            </li>
            <li>
              <span className='font-semibold pr-2'>Ngày sinh:</span>
              23/32/32
            </li>
            <li>
              <span className='font-semibold pr-2'>Email:</span>
              hahahha@gmail.com
            </li>
          </ul>
        </div>

        <div className='w-[700px]'>
          <div className='mb-2'>
            <h4 className='font-bold'>Thêm vote:</h4>
            <div className='text-3xl'>
              {[...Array(5)].map((_, index) => {
                index += 1;
                return (
                  <button
                    type='button'
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    className={
                      index <= (hover || rating)
                        ? 'text-yellow-300'
                        : 'text-gray-300'
                    }
                    onClick={() => setRating(index)}
                    onMouseEnter={() => setHover(index)}
                    onMouseLeave={() => setHover(rating)}
                  >
                    <span className='star'>&#9733;</span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className='flex flex-col h-[70px] rounded-3xl bg-gray-100 py-2 px-4'>
              <label className='font-semibold text-sm' htmlFor='note'>
                Nhập đánh giá
              </label>
              <input
                className='bg-gray-100 focus:outline-none'
                id='note'
                name='note'
                type='text'
                onChange={formik.handleChange}
                value={formik.values.note}
                placeholder='Đánh giá bác sĩ....'
              />
            </div>
            <div className='flex justify-end gap-3'>
              <button
                type='submit'
                className='ring-2 ring-gray-200 mt-2 rounded-xl px-3 py-1 mb-3 font-semibold text-lg hover:opacity-90'
              >
                Bỏ qua
              </button>
              <button
                type='submit'
                className='text-white ring-2 mt-2 ring-primary bg-primary rounded-xl px-3 py-1 mb-3 font-semibold text-lg hover:opacity-90'
              >
                Gửi đánh giá
              </button>
            </div>
          </form>
        </div>

        <div className='mt-5 mb-10'>
          <h4 className='font-bold mb-2'>Những đánh giá khác</h4>
          <ul className='flex flex-col gap-2 overflow-auto overflow-y-auto max-h-[400px]'>
            <li className='bg-gray-100 rounded-3xl py-2 px-4'>
              <span className='font-semibold'>Họ và tên</span>
              <p>Lời đánh giá bờ lô bờ la ali baba hahahha </p>
            </li>
            <li className='bg-gray-100 rounded-3xl py-2 px-4'>
              <span className='font-semibold'>Họ và tên</span>
              <p>Lời đánh giá bờ lô bờ la ali baba hahahha </p>
            </li>
            <li className='bg-gray-100 rounded-3xl py-2 px-4'>
              <span className='font-semibold'>Họ và tên</span>
              <p>Lời đánh giá bờ lô bờ la ali baba hahahha </p>
            </li>
            <li className='bg-gray-100 rounded-3xl py-2 px-4'>
              <span className='font-semibold'>Họ và tên</span>
              <p>Lời đánh giá bờ lô bờ la ali baba hahahha </p>
            </li>
            <li className='bg-gray-100 rounded-3xl py-2 px-4'>
              <span className='font-semibold'>Họ và tên</span>
              <p>Lời đánh giá bờ lô bờ la ali baba hahahha </p>
            </li>
            <li className='bg-gray-100 rounded-3xl py-2 px-4'>
              <span className='font-semibold'>Họ và tên</span>
              <p>Lời đánh giá bờ lô bờ la ali baba hahahha </p>
            </li>
            <li className='bg-gray-100 rounded-3xl py-2 px-4'>
              <span className='font-semibold'>Họ và tên</span>
              <p>Lời đánh giá bờ lô bờ la ali baba hahahha </p>
            </li>
            <li className='bg-gray-100 rounded-3xl py-2 px-4'>
              <span className='font-semibold'>Họ và tên</span>
              <p>Lời đánh giá bờ lô bờ la ali baba hahahha </p>
            </li>
            <li className='bg-gray-100 rounded-3xl py-2 px-4'>
              <span className='font-semibold'>Họ và tên</span>
              <p>Lời đánh giá bờ lô bờ la ali baba hahahha </p>
            </li>
            <li className='bg-gray-100 rounded-3xl py-2 px-4'>
              <span className='font-semibold'>Họ và tên</span>
              <p>Lời đánh giá bờ lô bờ la ali baba hahahha </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FinishOrder;
