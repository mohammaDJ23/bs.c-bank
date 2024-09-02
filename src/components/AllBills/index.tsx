import { useAction, useRequest, useSelector } from '../../hooks';
import ListContainer from '../../layout/ListContainer';
import { AllBillsApi } from '../../apis';
import List from './List';
import { FC } from 'react';
import Navigation from '../../layout/Navigation';
import { Typography } from '@mui/material';
import { ModalNames } from '../../store';
import { selectAllBillsList } from '../../store/selectors';
import { wait } from '../../lib';

const AllBillsContent: FC = () => {
  const selectors = useSelector();
  const actions = useAction();
  const request = useRequest();
  const isInitialAllBillsApiProcessing = request.isInitialApiProcessing(AllBillsApi);
  const allBillsList = selectAllBillsList(selectors);

  const menuOptions = [
    <Typography
      onClick={async () => {
        actions.showModal(ModalNames.ALL_BILL_FILTERS);
        await wait();
        const searchEl = document.getElementById('_bank-service-all-bill-filters-form-search');
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
      title={`All Bills ${!isInitialAllBillsApiProcessing ? `(${allBillsList.total})` : ''}`}
      menuOptions={menuOptions}
    >
      <ListContainer>
        <List />
      </ListContainer>
    </Navigation>
  );
};

export default AllBillsContent;
