import { FC, useCallback, useEffect } from 'react';
import { Box, List as MuiList, TextField, Button, Autocomplete } from '@mui/material';
import Pagination from '../shared/Pagination';
import { AllBillList, AllBillListFilters, getTime, isoDate, BillWithUserObj, UserRoles } from '../../lib';
import { useForm, usePaginationList, useRequest } from '../../hooks';
import { AllBillsApi, AllBillsApiConstructorType } from '../../apis';
import BillsSkeleton from '../shared/BillsSkeleton';
import EmptyList from './EmptyList';
import Filter from '../shared/Filter';
import { ModalNames } from '../../store';
import BillWithUserCard from '../shared/BillWithUserCard';

const List: FC = () => {
  const request = useRequest();
  const allBillListInstance = usePaginationList(AllBillList);
  const allBillListFiltersFormInstance = useForm(AllBillListFilters);
  const allBillListFiltersForm = allBillListFiltersFormInstance.getForm();
  const allBillListInfo = allBillListInstance.getFullInfo();
  const isInitialAllBillsApiProcessing = request.isInitialApiProcessing(AllBillsApi);
  const isAllBillsApiProcessing = request.isApiProcessing(AllBillsApi);

  const getAllBillsApi = useCallback(
    (options: Partial<AllBillsApiConstructorType> = {}) => {
      return new AllBillsApi({
        take: allBillListInfo.take,
        page: allBillListInfo.page,
        filters: {
          q: allBillListFiltersForm.q,
          roles: allBillListFiltersForm.roles,
          fromDate: allBillListFiltersForm.fromDate,
          toDate: allBillListFiltersForm.toDate,
        },
        ...options,
      });
    },
    [allBillListFiltersForm, allBillListInfo]
  );

  const getAllBillsList = useCallback(
    (api: AllBillsApi) => {
      request.build<[BillWithUserObj[], number]>(api).then((response) => {
        const [list, total] = response.data;
        allBillListInstance.insertNewList({ list, total, page: allBillListInfo.page });
      });
    },
    [allBillListInfo, allBillListInstance, request]
  );

  useEffect(() => {
    const api = getAllBillsApi();
    api.setInitialApi();
    getAllBillsList(api);
  }, []);

  const changePage = useCallback(
    (newPage: number) => {
      allBillListInstance.onPageChange(newPage);

      if (allBillListInstance.isNewPageEqualToCurrentPage(newPage) || isAllBillsApiProcessing) return;

      if (!allBillListInstance.isNewPageExist(newPage)) {
        const api = getAllBillsApi({ page: newPage });
        getAllBillsList(api);
      }
    },
    [isAllBillsApiProcessing, allBillListInstance, getAllBillsList, getAllBillsApi]
  );

  const allBillListFilterFormSubmition = useCallback(() => {
    allBillListFiltersFormInstance.onSubmit(() => {
      const newPage = 1;
      allBillListInstance.onPageChange(newPage);
      const api = getAllBillsApi({ page: newPage });
      getAllBillsList(api);
    });
  }, [allBillListFiltersFormInstance, allBillListInstance, getAllBillsList, getAllBillsApi]);

  return (
    <>
      {isInitialAllBillsApiProcessing || isAllBillsApiProcessing ? (
        <BillsSkeleton take={allBillListInfo.take} />
      ) : allBillListInstance.isListEmpty() ? (
        <EmptyList />
      ) : (
        <>
          <MuiList>
            {allBillListInfo.list.map((bill, index) => (
              <BillWithUserCard key={index} index={index} bill={bill} listInfo={allBillListInfo} />
            ))}
          </MuiList>

          <Pagination page={allBillListInfo.page} count={allBillListInfo.count} onPageChange={changePage} />
        </>
      )}

      <Filter name={ModalNames.ALL_BILL_FILTERS}>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          display="flex"
          flexDirection="column"
          gap="20px"
          onSubmit={(event) => {
            event.preventDefault();
            allBillListFilterFormSubmition();
          }}
        >
          <TextField
            label="Search"
            variant="standard"
            type="text"
            fullWidth
            value={allBillListFiltersForm.q}
            onChange={(event) => allBillListFiltersFormInstance.onChange('q', event.target.value)}
            helperText={allBillListFiltersFormInstance.getInputErrorMessage('q')}
            error={allBillListFiltersFormInstance.isInputInValid('q')}
            name="q"
            placeholder="amount, receiver, description, firstname, lastname"
            disabled={isAllBillsApiProcessing}
          />
          <Autocomplete
            multiple
            id="size-small-standard-multi"
            size="small"
            options={Object.values(UserRoles)}
            getOptionLabel={(option: (typeof allBillListFiltersForm.roles)[number]) => option}
            onChange={(event, value) => allBillListFiltersFormInstance.onChange('roles', value)}
            value={allBillListFiltersForm.roles}
            renderInput={(params: any) => (
              <TextField
                {...params}
                label="Roles"
                variant="standard"
                type="text"
                error={allBillListFiltersFormInstance.isInputInValid('roles')}
                helperText={allBillListFiltersFormInstance.getInputErrorMessage('roles')}
                name="roles"
              />
            )}
            disabled={isAllBillsApiProcessing}
          />
          <TextField
            label="From date"
            type="date"
            variant="standard"
            value={allBillListFiltersForm.fromDate ? isoDate(allBillListFiltersForm.fromDate) : ''}
            onChange={(event) => allBillListFiltersFormInstance.onChange('fromDate', getTime(event.target.value))}
            helperText={allBillListFiltersFormInstance.getInputErrorMessage('fromDate')}
            error={allBillListFiltersFormInstance.isInputInValid('fromDate')}
            InputLabelProps={{ shrink: true }}
            name="fromDate"
            disabled={isAllBillsApiProcessing}
          />
          <TextField
            label="To date"
            type="date"
            variant="standard"
            value={allBillListFiltersForm.toDate ? isoDate(allBillListFiltersForm.toDate) : ''}
            onChange={(event) => allBillListFiltersFormInstance.onChange('toDate', getTime(event.target.value))}
            helperText={allBillListFiltersFormInstance.getInputErrorMessage('toDate')}
            error={allBillListFiltersFormInstance.isInputInValid('toDate')}
            InputLabelProps={{ shrink: true }}
            name="toDate"
            disabled={isAllBillsApiProcessing}
          />
          <Box component="div" display="flex" alignItems="center" gap="10px" marginTop="20px">
            <Button
              disabled={isAllBillsApiProcessing || !allBillListFiltersFormInstance.isFormValid()}
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
              onClick={() => allBillListFiltersFormInstance.resetForm()}
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
