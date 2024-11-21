import ListContainer from '../../layout/ListContainer';
import { wait } from '../../lib';
import List from './List';
import { FC } from 'react';
import Navigation from '../../layout/Navigation';
import { Typography } from '@mui/material';
import { useAction, useRequest, useSelector } from '../../hooks';
import { ModalNames } from '../../store';
import { UsersApi } from '../../apis';
import { selectUsersList } from '../../store/selectors';

const UsersContent: FC = () => {
  const actions = useAction();
  const request = useRequest();
  const selectors = useSelector();
  const usersList = selectUsersList(selectors);
  const isInitialUsersApiProcessing = request.isInitialApiProcessing(UsersApi);

  const menuOptions = [
    <Typography
      onClick={async () => {
        actions.showModal(ModalNames.USER_FILTERS);
        await wait();
        const searchEl = document.getElementById('_bank-service-user-filters-form-search');
        if (searchEl) {
          searchEl.focus();
        }
      }}
    >
      Filters
    </Typography>,
  ];

  return (
    <Navigation title={`Users ${!isInitialUsersApiProcessing ? `(${usersList.total})` : ''}`} menuOptions={menuOptions}>
      <ListContainer>
        <List />
      </ListContainer>
    </Navigation>
  );
};

export default UsersContent;
