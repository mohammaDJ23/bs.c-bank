import { FC, useCallback, useEffect } from 'react';
import { Box, List as MuiList, TextField, Button } from '@mui/material';
import Pagination from '../shared/Pagination';
import { AllBillList, AllBillListFilters, getTime, isoDate, BillWithUserObj } from '../../lib';
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

  const getAllBillsList = useCallback(
    (options: Partial<AllBillsApiConstructorType> = {}) => {
      const apiData = Object.assign(
        { take: allBillListInfo.take, page: allBillListInfo.page, ...options },
        allBillListFiltersForm
      );
      const allBillsApi = new AllBillsApi<BillWithUserObj>(apiData);
      allBillsApi.setInitialApi(!!apiData.isInitialApi);

      request.build<[BillWithUserObj[], number], BillWithUserObj>(allBillsApi).then((response) => {
        const [list, total] = response.data;
        allBillListInstance.insertNewList({ list, total, page: apiData.page });
      });
    },
    [allBillListInfo, allBillListInstance, allBillListFiltersForm, request]
  );

  useEffect(() => {
    getAllBillsList({ isInitialApi: true });
  }, []);

  const changePage = useCallback(
    (newPage: number) => {
      allBillListInstance.onPageChange(newPage);

      if (allBillListInstance.isNewPageEqualToCurrentPage(newPage) || isAllBillsApiProcessing) return;

      if (!allBillListInstance.isNewPageExist(newPage)) getAllBillsList({ page: newPage });
    },
    [isAllBillsApiProcessing, allBillListInstance, getAllBillsList]
  );

  const allBillListFilterFormSubmition = useCallback(() => {
    allBillListFiltersFormInstance.onSubmit(() => {
      const newPage = 1;
      allBillListInstance.onPageChange(newPage);
      getAllBillsList({ page: newPage });
    });
  }, [allBillListFiltersFormInstance, allBillListInstance, getAllBillsList]);

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
