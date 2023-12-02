import { Fragment, FC, PropsWithChildren, useEffect } from 'react';
import { useAuth, useSelector } from '../../hooks';
import { UsersStatusType } from '../../store';
import { LocalStorage } from '../storage';
import { useNavigate } from 'react-router-dom';
import { Pathes } from '../routes';

const LogoutUserSocketEventProvider: FC<PropsWithChildren> = ({ children }) => {
  const selectors = useSelector();
  const auth = useAuth();
  const navigate = useNavigate();
  const decodedToken = auth.getDecodedToken()!;

  useEffect(() => {
    if (selectors.userServiceSocket.connection) {
      selectors.userServiceSocket.connection.on('logout-user', (data: UsersStatusType) => {
        if (data[decodedToken.id] && data[decodedToken.id].id === decodedToken.id) {
          LocalStorage.clear();
          selectors.userServiceSocket.connection!.disconnect();
          navigate(Pathes.LOGIN);
        }
      });

      return () => {
        selectors.userServiceSocket.connection!.removeListener('logout-user');
      };
    }
  }, [selectors.userServiceSocket.connection]);

  return <Fragment>{children}</Fragment>;
};

export default LogoutUserSocketEventProvider;
