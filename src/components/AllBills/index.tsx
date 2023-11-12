import { useAction, usePaginationList, useRequest } from '../../hooks';
import ListContainer from '../../layout/ListContainer';
import { AllBillList } from '../../lib';
import { AllBillsApi } from '../../apis';
import List from './List';
import { FC } from 'react';
import Navigation from '../../layout/Navigation';
import { Typography } from '@mui/material';
import { ModalNames } from '../../store';

const AllBillsContent: FC = () => {
  const actions = useAction();
  const request = useRequest();
  const allBillListInstance = usePaginationList(AllBillList);
  const isInitialAllBillsApiProcessing = request.isInitialApiProcessing(AllBillsApi);
  const billsTotal = allBillListInstance.getTotal();

  const menuOptions = [<Typography onClick={() => actions.showModal(ModalNames.ALL_BILL_FILTERS)}>Filters</Typography>];

  return (
    <Navigation title={`Bills ${!isInitialAllBillsApiProcessing ? `(${billsTotal})` : ''}`} menuOptions={menuOptions}>
      <ListContainer>
        <List />
      </ListContainer>
    </Navigation>
  );
};

export default AllBillsContent;
