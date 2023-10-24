import { useAction, usePaginationList, useRequest } from '../../hooks';
import ListContainer from '../../layout/ListContainer';
import { NotificationList } from '../../lib';
import { NotificationsApi } from '../../apis';
import List from './List';
import { FC } from 'react';
import Navigation from '../../layout/Navigation';
import { Typography } from '@mui/material';
import { ModalNames } from '../../store';

const NotificationsContent: FC = () => {
  const { showModal } = useAction();
  const { isInitialApiProcessing } = useRequest();
  const notificationListInstance = usePaginationList(NotificationList);
  const isInitialNotificationsApiProcessing = isInitialApiProcessing(NotificationsApi);
  const notificationsTotal = notificationListInstance.getTotal();

  const menuOptions = [<Typography onClick={() => showModal(ModalNames.NOTIFICATION_FILTERS)}>Filters</Typography>];

  return (
    <Navigation
      title={`Notifications ${!isInitialNotificationsApiProcessing ? `(${notificationsTotal})` : ''}`}
      menuOptions={menuOptions}
    >
      <ListContainer>
        <List />
      </ListContainer>
    </Navigation>
  );
};

export default NotificationsContent;
