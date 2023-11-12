import { FC } from 'react';
import UsersContent from '../components/Users';
import { useAuth } from '../hooks';
import ClearStateProvider from '../lib/providers/ClearStateProvider';
import { getDynamicPath, Pathes, UserRoles } from '../lib';
import UserRoleProtectionProvider from '../lib/providers/UserRoleProtectionProvider';

const Users: FC = () => {
  const auth = useAuth();
  const decodedToken = auth.getDecodedToken()!;
  const path = getDynamicPath(Pathes.USER, { id: decodedToken.id });

  return (
    <UserRoleProtectionProvider path={path} roles={[UserRoles.OWNER, UserRoles.ADMIN]}>
      <ClearStateProvider>
        <UsersContent />
      </ClearStateProvider>
    </UserRoleProtectionProvider>
  );
};

export default Users;
