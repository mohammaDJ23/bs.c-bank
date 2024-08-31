import { FC, useCallback, useEffect } from 'react';
import { Box, List as MuiList, TextField, Button } from '@mui/material';
import Pagination from '../shared/Pagination';
import { listScrollTop, LocationListFilters } from '../../lib';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import { LocationsApi } from '../../apis';
import LocationsSkeleton from '../shared/LocationsSkeleton';
import EmptyList from './EmptyList';
import Filter from '../shared/Filter';
import { ModalNames } from '../../store';
import LocationCard from '../shared/LocationCard';
import { selectLocationsList } from '../../store/selectors';
import { useSnackbar } from 'notistack';
import ResetStyleWithAnimation from '../shared/ResetStyleWithAnimation';

const List: FC = () => {
  const request = useRequest();
  const selectors = useSelector();
  const actions = useAction();
  const snackbar = useSnackbar();
  const locationListFiltersFormInstance = useForm(LocationListFilters);
  const locationListFiltersForm = locationListFiltersFormInstance.getForm();
  const isInitialLocationsApiProcessing = request.isInitialApiProcessing(LocationsApi);
  const isLocationsApiProcessing = request.isApiProcessing(LocationsApi);
  const isInitialLocationsApiFailed = request.isInitialProcessingApiFailed(LocationsApi);
  const isLocationsApiFailed = request.isProcessingApiFailed(LocationsApi);
  const initialLocationsApiExceptionMessage = request.getInitialExceptionMessage(LocationsApi);
  const locationsApiExceptionMessage = request.getExceptionMessage(LocationsApi);
  const locationsList = selectLocationsList(selectors);

  useEffect(() => {
    actions.getInitialLocations({ page: 1, take: locationsList.take });
  }, []);

  useEffect(() => {
    if (isInitialLocationsApiFailed) {
      snackbar.enqueueSnackbar({ message: initialLocationsApiExceptionMessage, variant: 'error' });
    } else if (isLocationsApiFailed) {
      snackbar.enqueueSnackbar({ message: locationsApiExceptionMessage, variant: 'error' });
    }
  }, [isInitialLocationsApiFailed, isLocationsApiFailed]);

  const changePage = useCallback(
    (page: number) => {
      if (locationsList.page || isLocationsApiProcessing) return;
      listScrollTop();
      actions.getLocations({
        page,
        take: locationsList.take,
        filters: { q: locationListFiltersForm.q },
      });
    },
    [isLocationsApiProcessing, locationsList, locationListFiltersForm]
  );

  const locationListFilterFormSubmition = useCallback(() => {
    locationListFiltersFormInstance.onSubmit(() => {
      actions.getLocations({
        page: 1,
        take: locationsList.take,
        filters: { q: locationListFiltersForm.q },
      });
    });
  }, [locationListFiltersFormInstance, locationListFiltersForm, locationsList]);

  return (
    <>
      {isInitialLocationsApiProcessing || isLocationsApiProcessing ? (
        <LocationsSkeleton take={locationsList.take} />
      ) : locationsList.total <= 0 ? (
        <EmptyList />
      ) : (
        <>
          <MuiList>
            {locationsList.list.map((location, index) => (
              <ResetStyleWithAnimation key={index} sx={{ opacity: '1', transform: 'translateY(0)' }}>
                <Box
                  sx={{
                    opacity: '0',
                    transform: 'translateY(30px)',
                    transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                    transitionDelay: `${index * 0.02}s`,
                  }}
                >
                  <LocationCard index={index} location={location} list={locationsList} />
                </Box>
              </ResetStyleWithAnimation>
            ))}
          </MuiList>

          {locationsList.take < locationsList.total && (
            <Pagination
              page={locationsList.page}
              count={Math.ceil(locationsList.total / locationsList.take)}
              onPageChange={changePage}
            />
          )}
        </>
      )}

      <Filter name={ModalNames.LOCATION_FILTERS}>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          display="flex"
          flexDirection="column"
          gap="20px"
          onSubmit={(event) => {
            event.preventDefault();
            locationListFilterFormSubmition();
          }}
        >
          <TextField
            label="Search"
            variant="standard"
            type="text"
            fullWidth
            value={locationListFiltersForm.q}
            onChange={(event) => locationListFiltersFormInstance.onChange('q', event.target.value.trim())}
            helperText={locationListFiltersFormInstance.getInputErrorMessage('q')}
            error={locationListFiltersFormInstance.isInputInValid('q')}
            name="q"
            placeholder="name"
            disabled={isLocationsApiProcessing}
          />
          <Box component="div" display="flex" alignItems="center" gap="10px" marginTop="20px">
            <Button
              disabled={isLocationsApiProcessing || !locationListFiltersFormInstance.isFormValid()}
              variant="contained"
              size="small"
              type="submit"
              sx={{ textTransform: 'capitalize' }}
            >
              Filter
            </Button>
            <Button
              disabled={false}
              variant="outlined"
              size="small"
              type="button"
              sx={{ textTransform: 'capitalize' }}
              onClick={() => locationListFiltersFormInstance.resetForm()}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </Filter>
    </>
  );
};

export default List;
