import { FC, useCallback, useEffect } from 'react';
import { Box, List as MuiList, TextField, Button } from '@mui/material';
import Pagination from '../shared/Pagination';
import { BillListFilters, getTime, isoDate } from '../../lib';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import { BillsApi } from '../../apis';
import BillsSkeleton from '../shared/BillsSkeleton';
import EmptyList from './EmptyList';
import Filter from '../shared/Filter';
import { ModalNames } from '../../store';
import BillCard from '../shared/BiilCard';
import { selectBillsList } from '../../store/selectors';

const List: FC = () => {
  const actions = useAction();
  const selectors = useSelector();
  const request = useRequest();
  const billListFiltersFormInstance = useForm(BillListFilters);
  const billListFiltersForm = billListFiltersFormInstance.getForm();
  const isInitialBillsApiProcessing = request.isInitialApiProcessing(BillsApi);
  const isBillsApiProcessing = request.isApiProcessing(BillsApi);
  const billsList = selectBillsList(selectors);

  useEffect(() => {
    actions.getInitialBills({ page: 1, take: billsList.take });
  }, []);

  const changePage = useCallback(
    (page: number) => {
      if (billsList.page === page || isBillsApiProcessing) return;
      actions.getBills({
        page,
        take: billsList.take,
        filters: {
          q: billListFiltersForm.q,
          fromDate: billListFiltersForm.fromDate,
          toDate: billListFiltersForm.toDate,
        },
      });
    },
    [isBillsApiProcessing, billsList, billListFiltersForm]
  );

  const billListFilterFormSubmition = useCallback(() => {
    billListFiltersFormInstance.onSubmit(() => {
      actions.getBills({
        page: 1,
        take: billsList.take,
        filters: {
          q: billListFiltersForm.q,
          fromDate: billListFiltersForm.fromDate,
          toDate: billListFiltersForm.toDate,
        },
      });
    });
  }, [billListFiltersFormInstance, billListFiltersForm, billsList]);

  return (
    <>
      {isInitialBillsApiProcessing || isBillsApiProcessing ? (
        <BillsSkeleton take={billsList.take} />
      ) : billsList.total <= 0 ? (
        <EmptyList />
      ) : (
        <>
          <MuiList>
            {billsList.list.map((bill, index) => (
              <BillCard key={index} index={index} bill={bill} list={billsList} />
            ))}
          </MuiList>

          {billsList.take < billsList.total && (
            <Pagination
              page={billsList.page}
              count={Math.ceil(billsList.total / billsList.take)}
              onPageChange={changePage}
            />
          )}
        </>
      )}

      <Filter name={ModalNames.BILL_FILTERS}>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          display="flex"
          flexDirection="column"
          gap="20px"
          onSubmit={(event) => {
            event.preventDefault();
            billListFilterFormSubmition();
          }}
        >
          <TextField
            label="Search"
            variant="standard"
            type="text"
            fullWidth
            value={billListFiltersForm.q}
            onChange={(event) => billListFiltersFormInstance.onChange('q', event.target.value.trim())}
            helperText={billListFiltersFormInstance.getInputErrorMessage('q')}
            error={billListFiltersFormInstance.isInputInValid('q')}
            name="q"
            placeholder="amount, receiver, description"
            disabled={isBillsApiProcessing}
          />
          <TextField
            label="From date"
            type="date"
            variant="standard"
            value={billListFiltersForm.fromDate ? isoDate(billListFiltersForm.fromDate) : ''}
            onChange={(event) => billListFiltersFormInstance.onChange('fromDate', getTime(event.target.value))}
            helperText={billListFiltersFormInstance.getInputErrorMessage('fromDate')}
            error={billListFiltersFormInstance.isInputInValid('fromDate')}
            InputLabelProps={{ shrink: true }}
            name="fromDate"
            disabled={isBillsApiProcessing}
          />
          <TextField
            label="To date"
            type="date"
            variant="standard"
            value={billListFiltersForm.toDate ? isoDate(billListFiltersForm.toDate) : ''}
            onChange={(event) => billListFiltersFormInstance.onChange('toDate', getTime(event.target.value))}
            helperText={billListFiltersFormInstance.getInputErrorMessage('toDate')}
            error={billListFiltersFormInstance.isInputInValid('toDate')}
            InputLabelProps={{ shrink: true }}
            name="toDate"
            disabled={isBillsApiProcessing}
          />
          <Box component="div" display="flex" alignItems="center" gap="10px" marginTop="20px">
            <Button
              disabled={isBillsApiProcessing || !billListFiltersFormInstance.isFormValid()}
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
              onClick={() => billListFiltersFormInstance.resetForm()}
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
