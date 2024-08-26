import FormContainer from '../../layout/FormContainer';
import Form from './Form';
import { UpdateConsumer } from '../../lib';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import { useEffect, FC } from 'react';
import { useParams } from 'react-router-dom';
import Skeleton from './Skeleton';
import { ConsumerApi } from '../../apis';
import NotFound from './NotFound';
import Navigation from '../../layout/Navigation';
import { useSnackbar } from 'notistack';

const UpdateConsumerContent: FC = () => {
  const params = useParams();
  const actions = useAction();
  const selectors = useSelector();
  const request = useRequest();
  const snackbar = useSnackbar();
  const updateConsumerFormInstance = useForm(UpdateConsumer);
  const isInitialConsumerApiProcessing = request.isInitialApiProcessing(ConsumerApi);
  const isInitialConsumerApiFailed = request.isInitialProcessingApiFailed(ConsumerApi);
  const isInitialConsumerApiSuccessed = request.isInitialProcessingApiSuccessed(ConsumerApi);
  const initialConsumerApiExceptionMessage = request.getInitialExceptionMessage(ConsumerApi);
  const consumer = selectors.specificDetails.consumer;

  useEffect(() => {
    const id = params.id;
    if (id) {
      actions.getInitialConsumer(+id);
    }
  }, []);

  useEffect(() => {
    if (isInitialConsumerApiSuccessed && consumer) {
      updateConsumerFormInstance.initializeForm(
        new UpdateConsumer({
          id: consumer.id,
          name: consumer.name,
        })
      );
    } else if (isInitialConsumerApiFailed && !consumer) {
      snackbar.enqueueSnackbar({ message: initialConsumerApiExceptionMessage, variant: 'error' });
    }
  }, [isInitialConsumerApiFailed, isInitialConsumerApiSuccessed, consumer]);

  return (
    <Navigation>
      <FormContainer>
        {isInitialConsumerApiProcessing ? (
          <Skeleton />
        ) : selectors.specificDetails.consumer ? (
          <Form formInstance={updateConsumerFormInstance} />
        ) : (
          <NotFound />
        )}
      </FormContainer>
    </Navigation>
  );
};

export default UpdateConsumerContent;
