import DefaultContainer from '../../layout/DefaultContainer';
import { useParams } from 'react-router-dom';
import { useAction, useRequest, useSelector } from '../../hooks';
import { useEffect, FC } from 'react';
import Skeleton from '../shared/BillSkeleton';
import { DeletedBillApi } from '../../apis';
import NotFound from './NotFound';
import Details from './Details';
import Navigation from '../../layout/Navigation';
import { useSnackbar } from 'notistack';

const DeletedBillContent: FC = () => {
  const params = useParams();
  const request = useRequest();
  const actions = useAction();
  const selectors = useSelector();
  const snackbar = useSnackbar();
  const isInitialDeletedBillApiProcessing = request.isInitialApiProcessing(DeletedBillApi);
  const isInitialDeletedBillApiFailed = request.isInitialProcessingApiFailed(DeletedBillApi);
  const initialDeletedBillExceptionMessage = request.getInitialExceptionMessage(DeletedBillApi);
  const deletedBill = selectors.specificDetails.deletedBill;

  useEffect(() => {
    const id = params.id;
    if (id) {
      actions.getInitialDeletedBill(id);
    }
  }, []);

  useEffect(() => {
    if (isInitialDeletedBillApiFailed) {
      snackbar.enqueueSnackbar({ message: initialDeletedBillExceptionMessage, variant: 'error' });
    }
  }, [isInitialDeletedBillApiFailed]);

  return (
    <Navigation>
      <DefaultContainer>
        {isInitialDeletedBillApiProcessing ? <Skeleton /> : deletedBill ? <Details bill={deletedBill} /> : <NotFound />}
      </DefaultContainer>
    </Navigation>
  );
};

export default DeletedBillContent;
