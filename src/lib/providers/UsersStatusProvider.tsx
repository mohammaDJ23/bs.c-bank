import { FC, Fragment, PropsWithChildren, useEffect } from 'react';
import { useAction } from '../../hooks';
import { getUserServiceSocket } from '../utilFunctions';

const UsersStatusProvider: FC<PropsWithChildren> = ({ children }) => {
  const { setSpecificDetails } = useAction();

  useEffect(() => {
    const socket = getUserServiceSocket();
    socket.emit('users_status');
    socket.on('users_status', (data) => {
      setSpecificDetails('usersStatus', data);
    });
    return () => {
      socket.removeListener('users_status');
    };
  }, []);

  return <Fragment>{children}</Fragment>;
};

export default UsersStatusProvider;
