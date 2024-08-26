import FormContainer from '../../layout/FormContainer';
import Form from './Form';
import { UpdateLocation } from '../../lib';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import { useEffect, FC } from 'react';
import { useParams } from 'react-router-dom';
import Skeleton from './Skeleton';
import { LocaitonApi } from '../../apis';
import NotFound from './NotFound';
import Navigation from '../../layout/Navigation';
import { useSnackbar } from 'notistack';

const UpdateLocationContent: FC = () => {
  const params = useParams();
  const actions = useAction();
  const selectors = useSelector();
  const request = useRequest();
  const snackbar = useSnackbar();
  const updateLocationFormInstance = useForm(UpdateLocation);
  const isInitialLocationApiProcessing = request.isInitialApiProcessing(LocaitonApi);
  const isInitialLocationApiFailed = request.isInitialProcessingApiFailed(LocaitonApi);
  const isInitialLocationApiSuccessed = request.isInitialProcessingApiSuccessed(LocaitonApi);
  const initialLocationApiExceptionMessage = request.getInitialExceptionMessage(LocaitonApi);
  const location = selectors.specificDetails.location;

  useEffect(() => {
    const id = params.id;
    if (id) {
      actions.getInitialLocation(+id);
    }
  }, []);

  useEffect(() => {
    if (isInitialLocationApiSuccessed && location) {
      updateLocationFormInstance.initializeForm(
        new UpdateLocation({
          id: location.id,
          name: location.name,
        })
      );
    } else if (isInitialLocationApiFailed && !location) {
      snackbar.enqueueSnackbar({ message: initialLocationApiExceptionMessage, variant: 'error' });
    }
  }, [isInitialLocationApiFailed, isInitialLocationApiSuccessed, location]);

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
