import DefaultContainer from '../../layout/DefaultContainer';
import { useParams } from 'react-router-dom';
import { useAction, useRequest, useSelector } from '../../hooks';
import { useEffect, FC } from 'react';
import Skeleton from './Skeleton';
import { ConsumerApi } from '../../apis';
import NotFound from './NotFound';
import Details from './Details';
import Navigation from '../../layout/Navigation';
import { useSnackbar } from 'notistack';

const ConsumerContent: FC = () => {
  const params = useParams();
  const request = useRequest();
  const actions = useAction();
  const selectors = useSelector();
  const { enqueueSnackbar } = useSnackbar();
  const isInitialConsumerApiFailed = request.isInitialProcessingApiFailed(ConsumerApi);
  const isInitialConsumerApiProcessing = request.isInitialApiProcessing(ConsumerApi);
  const initialConsumerApiExceptionMessage = request.getInitialExceptionMessage(ConsumerApi);
  const consumer = selectors.specificDetails.consumer;

  useEffect(() => {
    const id = params.id;
    if (id) {
      actions.getInitialConsumer(+id);
    }
  }, []);

  useEffect(() => {
    if (isInitialConsumerApiFailed) {
      enqueueSnackbar({ message: initialConsumerApiExceptionMessage, variant: 'error' });
    }
  }, [isInitialConsumerApiFailed]);

  return (
    <Navigation>
      <DefaultContainer>
        {isInitialConsumerApiProcessing ? <Skeleton /> : consumer ? <Details consumer={consumer} /> : <NotFound />}
      </DefaultContainer>
    </Navigation>
  );
};

export default ConsumerContent;
