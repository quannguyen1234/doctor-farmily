import { lazy } from 'react';

import { IRoutes } from '@/types/routes';
import { PRIVATE_ROUTES } from '@/utils/constant/routes';
import RoleApp from '@/enums/role';
import DefaultLayout from '@/layouts/DefaultLayout/DefaultLayout';

const DoctorsManagement = lazy(
  () => import('@/features/Admin/Page/DoctorManagement')
);
const PatientsManagement = lazy(
  () => import('@/features/Admin/Page/PatientsManagement')
);
const DepartmentsManagement = lazy(
  () => import('@/features/Admin/Page/DepartmentManagement')
);

const GrantDoctor = lazy(() => import('@/features/Admin/Page/GrantDoctor'));

const PatientsHomePage = lazy(() => import('@/features/Patients/Home/Home'));

const PatientsFinder = lazy(
  () => import('@/features/Patients/Finder/pages/PatientsFinder')
);
const Finder = lazy(() => import('@/features/Patients/Finder/pages/Finder'));
const FinderDoctors = lazy(
  () => import('@/features/Patients/Finder/pages/FinderDoctors')
);
const DoctorBooking = lazy(() => import('@/features/Doctors/Booking/Booking'));

const DoctorHistory = lazy(() => import('@/features/Doctors/History'));
const DoctorHistoryDetail = lazy(
  () => import('@/features/Doctors/History/Detail')
);

const ProfilePatient = lazy(
  () => import('@/features/Users/pages/InfomationPatient/SettingProfile')
);

const ProfileDoctor = lazy(
  () => import('@/features/Users/pages/InfomationPatient/SettingProfile')
);

const Message = lazy(
  () => import('@/features/Users/pages/Message/homeChat/HomeChat')
);

const FinishOrder = lazy(
  () => import('@/features/Patients/Finder/pages/FinishOrder')
);

const FinderDepartments = lazy(
  () => import('@/features/BookingOnline/pages/FinderDepartment')
);

// const FinderDoctorOnline = lazy(
//   () => import('@/features/BookingOnline/pages/FinderDoctor')
// );

const WaitingCall = lazy(
  () => import('@/features/BookingOnline/pages/WaitingCall')
);

const IntroduceDoctor = lazy(
  () => import('@/features/Patients/IntroduceDoctor/IntroduceDoctor')
);

const DoctorProfile = lazy(
  () => import('@/features/Patients/IntroduceDoctor/DoctorProfile')
);

const JoinZoomLink = lazy(() => import('@/pages/JoinZoomLink/JoinZoomLink'));

export const privateRoutes: IRoutes[] = [
  {
    path: PRIVATE_ROUTES.patients,
    page: <PatientsHomePage />,
    title: 'User Home Page',
    layout: DefaultLayout
  },
  {
    path: PRIVATE_ROUTES.grantDoctor,
    page: <GrantDoctor />,
    title: 'Grant Doctor',
    layout: DefaultLayout
  },
  {
    path: PRIVATE_ROUTES.doctorsManagement,
    page: <DoctorsManagement />,
    title: 'Doctors Management',
    layout: DefaultLayout
  },
  {
    path: PRIVATE_ROUTES.patientsManagement,
    page: <PatientsManagement />,
    title: 'Patients Management',
    layout: DefaultLayout
  },
  {
    path: PRIVATE_ROUTES.departmenstManagement,
    page: <DepartmentsManagement />,
    title: 'Departments Management',
    layout: DefaultLayout
  },
  {
    path: PRIVATE_ROUTES.patientsFindered,
    page: <PatientsFinder />,
    title: 'Patients Finder Page',
    layout: DefaultLayout
  },
  {
    path: PRIVATE_ROUTES.patientsFinder,
    page: <Finder />,
    title: 'Finder Page',
    layout: DefaultLayout
  },
  {
    path: PRIVATE_ROUTES.patientsFinderDocter,
    page: <FinderDoctors />,
    title: 'Finder Doctors Page',
    layout: DefaultLayout
  },
  {
    path: PRIVATE_ROUTES.patientSetting,
    page: <ProfilePatient />,
    title: 'Profile Patient',
    layout: DefaultLayout,
    params: ':id',
    role: [RoleApp.patients]
  },
  {
    path: PRIVATE_ROUTES.doctorSetting,
    page: <ProfileDoctor />,
    title: 'Profile Doctor',
    layout: DefaultLayout,
    params: ':id',
    role: [RoleApp.docter]
  },
  {
    path: PRIVATE_ROUTES.message,
    page: <Message />,
    title: 'Message |  Doctor Family',
    layout: DefaultLayout
  },
  {
    path: PRIVATE_ROUTES.doctorFinder,
    page: <DoctorBooking />,
    title: 'Bệnh nhân đang kết nối',
    layout: DefaultLayout
  },
  {
    path: PRIVATE_ROUTES.doctorHistory,
    page: <DoctorHistory />,
    title: 'Lịch sử khám bệnh',
    layout: DefaultLayout
  },
  {
    path: PRIVATE_ROUTES.doctorHistoryDetail,
    page: <DoctorHistoryDetail />,
    title: 'Lịch sử khám bệnh chi tiết',
    layout: DefaultLayout
  },
  {
    path: PRIVATE_ROUTES.rating,
    page: <FinishOrder />,
    title: 'Đánh giá bác sĩ',
    layout: DefaultLayout
  },
  {
    page: <FinderDepartments />,
    title: 'Tìm kiếm khoa',
    path: PRIVATE_ROUTES.bookingOnline
  },
  {
    page: <WaitingCall />,
    title: 'Chờ cuộc gọi',
    path: PRIVATE_ROUTES.bookingOnlineWaiting
  },
  // {
  //   page: <FinderDoctorOnline />,
  //   title: 'Danh sách bác sĩ',
  //   path: PRIVATE_ROUTES.bookingOnlineFinderDoctor
  // }
  {
    page: <IntroduceDoctor />,
    title: 'Giới thiệu bác sĩ tại Doctor Family',
    path: PRIVATE_ROUTES.patientIntroduceDoctor
  },
  {
    page: <DoctorProfile />,
    title: 'Thông tin chi tiết của bác sĩ',
    path: PRIVATE_ROUTES.doctorProfile,
    params: ':id'
  },
  {
    page: <JoinZoomLink />,
    title: 'Thông tin chi tiết của bác sĩ',
    path: PRIVATE_ROUTES.linkZoom
  }
];
