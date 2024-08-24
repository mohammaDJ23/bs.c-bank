import { FC, useCallback, useEffect } from 'react';
import { Box, List as MuiList, TextField, Button } from '@mui/material';
import Pagination from '../shared/Pagination';
import { DeletedBillListFilters, getTime, isoDate } from '../../lib';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import { DeletedBillsApi } from '../../apis';
import BillsSkeleton from '../shared/BillsSkeleton';
import EmptyList from './EmptyList';
import Filter from '../shared/Filter';
import { ModalNames } from '../../store';
import BillCard from '../shared/BiilCard';
import { selectDeletedBillsList } from '../../store/selectors';

const List: FC = () => {
  const request = useRequest();
  const actions = useAction();
  const selectors = useSelector();
  const deletedBillListFiltersFormInstance = useForm(DeletedBillListFilters);
  const deletedBillListFiltersForm = deletedBillListFiltersFormInstance.getForm();
  const isInitialDeletedBillListApiProcessing = request.isInitialApiProcessing(DeletedBillsApi);
  const isDeletedBillListApiProcessing = request.isApiProcessing(DeletedBillsApi);
  const deletedBillsList = selectDeletedBillsList(selectors);

  useEffect(() => {
    actions.getInitialDeletedBills({ page: 1, take: deletedBillsList.take });
  }, []);

  const changePage = useCallback(
    (page: number) => {
      if (deletedBillsList.page === page || isDeletedBillListApiProcessing) return;
      actions.getDeletedBills({
        page,
        take: deletedBillsList.take,
        filters: {
          q: deletedBillListFiltersForm.q,
          fromDate: deletedBillListFiltersForm.fromDate,
          toDate: deletedBillListFiltersForm.toDate,
          deletedDate: deletedBillListFiltersForm.deletedDate,
        },
      });
    },
    [isDeletedBillListApiProcessing, deletedBillsList, deletedBillListFiltersForm]
  );

  const deletedBillListFilterFormSubmition = useCallback(() => {
    deletedBillListFiltersFormInstance.onSubmit(() => {
      actions.getDeletedBills({
        page: 1,
        take: deletedBillsList.take,
        filters: {
          q: deletedBillListFiltersForm.q,
          fromDate: deletedBillListFiltersForm.fromDate,
          toDate: deletedBillListFiltersForm.toDate,
          deletedDate: deletedBillListFiltersForm.deletedDate,
        },
      });
    });
  }, [deletedBillListFiltersFormInstance, deletedBillsList, deletedBillListFiltersForm]);

  return (
    <>
      {isInitialDeletedBillListApiProcessing || isDeletedBillListApiProcessing ? (
        <BillsSkeleton take={deletedBillsList.take} />
      ) : deletedBillsList.total <= 0 ? (
        <EmptyList />
      ) : (
        <>
          <MuiList>
            {deletedBillsList.list.map((bill, index) => (
              <BillCard key={index} index={index} bill={bill} list={deletedBillsList} />
            ))}
          </MuiList>

          {deletedBillsList.take < deletedBillsList.total && (
            <Pagination
              page={deletedBillsList.page}
              count={Math.ceil(deletedBillsList.total / deletedBillsList.take)}
              onPageChange={changePage}
            />
          )}
        </>
      )}

      <Filter name={ModalNames.DELETED_BILL_FILTERS}>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          display="flex"
          flexDirection="column"
          gap="20px"
          onSubmit={(event) => {
            event.preventDefault();
            deletedBillListFilterFormSubmition();
          }}
        >
          <TextField
            label="Search"
            variant="standard"
            type="text"
            fullWidth
            value={deletedBillListFiltersForm.q}
            onChange={(event) => deletedBillListFiltersFormInstance.onChange('q', event.target.value.trim())}
            helperText={deletedBillListFiltersFormInstance.getInputErrorMessage('q')}
            error={deletedBillListFiltersFormInstance.isInputInValid('q')}
            name="q"
            placeholder="amount, receiver, description"
            disabled={isDeletedBillListApiProcessing}
          />
          <TextField
            label="From date"
            type="date"
            variant="standard"
            value={deletedBillListFiltersForm.fromDate ? isoDate(deletedBillListFiltersForm.fromDate) : ''}
            onChange={(event) => deletedBillListFiltersFormInstance.onChange('fromDate', getTime(event.target.value))}
            helperText={deletedBillListFiltersFormInstance.getInputErrorMessage('fromDate')}
            error={deletedBillListFiltersFormInstance.isInputInValid('fromDate')}
            InputLabelProps={{ shrink: true }}
            name="fromDate"
            disabled={isDeletedBillListApiProcessing}
          />
          <TextField
            label="To date"
            type="date"
            variant="standard"
            value={deletedBillListFiltersForm.toDate ? isoDate(deletedBillListFiltersForm.toDate) : ''}
            onChange={(event) => deletedBillListFiltersFormInstance.onChange('toDate', getTime(event.target.value))}
            helperText={deletedBillListFiltersFormInstance.getInputErrorMessage('toDate')}
            error={deletedBillListFiltersFormInstance.isInputInValid('toDate')}
            InputLabelProps={{ shrink: true }}
            name="toDate"
            disabled={isDeletedBillListApiProcessing}
          />
          <TextField
            label="Deleted date"
            type="date"
            variant="standard"
            value={deletedBillListFiltersForm.deletedDate ? isoDate(deletedBillListFiltersForm.deletedDate) : ''}
            onChange={(event) =>
              deletedBillListFiltersFormInstance.onChange('deletedDate', getTime(event.target.value))
            }
            helperText={deletedBillListFiltersFormInstance.getInputErrorMessage('deletedDate')}
            error={deletedBillListFiltersFormInstance.isInputInValid('deletedDate')}
            InputLabelProps={{ shrink: true }}
            name="deletedDate"
            disabled={isDeletedBillListApiProcessing}
          />
          <Box component="div" display="flex" alignItems="center" gap="10px" marginTop="20px">
            <Button
              disabled={isDeletedBillListApiProcessing || !deletedBillListFiltersFormInstance.isFormValid()}
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
              onClick={() => deletedBillListFiltersFormInstance.resetForm()}
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
