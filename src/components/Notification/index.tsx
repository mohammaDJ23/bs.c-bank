import DefaultContainer from '../../layout/DefaultContainer';
import { useParams } from 'react-router-dom';
import { useAction, useRequest, useSelector } from '../../hooks';
import { useEffect, FC } from 'react';
import Skeleton from './Skeleton';
import { NotificationApi } from '../../apis';
import { Notification } from '../../lib';
import NotFound from './NotFound';
import Details from './Details';
import Navigation from '../../layout/Navigation';

const NotificationContent: FC = () => {
  const params = useParams();
  const request = useRequest();
  const actions = useAction();
  const selectors = useSelector();
  const isInitialNotificationApiProcessing = request.isInitialApiProcessing(NotificationApi);
  const notification = selectors.specificDetails.notification;

  useEffect(() => {
    const notificationId = params.id;
    if (notificationId) {
      request.build<Notification, number>(new NotificationApi(+notificationId).setInitialApi()).then((response) => {
        actions.setSpecificDetails('notification', response.data);
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
