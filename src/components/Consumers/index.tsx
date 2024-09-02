import { Typography } from '@mui/material';
import { useAction, useRequest, useSelector } from '../../hooks';
import ListContainer from '../../layout/ListContainer';
import Navigation from '../../layout/Navigation';
import { ModalNames } from '../../store';
import { ConsumersApi } from '../../apis';
import List from './List';
import { selectConsumersList } from '../../store/selectors';
import { wait } from '../../lib';

const ConsumersContent = () => {
  const actions = useAction();
  const request = useRequest();
  const selectors = useSelector();
  const isInitialConsumersApiProcessing = request.isInitialApiProcessing(ConsumersApi);
  const consumersList = selectConsumersList(selectors);

  const menuOptions = [
    <Typography
      onClick={async () => {
        actions.showModal(ModalNames.CONSUMER_FILTERS);
        await wait();
        const searchEl = document.getElementById('_bank-service-consumer-filters-form-search');
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
      title={`Consumers ${!isInitialConsumersApiProcessing ? `(${consumersList.total})` : ''}`}
      menuOptions={menuOptions}
    >
      <ListContainer>
        <List />
      </ListContainer>
    </Navigation>
  );
};

export default ConsumersContent;
