import { FC } from 'react';
import NotificationsContent from '../components/Notifications';
import ClearStateProvider from '../lib/providers/ClearStateProvider';
import UserRoleProtectionProvider from '../lib/providers/UserRoleProtectionProvider';
import { Pathes, UserRoles } from '../lib';

const Notifications: FC = () => {
  return (
    <UserRoleProtectionProvider path={Pathes.DASHBOARD} roles={[UserRoles.OWNER]}>
      <ClearStateProvider>
        <NotificationsContent />
      </ClearStateProvider>
    </UserRoleProtectionProvider>
  );
};

export default Notifications;
