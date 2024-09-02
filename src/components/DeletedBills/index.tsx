import { useAction, useRequest, useSelector } from '../../hooks';
import ListContainer from '../../layout/ListContainer';
import List from './List';
import { FC } from 'react';
import Navigation from '../../layout/Navigation';
import { Typography } from '@mui/material';
import { ModalNames } from '../../store';
import { DeletedBillsApi } from '../../apis';
import { selectDeletedBillsList } from '../../store/selectors';
import { wait } from '../../lib';

const DeletedBillListContent: FC = () => {
  const actions = useAction();
  const request = useRequest();
  const selectors = useSelector();
  const isInitialDeletedBillListApiProcessing = request.isInitialApiProcessing(DeletedBillsApi);
  const deletedBillsList = selectDeletedBillsList(selectors);

  const menuOptions = [
    <Typography
      onClick={async () => {
        actions.showModal(ModalNames.DELETED_BILL_FILTERS);
        await wait();
        const searchEl = document.getElementById('_bank-service-deleted-bill-filters-form-search');
        if (searchEl) {
          searchEl.focus();
        }
      }}
    >
      Filters
    </Typography>,
  ];

  return (
    <Navigation
      title={`Deleted bills ${!isInitialDeletedBillListApiProcessing ? `(${deletedBillsList.total})` : ''}`}
      menuOptions={menuOptions}
    >
      <ListContainer>
        <List />
      </ListContainer>
    </Navigation>
  );
};

export default DeletedBillListContent;
