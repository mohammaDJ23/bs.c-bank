import DefaultContainer from '../../layout/DefaultContainer';
import { useParams } from 'react-router-dom';
import { useAction, useRequest, useSelector } from '../../hooks';
import { useEffect, FC } from 'react';
import Skeleton from './Skeleton';
import { ReceiverApi } from '../../apis';
import { Receiver } from '../../lib';
import NotFound from './NotFound';
import Details from './Details';
import Navigation from '../../layout/Navigation';
import { useSnackbar } from 'notistack';

const ReceiverContent: FC = () => {
  const params = useParams();
  const request = useRequest();
  const actions = useAction();
  const selectors = useSelector();
  const snackbar = useSnackbar();
  const isInitialReceiverApiProcessing = request.isInitialApiProcessing(ReceiverApi);
  const isInitialReceiverApiFailed = request.isInitialProcessingApiFailed(ReceiverApi);
  const initialReceiverApiExceptionMessage = request.getInitialExceptionMessage(ReceiverApi);
  const receiver = selectors.specificDetails.receiver;

  useEffect(() => {
    const id = params.id;
    if (id) {
      actions.getInitialReceiver(+id);
    }
  }, []);

  useEffect(() => {
    if (isInitialReceiverApiFailed) {
      snackbar.enqueueSnackbar({ message: initialReceiverApiExceptionMessage, variant: 'error' });
    }
  }, [isInitialReceiverApiFailed]);

  return (
    <Navigation>
      <DefaultContainer>
        {isInitialReceiverApiProcessing ? <Skeleton /> : receiver ? <Details receiver={receiver} /> : <NotFound />}
      </DefaultContainer>
    </Navigation>
  );
};

export default ReceiverContent;
