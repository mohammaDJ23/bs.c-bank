import FormContainer from '../../layout/FormContainer';
import Form from './Form';
import { Consumer, UpdateConsumer } from '../../lib';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import { useEffect, FC } from 'react';
import { useParams } from 'react-router-dom';
import Skeleton from './Skeleton';
import { ConsumerApi } from '../../apis';
import NotFound from './NotFound';
import Navigation from '../../layout/Navigation';

const UpdateConsumerContent: FC = () => {
  const params = useParams();
  const actions = useAction();
  const selectors = useSelector();
  const request = useRequest();
  const updateConsumerFormInstance = useForm(UpdateConsumer);
  const isInitialConsumerApiProcessing = request.isInitialApiProcessing(ConsumerApi);

  useEffect(() => {
    const consumerId = params.id;
    if (consumerId) {
      request.build<Consumer, string>(new ConsumerApi(+consumerId).setInitialApi()).then((response) => {
        actions.setSpecificDetails('consumer', response.data);
        updateConsumerFormInstance.initializeForm(
          new UpdateConsumer({
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
