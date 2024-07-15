import { Typography } from '@mui/material';
import { useAction, usePaginationList, useRequest } from '../../hooks';
import ListContainer from '../../layout/ListContainer';
import Navigation from '../../layout/Navigation';
import { ModalNames } from '../../store';
import { LocationList } from '../../lib';
import { LocationsApi } from '../../apis';
import List from './List';

const LocationsContent = () => {
  const actions = useAction();
  const request = useRequest();
  const locationListInstance = usePaginationList(LocationList);
  const isInitialLocationsApiProcessing = request.isInitialApiProcessing(LocationsApi);
  const locationsTotal = locationListInstance.getTotal();

  const menuOptions = [<Typography onClick={() => actions.showModal(ModalNames.LOCATION_FILTERS)}>Filters</Typography>];

  return (
    <Navigation
      title={`Locations ${!isInitialLocationsApiProcessing ? `(${locationsTotal})` : ''}`}
      menuOptions={menuOptions}
    >
      <ListContainer>
        <List />
      </ListContainer>
    </Navigation>
  );
};

export default LocationsContent;
