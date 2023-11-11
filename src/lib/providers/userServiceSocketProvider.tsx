import { Fragment, useEffect, FC, PropsWithChildren } from 'react';
import { getUserServiceSocket } from '../utilFunctions';
import { useAction, useAuth, useSelector } from '../../hooks';
import { UserRoles, UserStatus, onLogoutEvent } from '../auth';
import { UsersStatusType } from '../../store';
import { LocalStorage } from '../storage';
import { useNavigate } from 'react-router-dom';
import { Pathes } from '../routes';

interface LogoutUserObj extends UserStatus {}

const UserServiceSocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const selectors = useSelector();
  const actions = useAction();
  const auth = useAuth();
  const decodedToken = auth.getDecodedToken()!;
  const navigate = useNavigate();

  useEffect(() => {
    const socket = getUserServiceSocket();
    actions.setUserServiceSocket(socket);
  }, []);

  useEffect(() => {
    if (selectors.userServiceSocket) {
      if (decodedToken.role === UserRoles.OWNER) {
        selectors.userServiceSocket.emit('users_status');
        selectors.userServiceSocket.on('users_status', (data: UsersStatusType) => {
          actions.setSpecificDetails('usersStatus', data);
        });
      }
    }
  }, [selectors.userServiceSocket]);

  useEffect(() => {
    if (selectors.userServiceSocket) {
      selectors.userServiceSocket.on('logout_user', (data: LogoutUserObj) => {
        if (auth.isUserEqualToCurrentUser(data.id)) {
          onLogoutEvent();
          LocalStorage.clear();
          navigate(Pathes.LOGIN);
        }
      });
    }
  }, [selectors.userServiceSocket]);

  return <Fragment>{children}</Fragment>;
};

export default UserServiceSocketProvider;
