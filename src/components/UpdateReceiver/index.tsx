import FormContainer from '../../layout/FormContainer';
import Form from './Form';
import { UpdateReceiver } from '../../lib';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import { useEffect, FC } from 'react';
import { useParams } from 'react-router-dom';
import Skeleton from './Skeleton';
import { ReceiverApi } from '../../apis';
import NotFound from './NotFound';
import Navigation from '../../layout/Navigation';
import { useSnackbar } from 'notistack';

const UpdateReceiverContent: FC = () => {
  const params = useParams();
  const actions = useAction();
  const selectors = useSelector();
  const request = useRequest();
  const snackbar = useSnackbar();
  const updateReceiverFormInstance = useForm(UpdateReceiver);
  const isInitialReceiverApiProcessing = request.isInitialApiProcessing(ReceiverApi);
  const isInitialReceiverApiFailed = request.isInitialProcessingApiFailed(ReceiverApi);
  const isInitialReceiverApiSuccessed = request.isInitialProcessingApiSuccessed(ReceiverApi);
  const initialReceiverExceptionMessage = request.getInitialExceptionMessage(ReceiverApi);
  const receiver = selectors.specificDetails.receiver;

  useEffect(() => {
    const id = params.id;
    if (id) {
      actions.getInitialReceiver(+id);
    }
  }, []);

  useEffect(() => {
    if (isInitialReceiverApiSuccessed && receiver) {
      updateReceiverFormInstance.initializeForm(
        new UpdateReceiver({
          id: receiver.id,
          name: receiver.name,
        })
      );
    } else if (isInitialReceiverApiFailed && !receiver) {
      snackbar.enqueueSnackbar({ message: initialReceiverExceptionMessage, variant: 'error' });
    }
  }, [isInitialReceiverApiSuccessed, isInitialReceiverApiFailed, receiver]);

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
