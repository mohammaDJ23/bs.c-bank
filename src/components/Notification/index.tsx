import DefaultContainer from '../../layout/DefaultContainer';
import { useParams } from 'react-router-dom';
import { useAction, useRequest, useSelector } from '../../hooks';
import { useEffect, FC } from 'react';
import Skeleton from './Skeleton';
import { NotificationApi } from '../../apis';
import NotFound from './NotFound';
import Details from './Details';
import Navigation from '../../layout/Navigation';
import { useSnackbar } from 'notistack';

const NotificationContent: FC = () => {
  const params = useParams();
  const request = useRequest();
  const actions = useAction();
  const selectors = useSelector();
  const snackbar = useSnackbar();
  const isInitialNotificationApiProcessing = request.isInitialApiProcessing(NotificationApi);
  const isInitialNotificationApiFailed = request.isInitialProcessingApiFailed(NotificationApi);
  const initialNotificationApiExceptionMessage = request.getInitialExceptionMessage(NotificationApi);
  const notification = selectors.specificDetails.notification;

  useEffect(() => {
    const id = params.id;
    if (id) {
      actions.getInitialNotification(+id);
    }
  }, []);

  useEffect(() => {
    if (isInitialNotificationApiFailed) {
      snackbar.enqueueSnackbar({ message: initialNotificationApiExceptionMessage, variant: 'error' });
    }
  }, [isInitialNotificationApiFailed]);

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
