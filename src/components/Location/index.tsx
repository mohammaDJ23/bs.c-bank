import DefaultContainer from '../../layout/DefaultContainer';
import { useParams } from 'react-router-dom';
import { useAction, useRequest, useSelector } from '../../hooks';
import { useEffect, FC } from 'react';
import Skeleton from './Skeleton';
import { LocaitonApi } from '../../apis';
import { LocationObj } from '../../lib';
import NotFound from './NotFound';
import Details from './Details';
import Navigation from '../../layout/Navigation';

const LocationContent: FC = () => {
  const params = useParams();
  const request = useRequest();
  const actions = useAction();
  const selectors = useSelector();
  const isInitialLocationApiProcessing = request.isInitialApiProcessing(LocaitonApi);
  const location = selectors.specificDetails.location;

  useEffect(() => {
    const locationId = params.id;
    if (locationId) {
      request.build<LocationObj, string>(new LocaitonApi(+locationId).setInitialApi()).then((response) => {
        actions.setSpecificDetails('location', response.data);
      });
    }
  }, []);

  return (
    <Navigation>
      <DefaultContainer>
        {isInitialLocationApiProcessing ? <Skeleton /> : location ? <Details location={location} /> : <NotFound />}
      </DefaultContainer>
    </Navigation>
  );
};

export default LocationContent;
