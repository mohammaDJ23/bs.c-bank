import { FC, useCallback, useEffect } from 'react';
import { Box, List as MuiList, TextField, Button } from '@mui/material';
import Pagination from '../shared/Pagination';
import { BillObj, DeletedBillList, DeletedBillListFilters, getTime, isoDate } from '../../lib';
import { useForm, usePaginationList, useRequest } from '../../hooks';
import { DeletedBillListApi, DeletedBillListApiConstructorType } from '../../apis';
import BillsSkeleton from '../shared/BillsSkeleton';
import EmptyList from './EmptyList';
import Filter from '../shared/Filter';
import { ModalNames } from '../../store';
import BillCard from '../shared/BiilCard';

const List: FC = () => {
  const request = useRequest();
  const deletedBillListInstance = usePaginationList(DeletedBillList);
  const deletedBillListFiltersFormInstance = useForm(DeletedBillListFilters);
  const deletedBillListFiltersForm = deletedBillListFiltersFormInstance.getForm();
  const deletedBillListInfo = deletedBillListInstance.getFullInfo();
  const isInitialDeletedBillListApiProcessing = request.isInitialApiProcessing(DeletedBillListApi);
  const isDeletedBillListApiProcessing = request.isApiProcessing(DeletedBillListApi);

  const getDeletedBillListApi = useCallback(
    (options: Partial<DeletedBillListApiConstructorType> = {}) => {
      return new DeletedBillListApi({
        take: deletedBillListInfo.take,
        page: deletedBillListInfo.page,
        filters: {
          q: deletedBillListFiltersForm.q,
          fromDate: deletedBillListFiltersForm.fromDate,
          toDate: deletedBillListFiltersForm.toDate,
          deletedDate: deletedBillListFiltersForm.deletedDate,
        },
        ...options,
      });
    },
    [deletedBillListInfo, deletedBillListFiltersForm]
  );

  const getDeletedBillList = useCallback(
    (api: DeletedBillListApi) => {
      request.build<[BillObj[], number]>(api).then((response) => {
        const [list, total] = response.data;
        deletedBillListInstance.insertNewList({ list, total, page: api.api.params.page });
      });
    },
    [deletedBillListInfo, deletedBillListInstance, deletedBillListFiltersForm, request]
  );

  useEffect(() => {
    const api = getDeletedBillListApi();
    api.setInitialApi();
    getDeletedBillList(api);
  }, []);

  const changePage = useCallback(
    (newPage: number) => {
      deletedBillListInstance.onPageChange(newPage);

      if (deletedBillListInstance.isNewPageEqualToCurrentPage(newPage) || isDeletedBillListApiProcessing) return;

      if (!deletedBillListInstance.isNewPageExist(newPage)) {
        const api = getDeletedBillListApi({ page: newPage });
        getDeletedBillList(api);
      }
    },
    [isDeletedBillListApiProcessing, deletedBillListInstance, getDeletedBillList]
  );

  const deletedBillListFilterFormSubmition = useCallback(() => {
    deletedBillListFiltersFormInstance.onSubmit(() => {
      const newPage = 1;
      deletedBillListInstance.onPageChange(newPage);
      const api = getDeletedBillListApi({ page: newPage });
      getDeletedBillList(api);
    });
  }, [deletedBillListFiltersFormInstance, deletedBillListInstance, getDeletedBillList]);

  return (
    <>
      {isInitialDeletedBillListApiProcessing || isDeletedBillListApiProcessing ? (
        <BillsSkeleton take={deletedBillListInfo.take} />
      ) : deletedBillListInstance.isListEmpty() ? (
        <EmptyList />
      ) : (
        <>
          <MuiList>
            {deletedBillListInfo.list.map((bill, index) => (
              <BillCard key={index} index={index} bill={bill} listInfo={deletedBillListInfo} />
            ))}
          </MuiList>

          <Pagination page={deletedBillListInfo.page} count={deletedBillListInfo.count} onPageChange={changePage} />
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
