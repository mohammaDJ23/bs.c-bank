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
  const connectionSocket = selectors.userServiceSocket.connection;

  useEffect(() => {
    if (connectionSocket) {
      connectionSocket.on('logout-user', (data: UsersStatusType) => {
        if (data[decodedToken.id] && data[decodedToken.id].id === decodedToken.id) {
          LocalStorage.clear();
          connectionSocket.disconnect();
          navigate(Pathes.LOGIN);
        }
      });

      return () => {
        connectionSocket.removeListener('logout-user');
      };
    }
  }, [connectionSocket]);

  return <Fragment>{children}</Fragment>;
};

export default LogoutUserSocketEventProvider;
