import { Typography } from '@mui/material';
import { useAction, usePaginationList, useRequest } from '../../hooks';
import ListContainer from '../../layout/ListContainer';
import Navigation from '../../layout/Navigation';
import { ModalNames } from '../../store';
import { ConsumerList } from '../../lib';
import { ConsumersApi } from '../../apis';
import List from './List';

const ConsumersContent = () => {
  const actions = useAction();
  const request = useRequest();
  const consumerListInstance = usePaginationList(ConsumerList);
  const isInitialConsumersApiProcessing = request.isInitialApiProcessing(ConsumersApi);
  const consumersTotal = consumerListInstance.getTotal();

  const menuOptions = [<Typography onClick={() => actions.showModal(ModalNames.CONSUMER_FILTERS)}>Filters</Typography>];

  return (
    <Navigation
      title={`Consumers ${!isInitialConsumersApiProcessing ? `(${consumersTotal})` : ''}`}
      menuOptions={menuOptions}
    >
      <ListContainer>
        <List />
      </ListContainer>
    </Navigation>
  );
};

export default ConsumersContent;
