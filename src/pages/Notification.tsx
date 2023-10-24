import { FC } from 'react';
import NotificationContent from '../components/Notification';
import ClearStateProvider from '../lib/providers/ClearStateProvider';
import UserRoleProtectionProvider from '../lib/providers/UserRoleProtectionProvider';
import { Pathes, UserRoles } from '../lib';

const Notification: FC = () => {
  return (
    <UserRoleProtectionProvider path={Pathes.DASHBOARD} roles={[UserRoles.OWNER]}>
      <ClearStateProvider>
        <NotificationContent />
      </ClearStateProvider>
    </UserRoleProtectionProvider>
  );
};

export default Notification;
