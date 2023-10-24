import DefaultContainer from '../../layout/DefaultContainer';
import { useParams } from 'react-router-dom';
import { useAction, useRequest, useSelector } from '../../hooks';
import { useEffect, FC } from 'react';
import Skeleton from './Skeleton';
import { NotificationApi } from '../../apis';
import { NotificationObj } from '../../lib';
import NotFound from './NotFound';
import Details from './Details';
import Navigation from '../../layout/Navigation';

const NotificationContent: FC = () => {
  const params = useParams();
  const { isInitialApiProcessing, request } = useRequest();
  const { setSpecificDetails } = useAction();
  const { specificDetails } = useSelector();
  const isInitialNotificationApiProcessing = isInitialApiProcessing(NotificationApi);
  const notification = specificDetails.notification;

  useEffect(() => {
    const notificationId = params.id;
    if (notificationId) {
      request<NotificationObj, number>(new NotificationApi(+notificationId).setInitialApi()).then((response) => {
        setSpecificDetails('notification', response.data);
      });
    }
  }, []);

  return (
    <Navigation>
      <DefaultContainer>
        {isInitialNotificationApiProcessing ? (
          <Skeleton />
        ) : notification ? (
          <Details notification={notification} />
        ) : (
          <NotFound />
        )}
      </DefaultContainer>
    </Navigation>
  );
};

export default NotificationContent;
