import { useAction, useRequest, useSelector } from '../../hooks';
import ListContainer from '../../layout/ListContainer';
import List from './List';
import { FC } from 'react';
import Navigation from '../../layout/Navigation';
import { Typography } from '@mui/material';
import { ModalNames } from '../../store';
import { DeletedBillsApi } from '../../apis';
import { selectDeletedBillsList } from '../../store/selectors';

const DeletedBillListContent: FC = () => {
  const actions = useAction();
  const request = useRequest();
  const selectors = useSelector();
  const isInitialDeletedBillListApiProcessing = request.isInitialApiProcessing(DeletedBillsApi);
  const deletedBillsList = selectDeletedBillsList(selectors);

  const menuOptions = [
    <Typography onClick={() => actions.showModal(ModalNames.DELETED_BILL_FILTERS)}>Filters</Typography>,
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
