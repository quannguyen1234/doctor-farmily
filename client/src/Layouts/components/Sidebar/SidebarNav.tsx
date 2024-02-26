import {
  BoltOutline,
  HomeOutline,
  UserGroupOutline,
  ClipboardDocumentCheckOutline,
  Square2StackOutline,
  ShieldCheckOutline,
  ClockOutline
} from '@graywolfai/react-heroicons';

import { HiOutlineIdentification } from 'react-icons/hi2';

import { IoVideocamOutline } from 'react-icons/io5';

import RoleApp from '@/enums/role';
import { PRIVATE_ROUTES } from '@/utils/constant/routes';

interface ISidebarOption {
  icon: JSX.Element;
  title: string;
  role: RoleApp[];
  to: string;
}

const sidebarOptions: ISidebarOption[] = [
  {
    icon: <HomeOutline />,
    title: 'Trang chủ',
    role: [RoleApp.admin, RoleApp.docter, RoleApp.patients],
    to: PRIVATE_ROUTES.patients
  },
  {
    icon: <BoltOutline />,
    title: 'Tìm bác sĩ',
    role: [RoleApp.patients],
    to: PRIVATE_ROUTES.patientsFinder
  },
  {
    icon: <BoltOutline />,
    title: 'Khám bệnh',
    role: [RoleApp.docter],
    to: PRIVATE_ROUTES.doctorFinder
  },
  {
    icon: <ShieldCheckOutline />,
    title: 'Duyệt bác sĩ',
    role: [RoleApp.admin],
    to: PRIVATE_ROUTES.grantDoctor
  },
  {
    icon: <UserGroupOutline />,
    title: 'Quản lý bác sĩ',
    role: [RoleApp.admin],
    to: PRIVATE_ROUTES.doctorsManagement
  },
  {
    icon: <ClipboardDocumentCheckOutline />,
    title: 'Danh sách bệnh nhân',
    role: [RoleApp.admin],
    to: PRIVATE_ROUTES.patientsManagement
  },
  {
    icon: <Square2StackOutline />,
    title: 'Quản lý khoa',
    role: [RoleApp.admin],
    to: PRIVATE_ROUTES.departmenstManagement
  },
  {
    icon: <ClockOutline />,
    title: 'Lịch sử khám bệnh',
    role: [RoleApp.docter],
    to: PRIVATE_ROUTES.doctorHistory
  },
  {
    icon: <IoVideocamOutline className='text-2xl' />,
    title: 'Tư vấn trực tuyến',
    role: [RoleApp.patients],
    to: PRIVATE_ROUTES.bookingOnline
  },
  {
    icon: <HiOutlineIdentification className='text-2xl' />,
    title: 'Bác sĩ tại DF',
    role: [RoleApp.patients],
    to: PRIVATE_ROUTES.patientIntroduceDoctor
  }
];

export default sidebarOptions;
