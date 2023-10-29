import { Fragment, useEffect, FC, PropsWithChildren } from 'react';
import { getUserServiceSocket } from '../utilFunctions';
import { useAction, useAuth, useSelector } from '../../hooks';
import { UserRoles, UserStatus, getTokenInfo, onLogoutEvent } from '../auth';
import { UsersStatusType } from '../../store';
import { LocalStorage } from '../storage';
import { useNavigate } from 'react-router-dom';
import { Pathes } from '../routes';

interface LogoutUserObj extends UserStatus {}

const UserServiceSocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const { userServiceSocket } = useSelector();
  const { setSpecificDetails, setUserServiceSocket } = useAction();
  const { isSameUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const socket = getUserServiceSocket();
    setUserServiceSocket(socket);
  }, []);

  useEffect(() => {
    if (userServiceSocket) {
      const userInfo = getTokenInfo()!;
      if (userInfo.role === UserRoles.OWNER) {
        userServiceSocket.emit('users_status');
        userServiceSocket.on('users_status', (data: UsersStatusType) => {
          console.log(data);
          setSpecificDetails('usersStatus', data);
        });
      }
    }
  }, [userServiceSocket]);

  useEffect(() => {
    if (userServiceSocket) {
      userServiceSocket.on('logout_user', (data: LogoutUserObj) => {
        if (isSameUser(data.id)) {
          onLogoutEvent();
          LocalStorage.clear();
          navigate(Pathes.LOGIN);
        }
      });
    }
  }, [userServiceSocket]);

  return <Fragment>{children}</Fragment>;
};

export default UserServiceSocketProvider;
