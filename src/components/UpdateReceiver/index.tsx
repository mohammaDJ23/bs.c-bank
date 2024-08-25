import FormContainer from '../../layout/FormContainer';
import Form from './Form';
import { Receiver, UpdateReceiver } from '../../lib';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import { useEffect, FC } from 'react';
import { useParams } from 'react-router-dom';
import Skeleton from './Skeleton';
import { ReceiverApi } from '../../apis';
import NotFound from './NotFound';
import Navigation from '../../layout/Navigation';

const UpdateReceiverContent: FC = () => {
  const params = useParams();
  const actions = useAction();
  const selectors = useSelector();
  const request = useRequest();
  const updateReceiverFormInstance = useForm(UpdateReceiver);
  const isInitialReceiverApiProcessing = request.isInitialApiProcessing(ReceiverApi);

  useEffect(() => {
    const receiverId = params.id;
    if (receiverId) {
      request.build<Receiver, string>(new ReceiverApi(+receiverId).setInitialApi()).then((response) => {
        actions.setSpecificDetails('receiver', response.data);
        updateReceiverFormInstance.initializeForm(
          new UpdateReceiver({
            id: response.data.id,
            name: response.data.name,
          })
        );
      });
    }
  }, []);

  return (
    <Navigation>
      <FormContainer>
        {isInitialReceiverApiProcessing ? (
          <Skeleton />
        ) : selectors.specificDetails.receiver ? (
          <Form formInstance={updateReceiverFormInstance} />
        ) : (
          <NotFound />
        )}
      </FormContainer>
    </Navigation>
  );
};

export default UpdateReceiverContent;
