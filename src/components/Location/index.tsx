import DefaultContainer from '../../layout/DefaultContainer';
import { useParams } from 'react-router-dom';
import { useAction, useRequest, useSelector } from '../../hooks';
import { useEffect, FC } from 'react';
import Skeleton from './Skeleton';
import { LocaitonApi } from '../../apis';
import { Location } from '../../lib';
import NotFound from './NotFound';
import Details from './Details';
import Navigation from '../../layout/Navigation';
import { useSnackbar } from 'notistack';

const LocationContent: FC = () => {
  const params = useParams();
  const request = useRequest();
  const actions = useAction();
  const selectors = useSelector();
  const snackbar = useSnackbar();
  const isInitialLocationApiProcessing = request.isInitialApiProcessing(LocaitonApi);
  const isInitialLocationApiFailed = request.isInitialProcessingApiFailed(LocaitonApi);
  const initialLocationApiExceptionMessage = request.getInitialExceptionMessage(LocaitonApi);
  const location = selectors.specificDetails.location;

  useEffect(() => {
    const id = params.id;
    if (id) {
      actions.getInitialLocation(+id);
    }
  }, []);

  useEffect(() => {
    if (isInitialLocationApiFailed) {
      snackbar.enqueueSnackbar({ message: initialLocationApiExceptionMessage, variant: 'error' });
    }
  }, [isInitialLocationApiFailed]);

  return (
    <Navigation>
      <DefaultContainer>
        {isInitialLocationApiProcessing ? <Skeleton /> : location ? <Details location={location} /> : <NotFound />}
      </DefaultContainer>
    </Navigation>
  );
};

export default LocationContent;
