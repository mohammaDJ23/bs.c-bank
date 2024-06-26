import FormContainer from '../../layout/FormContainer';
import Form from './Form';
import { BillObj, UpdateBill } from '../../lib';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import { useEffect, FC } from 'react';
import { useParams } from 'react-router-dom';
import Skeleton from './Skeleton';
import { BillApi } from '../../apis';
import NotFound from './NotFound';
import Navigation from '../../layout/Navigation';

const UpdateBillContent: FC = () => {
  const params = useParams();
  const actions = useAction();
  const selectors = useSelector();
  const request = useRequest();
  const updateBillFormInstance = useForm(UpdateBill);
  const isInitialBillApiProcessing = request.isInitialApiProcessing(BillApi);

  useEffect(() => {
    const billId = params.id;
    if (billId) {
      request.build<BillObj, string>(new BillApi(billId).setInitialApi()).then((response) => {
        actions.setSpecificDetails('bill', response.data);
        updateBillFormInstance.initializeForm(
          new UpdateBill({
            id: response.data.id,
            amount: response.data.amount,
            receiver: response.data.receiver.name,
            location: response.data.location.name,
            consumers: response.data.consumers.map((consumer) => consumer.name),
            description: response.data.description,
            date: response.data.date,
          })
        );
      });
    }
  }, []);

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
