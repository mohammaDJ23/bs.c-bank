import { Typography } from '@mui/material';
import { useAction, useRequest, useSelector } from '../../hooks';
import ListContainer from '../../layout/ListContainer';
import Navigation from '../../layout/Navigation';
import { ModalNames } from '../../store';
import { ReceiversApi } from '../../apis';
import List from './List';
import { selectReceiversList } from '../../store/selectors';
import { wait } from '../../lib';

const ReceiversContent = () => {
  const actions = useAction();
  const selectors = useSelector();
  const request = useRequest();
  const isInitialReceiversApiProcessing = request.isInitialApiProcessing(ReceiversApi);
  const receiversList = selectReceiversList(selectors);

  const menuOptions = [
    <Typography
      onClick={async () => {
        actions.showModal(ModalNames.RECEIVER_FILTERS);
        await wait();
        const searchEl = document.getElementById('_bank-service-receiver-filters-form-search');
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
      title={`Receivers ${!isInitialReceiversApiProcessing ? `(${receiversList.total})` : ''}`}
      menuOptions={menuOptions}
    >
      <ListContainer>
        <List />
      </ListContainer>
    </Navigation>
  );
};

export default ReceiversContent;
