import { useAction, useRequest, useSelector } from '../../hooks';
import ListContainer from '../../layout/ListContainer';
import { AllBillsApi } from '../../apis';
import List from './List';
import { FC } from 'react';
import Navigation from '../../layout/Navigation';
import { Typography } from '@mui/material';
import { ModalNames } from '../../store';
import { selectAllBillsList } from '../../store/selectors';

const AllBillsContent: FC = () => {
  const selectors = useSelector();
  const actions = useAction();
  const request = useRequest();
  const isInitialAllBillsApiProcessing = request.isInitialApiProcessing(AllBillsApi);
  const allBillsList = selectAllBillsList(selectors);

  const menuOptions = [<Typography onClick={() => actions.showModal(ModalNames.ALL_BILL_FILTERS)}>Filters</Typography>];

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
