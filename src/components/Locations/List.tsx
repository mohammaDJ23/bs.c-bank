import { FC, useCallback, useEffect } from 'react';
import { Box, List as MuiList, TextField, Button } from '@mui/material';
import Pagination from '../shared/Pagination';
import { LocationList, LocationListFilters, LocationObj } from '../../lib';
import { useForm, usePaginationList, useRequest } from '../../hooks';
import { LocationsApi } from '../../apis';
import LocationsSkeleton from '../shared/LocationsSkeleton';
import EmptyList from './EmptyList';
import Filter from '../shared/Filter';
import { ModalNames } from '../../store';
import LocationCard from '../shared/LocationCard';

const List: FC = () => {
  const request = useRequest();
  const locationListInstance = usePaginationList(LocationList);
  const locationListFiltersFormInstance = useForm(LocationListFilters);
  const locationListFiltersForm = locationListFiltersFormInstance.getForm();
  const isInitialLocationsApiProcessing = request.isInitialApiProcessing(LocationsApi);
  const isLocationsApiProcessing = request.isApiProcessing(LocationsApi);

  const getLocationsList = useCallback(
    async (api: LocationsApi) =>
      request.build<[LocationObj[], number], LocationObj>(api).then((response) => response.data),
    [request]
  );

  useEffect(() => {
    const api = new LocationsApi();
    api.setInitialApi();
    getLocationsList(api).then(([list, total]) => {
      locationListInstance.updateAndConcatList(list, 1);
      locationListInstance.updateTotal(total);
    });
  }, []);

  const changePage = useCallback(
    (newPage: number) => {
      locationListInstance.updatePage(newPage);

      if (locationListInstance.isNewPageEqualToCurrentPage(newPage) || isLocationsApiProcessing) return;

      if (!locationListInstance.isNewPageExist(newPage)) {
        getLocationsList(
          new LocationsApi({
            page: newPage,
            filters: {
              q: locationListFiltersForm.q,
            },
          })
        ).then(([list, total]) => {
          locationListInstance.updateAndConcatList(list, newPage);
          locationListInstance.updatePage(newPage);
          locationListInstance.updateTotal(total);
        });
      }
    },
    [isLocationsApiProcessing, locationListInstance, locationListFiltersForm, getLocationsList]
  );

  const locationListFilterFormSubmition = useCallback(() => {
    locationListFiltersFormInstance.onSubmit(() => {
      const newPage = 1;
      locationListInstance.updatePage(newPage);
      getLocationsList(
        new LocationsApi({
          page: newPage,
          filters: {
            q: locationListFiltersForm.q,
          },
        })
      ).then(([list, total]) => {
        locationListInstance.updateAndConcatList(list, newPage);
        locationListInstance.updateTotal(total);
      });
    });
  }, [locationListFiltersFormInstance, locationListInstance, locationListFiltersForm, getLocationsList]);

  return (
    <>
      {isInitialLocationsApiProcessing || isLocationsApiProcessing ? (
        <LocationsSkeleton take={locationListInstance.getTake()} />
      ) : locationListInstance.isListEmpty() ? (
        <EmptyList />
      ) : (
        <>
          <MuiList>
            {locationListInstance.getList().map((location, index) => (
              <LocationCard key={index} index={index} location={location} listInstance={locationListInstance} />
            ))}
          </MuiList>

          {locationListInstance.getTotal() > locationListInstance.getTake() && (
            <Pagination
              page={locationListInstance.getPage()}
              count={locationListInstance.getCount()}
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
