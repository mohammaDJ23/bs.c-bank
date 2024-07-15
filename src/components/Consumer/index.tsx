import DefaultContainer from '../../layout/DefaultContainer';
import { useParams } from 'react-router-dom';
import { useAction, useRequest, useSelector } from '../../hooks';
import { useEffect, FC } from 'react';
import Skeleton from './Skeleton';
import { ConsumerApi } from '../../apis';
import { ConsumerObj } from '../../lib';
import NotFound from './NotFound';
import Details from './Details';
import Navigation from '../../layout/Navigation';

const ConsumerContent: FC = () => {
  const params = useParams();
  const request = useRequest();
  const actions = useAction();
  const selectors = useSelector();
  const isInitialConsumerApiProcessing = request.isInitialApiProcessing(ConsumerApi);
  const consumer = selectors.specificDetails.consumer;

  useEffect(() => {
    const consumerId = params.id;
    if (consumerId) {
      request.build<ConsumerObj, string>(new ConsumerApi(+consumerId).setInitialApi()).then((response) => {
        actions.setSpecificDetails('consumer', response.data);
      });
    }
  }, []);

  return (
    <Navigation>
      <DefaultContainer>
        {isInitialConsumerApiProcessing ? <Skeleton /> : consumer ? <Details consumer={consumer} /> : <NotFound />}
      </DefaultContainer>
    </Navigation>
  );
};

export default ConsumerContent;
