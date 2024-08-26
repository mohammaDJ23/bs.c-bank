import FormContainer from '../../layout/FormContainer';
import Form from './Form';
import { UpdateBill } from '../../lib';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import { useEffect, FC } from 'react';
import { useParams } from 'react-router-dom';
import Skeleton from './Skeleton';
import { BillApi } from '../../apis';
import NotFound from './NotFound';
import Navigation from '../../layout/Navigation';
import { useSnackbar } from 'notistack';

const UpdateBillContent: FC = () => {
  const params = useParams();
  const actions = useAction();
  const selectors = useSelector();
  const request = useRequest();
  const snackbar = useSnackbar();
  const updateBillFormInstance = useForm(UpdateBill);
  const isInitialBillApiProcessing = request.isInitialApiProcessing(BillApi);
  const isInitialBillApiFailed = request.isInitialProcessingApiFailed(BillApi);
  const isInitialBillApiSuccessed = request.isInitialProcessingApiSuccessed(BillApi);
  const initialBillApiExceptionMessage = request.getInitialExceptionMessage(BillApi);
  const bill = selectors.specificDetails.bill;

  useEffect(() => {
    const id = params.id;
    if (id) {
      actions.getInitialBill(id);
    }
  }, []);

  useEffect(() => {
    if (isInitialBillApiSuccessed && bill) {
      updateBillFormInstance.initializeForm(
        new UpdateBill({
          id: bill.id,
          amount: bill.amount,
          receiver: bill.receiver.name,
          location: bill.location.name,
          consumers: bill.consumers.map((consumer) => consumer.name),
          description: bill.description,
          date: bill.date,
        })
      );
    } else if (isInitialBillApiFailed && !bill) {
      snackbar.enqueueSnackbar({ message: initialBillApiExceptionMessage, variant: 'error' });
    }
  }, [isInitialBillApiFailed, isInitialBillApiSuccessed, bill]);

  return (
    <Navigation>
      <FormContainer>
        {isInitialBillApiProcessing ? (
          <Skeleton />
        ) : selectors.specificDetails.bill ? (
          <Form formInstance={updateBillFormInstance} />
        ) : (
          <NotFound />
        )}
      </FormContainer>
    </Navigation>
  );
};

export default UpdateBillContent;
