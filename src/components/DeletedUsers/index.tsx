import ListContainer from '../../layout/ListContainer';
import List from './List';
import { FC } from 'react';
import Navigation from '../../layout/Navigation';
import { Typography } from '@mui/material';
import { useAction, useRequest, useSelector } from '../../hooks';
import { ModalNames } from '../../store';
import { DeletedUsersApi } from '../../apis';
import { selectDeletedUsersList } from '../../store/selectors';

const UsersContent: FC = () => {
  const actions = useAction();
  const request = useRequest();
  const selectors = useSelector();
  const isInitialDeletedUsersApiProcessing = request.isInitialApiProcessing(DeletedUsersApi);
  const deletedUsersList = selectDeletedUsersList(selectors);

  const menuOptions = [
    <Typography onClick={() => actions.showModal(ModalNames.DELETED_USER_FILTERS)}>Filters</Typography>,
  ];

  return (
    <Navigation
      title={`Deleted users ${!isInitialDeletedUsersApiProcessing ? `(${deletedUsersList.total})` : ''}`}
      menuOptions={menuOptions}
    >
      <ListContainer>
        <List />
      </ListContainer>
    </Navigation>
  );
};

export default UsersContent;
