import { FC, useCallback, useEffect } from 'react';
import { Box, List as MuiList, TextField, Button, Autocomplete } from '@mui/material';
import Pagination from '../shared/Pagination';
import { AllBillListFilters, getTime, isoDate, UserRoles } from '../../lib';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import { AllBillsApi } from '../../apis';
import BillsSkeleton from '../shared/BillsSkeleton';
import EmptyList from './EmptyList';
import Filter from '../shared/Filter';
import { ModalNames } from '../../store';
import BillWithUserCard from '../shared/BillWithUserCard';
import { selectAllBillsList } from '../../store/selectors';
import { useSnackbar } from 'notistack';

const List: FC = () => {
  const actions = useAction();
  const request = useRequest();
  const selectors = useSelector();
  const { enqueueSnackbar } = useSnackbar();
  const allBillListFiltersFormInstance = useForm(AllBillListFilters);
  const allBillListFiltersForm = allBillListFiltersFormInstance.getForm();
  const isInitialAllBillsApiProcessing = request.isInitialApiProcessing(AllBillsApi);
  const isAllBillsApiProcessing = request.isApiProcessing(AllBillsApi);
  const isAllBillsApiFailed = request.isProcessingApiFailed(AllBillsApi);
  const allBillsApiExceptionMessage = request.getExceptionMessage(AllBillsApi);
  const allBillsList = selectAllBillsList(selectors);

  useEffect(() => {
    actions.getInitialAllBills({ page: 1, take: allBillsList.take });
  }, []);

  useEffect(() => {
    if (isAllBillsApiFailed) {
      enqueueSnackbar({ message: allBillsApiExceptionMessage, variant: 'error' });
    }
  }, [isAllBillsApiFailed]);

  const changePage = useCallback(
    (page: number) => {
      if (allBillsList.page === page || isAllBillsApiProcessing) return;
      actions.getAllBills({
        page,
        take: allBillsList.take,
        filters: {
          q: allBillListFiltersForm.q,
          roles: allBillListFiltersForm.roles,
          fromDate: allBillListFiltersForm.fromDate,
          toDate: allBillListFiltersForm.toDate,
        },
      });
    },
    [isAllBillsApiProcessing, allBillsList, allBillListFiltersForm]
  );

  const allBillListFilterFormSubmition = useCallback(() => {
    allBillListFiltersFormInstance.onSubmit(() => {
      actions.getAllBills({
        page: 1,
        take: allBillsList.take,
        filters: {
          q: allBillListFiltersForm.q,
          roles: allBillListFiltersForm.roles,
          fromDate: allBillListFiltersForm.fromDate,
          toDate: allBillListFiltersForm.toDate,
        },
      });
    });
  }, [allBillListFiltersFormInstance, allBillsList, allBillListFiltersForm]);

  return (
    <>
      {isInitialAllBillsApiProcessing || isAllBillsApiProcessing ? (
        <BillsSkeleton take={allBillsList.take} />
      ) : allBillsList.total <= 0 ? (
        <EmptyList />
      ) : (
        <>
          <MuiList>
            {allBillsList.list.map((bill, index) => (
              <BillWithUserCard key={index} index={index} bill={bill} list={allBillsList} />
            ))}
          </MuiList>

          {allBillsList.take < allBillsList.total && (
            <Pagination
              page={allBillsList.page}
              count={Math.ceil(allBillsList.total / allBillsList.take)}
              onPageChange={changePage}
            />
          )}
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
            onChange={(event) => allBillListFiltersFormInstance.onChange('q', event.target.value.trim())}
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
