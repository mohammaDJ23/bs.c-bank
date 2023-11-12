import { FC } from 'react';
import AllBillsContent from '../components/AllBills';
import ClearStateProvider from '../lib/providers/ClearStateProvider';
import UserRoleProtectionProvider from '../lib/providers/UserRoleProtectionProvider';
import { Pathes, UserRoles } from '../lib';

const AllBills: FC = () => {
  return (
    <UserRoleProtectionProvider path={Pathes.DASHBOARD} roles={[UserRoles.OWNER]}>
      <ClearStateProvider>
        <AllBillsContent />
      </ClearStateProvider>
    </UserRoleProtectionProvider>
  );
};

export default AllBills;
