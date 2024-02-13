import { Fragment, useEffect, FC, PropsWithChildren } from 'react';
import { getUserServiceConnectionSocket } from '../utilFunctions';
import { useAction } from '../../hooks';

const UserServiceConnectionSocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const actions = useAction();

  useEffect(() => {
    const socket = getUserServiceConnectionSocket();
    socket.on('connect_error', (err: Error) => {
      console.log(err);
    });
    actions.setUserServiceConnectionSocket(socket);
  }, []);

  return <Fragment>{children}</Fragment>;
};

export default UserServiceConnectionSocketProvider;
