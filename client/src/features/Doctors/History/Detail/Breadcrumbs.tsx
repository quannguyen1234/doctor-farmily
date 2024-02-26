import { ClockOutline } from '@graywolfai/react-heroicons';
import { FC } from 'react';

import BreadcrumnsMenu from '@/components/Breadcrumbs/BreadcrumbsMenu';
import BreadcrumnsItem from '@/components/Breadcrumbs/BreadcrumnsItem';
import { PRIVATE_ROUTES } from '@/utils/constant/routes';

const Breadcrumbs: FC = () => {
  return (
    <BreadcrumnsMenu>
      <BreadcrumnsItem
        to={PRIVATE_ROUTES.doctorHistory}
        icon={<ClockOutline />}
      >
        Lịch sử khám bệnh
      </BreadcrumnsItem>

      <BreadcrumnsItem disabled>Chi tiết</BreadcrumnsItem>
    </BreadcrumnsMenu>
  );
};

export default Breadcrumbs;
