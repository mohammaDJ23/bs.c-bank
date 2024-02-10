import { FC, useCallback, useEffect } from 'react';
import { Box, List as MuiList, TextField, Button } from '@mui/material';
import Pagination from '../shared/Pagination';
import { BillList, BillListFilters, BillObj, getTime, isoDate } from '../../lib';
import { useForm, usePaginationList, useRequest } from '../../hooks';
import { BillsApi, BillsApiConstructorType } from '../../apis';
import BillsSkeleton from '../shared/BillsSkeleton';
import EmptyList from './EmptyList';
import Filter from '../shared/Filter';
import { ModalNames } from '../../store';
import BillCard from '../shared/BiilCard';

const List: FC = () => {
  const request = useRequest();
  const billListInstance = usePaginationList(BillList);
  const billListFiltersFormInstance = useForm(BillListFilters);
  const billListFiltersForm = billListFiltersFormInstance.getForm();
  const isInitialBillsApiProcessing = request.isInitialApiProcessing(BillsApi);
  const isBillsApiProcessing = request.isApiProcessing(BillsApi);

  const getBillsListApi = useCallback(
    (options: Partial<BillsApiConstructorType> = {}) => {
      return new BillsApi({
        take: billListInstance.getTake(),
        page: billListInstance.getPage(),
        filters: {
          q: billListFiltersForm.q,
          fromDate: billListFiltersForm.fromDate,
          toDate: billListFiltersForm.toDate,
        },
        ...options,
      });
    },
    [billListFiltersForm]
  );

  const getBillsList = useCallback(
    (api: BillsApi) => {
      request.build<[BillObj[], number], BillObj>(api).then((response) => {
        const [list, total] = response.data;
        billListInstance.updateAndConcatList(list, api.api.params.page);
        billListInstance.updatePage(api.api.params.page);
        billListInstance.updateTotal(total);
      });
    },
    [billListInstance, billListFiltersForm, request]
  );

  useEffect(() => {
    const api = getBillsListApi();
    api.setInitialApi();
    getBillsList(api);
  }, []);

  const changePage = useCallback(
    (newPage: number) => {
      billListInstance.updatePage(newPage);

      if (billListInstance.isNewPageEqualToCurrentPage(newPage) || isBillsApiProcessing) return;

      if (!billListInstance.isNewPageExist(newPage)) {
        const api = getBillsListApi({ page: newPage });
        getBillsList(api);
      }
    },
    [isBillsApiProcessing, billListInstance, getBillsList]
  );

  const billListFilterFormSubmition = useCallback(() => {
    billListFiltersFormInstance.onSubmit(() => {
      const newPage = 1;
      billListInstance.updatePage(newPage);
      const api = getBillsListApi({ page: newPage });
      getBillsList(api);
    });
  }, [billListFiltersFormInstance, billListInstance, getBillsList]);

  return (
    <>
      {isInitialBillsApiProcessing || isBillsApiProcessing ? (
        <BillsSkeleton take={billListInstance.getTake()} />
      ) : billListInstance.isListEmpty() ? (
        <EmptyList />
      ) : (
        <>
          <MuiList>
            {billListInstance.getList().map((bill, index) => (
              <BillCard key={index} index={index} bill={bill} listInstance={billListInstance} />
            ))}
          </MuiList>

          {billListInstance.getTotal() > billListInstance.getTake() && (
            <Pagination
              page={billListInstance.getPage()}
              count={billListInstance.getCount()}
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
