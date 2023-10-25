import { FC, Fragment, PropsWithChildren, useEffect } from 'react';
import { useAction } from '../../hooks';
import { UsersStatusType } from '../../store';

const UsersStatusProvider: FC<PropsWithChildren> = ({ children }) => {
  const { setSpecificDetails } = useAction();

  useEffect(() => {
    // @ts-ignore
    window.addEventListener('users-status', (event: CustomEvent<UsersStatusType>) => {
      setSpecificDetails('usersStatus', event.detail);
    });
  }, []);

  return <Fragment>{children}</Fragment>;
};

export default UsersStatusProvider;
