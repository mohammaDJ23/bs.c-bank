import ListContainer from '../../layout/ListContainer';
import { DeletedUserList } from '../../lib';
import List from './List';
import { FC } from 'react';
import Navigation from '../../layout/Navigation';
import { Typography } from '@mui/material';
import { useAction, usePaginationList, useRequest } from '../../hooks';
import { ModalNames } from '../../store';
import { DeletedUsersApi } from '../../apis';

const UsersContent: FC = () => {
  const actions = useAction();
  const request = useRequest();
  const deletedUserListInstance = usePaginationList(DeletedUserList);
  const isInitialDeletedUsersApiProcessing = request.isInitialApiProcessing(DeletedUsersApi);
  const usersTotal = deletedUserListInstance.getTotal();

  const menuOptions = [
    <Typography onClick={() => actions.showModal(ModalNames.DELETED_USER_FILTERS)}>Filters</Typography>,
  ];

  return (
    <Navigation
      title={`Deleted users ${!isInitialDeletedUsersApiProcessing ? `(${usersTotal})` : ''}`}
      menuOptions={menuOptions}
    >
      <ListContainer>
        <List />
      </ListContainer>
    </Navigation>
  );
};

export default UsersContent;
