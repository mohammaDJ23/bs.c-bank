import DefaultContainer from '../../layout/DefaultContainer';
import { useParams } from 'react-router-dom';
import { useAction, useRequest, useSelector } from '../../hooks';
import { useEffect, FC } from 'react';
import Skeleton from './Skeleton';
import { ReceiverApi } from '../../apis';
import { ReceiverObj } from '../../lib';
import NotFound from './NotFound';
import Details from './Details';
import Navigation from '../../layout/Navigation';

const ReceiverContent: FC = () => {
  const params = useParams();
  const request = useRequest();
  const actions = useAction();
  const selectors = useSelector();
  const isInitialReceiverApiProcessing = request.isInitialApiProcessing(ReceiverApi);
  const receiver = selectors.specificDetails.receiver;

  useEffect(() => {
    const receiverId = params.id;
    if (receiverId) {
      request.build<ReceiverObj, string>(new ReceiverApi(+receiverId).setInitialApi()).then((response) => {
        actions.setSpecificDetails('receiver', response.data);
      });
    }
  }, []);

  return (
    <Navigation>
      <DefaultContainer>
        {isInitialReceiverApiProcessing ? <Skeleton /> : receiver ? <Details receiver={receiver} /> : <NotFound />}
      </DefaultContainer>
    </Navigation>
  );
};

export default ReceiverContent;
