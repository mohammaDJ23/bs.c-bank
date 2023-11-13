import { Fragment, useEffect, FC, PropsWithChildren } from 'react';
import { getUserServiceSocket } from '../utilFunctions';
import { useAction } from '../../hooks';

const UserServiceSocketConnectionProvider: FC<PropsWithChildren> = ({ children }) => {
  const actions = useAction();

  useEffect(() => {
    const socket = getUserServiceSocket();
    actions.setUserServiceSocket(socket);
  }, []);

  return <Fragment>{children}</Fragment>;
};

export default UserServiceSocketConnectionProvider;
