import FormContainer from '../../layout/FormContainer';
import Form from './Form';
import { LocationObj, UpdateLocation } from '../../lib';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import { useEffect, FC } from 'react';
import { useParams } from 'react-router-dom';
import Skeleton from './Skeleton';
import { LocaitonApi } from '../../apis';
import NotFound from './NotFound';
import Navigation from '../../layout/Navigation';

const UpdateLocationContent: FC = () => {
  const params = useParams();
  const actions = useAction();
  const selectors = useSelector();
  const request = useRequest();
  const updateLocationFormInstance = useForm(UpdateLocation);
  const isInitialLocationApiProcessing = request.isInitialApiProcessing(LocaitonApi);

  useEffect(() => {
    const locationId = params.id;
    if (locationId) {
      request.build<LocationObj, string>(new LocaitonApi(+locationId).setInitialApi()).then((response) => {
        actions.setSpecificDetails('location', response.data);
        updateLocationFormInstance.initializeForm(
          new UpdateLocation({
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
        {isInitialLocationApiProcessing ? (
          <Skeleton />
        ) : selectors.specificDetails.location ? (
          <Form formInstance={updateLocationFormInstance} />
        ) : (
          <NotFound />
        )}
      </FormContainer>
    </Navigation>
  );
};

export default UpdateLocationContent;
