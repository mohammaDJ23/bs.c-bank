import { useAction, useRequest, useSelector } from '../../hooks';
import ListContainer from '../../layout/ListContainer';
import { BillsApi } from '../../apis';
import List from './List';
import { FC } from 'react';
import Navigation from '../../layout/Navigation';
import { Typography } from '@mui/material';
import { ModalNames } from '../../store';
import { selectBillsList } from '../../store/selectors';
import { wait } from '../../lib';

const BillsContent: FC = () => {
  const selectors = useSelector();
  const actions = useAction();
  const request = useRequest();
  const isInitialBillsApiProcessing = request.isInitialApiProcessing(BillsApi);
  const billsList = selectBillsList(selectors);

  const menuOptions = [
    <Typography
      onClick={async () => {
        actions.showModal(ModalNames.BILL_FILTERS);
        await wait();
        const searchEl = document.getElementById('_bank-service-bill-filters-form-search');
        if (searchEl) {
          searchEl.focus();
        }
      }}
    >
      Filters
    </Typography>,
  ];

  return (
    <Navigation title={`Bills ${!isInitialBillsApiProcessing ? `(${billsList.total})` : ''}`} menuOptions={menuOptions}>
      <ListContainer>
        <List />
      </ListContainer>
    </Navigation>
  );
};

export default BillsContent;
