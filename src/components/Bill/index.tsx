import DefaultContainer from '../../layout/DefaultContainer';
import { useParams } from 'react-router-dom';
import { useAction, useRequest, useSelector } from '../../hooks';
import { useEffect, FC } from 'react';
import Skeleton from './Skeleton';
import { BillApi } from '../../apis';
import NotFound from './NotFound';
import Details from './Details';
import Navigation from '../../layout/Navigation';
import { useSnackbar } from 'notistack';

const BillContent: FC = () => {
  const params = useParams();
  const request = useRequest();
  const actions = useAction();
  const selectors = useSelector();
  const snackbar = useSnackbar();
  const isInitialBillApiFailed = request.isInitialProcessingApiFailed(BillApi);
  const initialBillApiExceptionMessage = request.getInitialExceptionMessage(BillApi);
  const isInitialBillApiProcessing = request.isInitialApiProcessing(BillApi);
  const bill = selectors.specificDetails.bill;

  useEffect(() => {
    const id = params.id;
    if (id) {
      actions.getInitialBill(id);
    }
  }, []);

  useEffect(() => {
    if (isInitialBillApiFailed) {
      snackbar.enqueueSnackbar({ message: initialBillApiExceptionMessage, variant: 'error' });
    }
  }, [isInitialBillApiFailed]);

  return (
    <Navigation>
      <DefaultContainer>
        {isInitialBillApiProcessing ? <Skeleton /> : bill ? <Details bill={bill} /> : <NotFound />}
      </DefaultContainer>
    </Navigation>
  );
};

export default BillContent;
