import { Typography } from '@mui/material';
import { useAction, useRequest, useSelector } from '../../hooks';
import ListContainer from '../../layout/ListContainer';
import Navigation from '../../layout/Navigation';
import { ModalNames } from '../../store';
import { LocationsApi } from '../../apis';
import List from './List';
import { selectLocationsList } from '../../store/selectors';

const LocationsContent = () => {
  const actions = useAction();
  const request = useRequest();
  const selectors = useSelector();
  const isInitialLocationsApiProcessing = request.isInitialApiProcessing(LocationsApi);
  const locationsList = selectLocationsList(selectors);

  const menuOptions = [<Typography onClick={() => actions.showModal(ModalNames.LOCATION_FILTERS)}>Filters</Typography>];

  return (
    <Navigation
      title={`Locations ${!isInitialLocationsApiProcessing ? `(${locationsList.total})` : ''}`}
      menuOptions={menuOptions}
    >
      <ListContainer>
        <List />
      </ListContainer>
    </Navigation>
  );
};

export default LocationsContent;
