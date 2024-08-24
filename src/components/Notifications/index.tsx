import { useAction, usePaginationList, useRequest, useSelector } from '../../hooks';
import ListContainer from '../../layout/ListContainer';
import { NotificationsApi } from '../../apis';
import List from './List';
import { FC } from 'react';
import Navigation from '../../layout/Navigation';
import { Typography } from '@mui/material';
import { ModalNames } from '../../store';
import { selectNotificationsList } from '../../store/selectors';

const NotificationsContent: FC = () => {
  const actions = useAction();
  const selectors = useSelector();
  const request = useRequest();
  const isInitialNotificationsApiProcessing = request.isInitialApiProcessing(NotificationsApi);
  const notificationsList = selectNotificationsList(selectors);

  const menuOptions = [
    <Typography onClick={() => actions.showModal(ModalNames.NOTIFICATION_FILTERS)}>Filters</Typography>,
  ];

  return (
    <Navigation
      title={`Notifications ${!isInitialNotificationsApiProcessing ? `(${notificationsList.total})` : ''}`}
      menuOptions={menuOptions}
    >
      <ListContainer>
        <List />
      </ListContainer>
    </Navigation>
  );
};

export default NotificationsContent;
