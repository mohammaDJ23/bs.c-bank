import { Fragment, useEffect, FC, PropsWithChildren } from 'react';
import { getUserServiceSocket } from '../utilFunctions';
import { useAction } from '../../hooks';
import { UserRoles, getTokenInfo, isUserAuthenticated } from '../auth';
import { UsersStatusType } from '../../store';

const UserServiceSocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const { setSpecificDetails, setUserServiceSocket } = useAction();

  useEffect(() => {
    if (isUserAuthenticated()) {
      const socket = getUserServiceSocket();
      setUserServiceSocket(socket);
      const userInfo = getTokenInfo()!;
      if (userInfo.role === UserRoles.OWNER) {
        socket.emit('users_status');
        socket.on('users_status', (data: UsersStatusType) => {
          setSpecificDetails('usersStatus', data);
        });
      }
    }
  }, []);

  return <Fragment>{children}</Fragment>;
};

export default UserServiceSocketProvider;
