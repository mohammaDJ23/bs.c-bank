import { FC, useCallback, useEffect } from 'react';
import { Box, List as MuiList, TextField, Button } from '@mui/material';
import Pagination from '../shared/Pagination';
import { ReceiverList, ReceiverListFilters, ReceiverObj } from '../../lib';
import { useForm, usePaginationList, useRequest } from '../../hooks';
import { ReceiversApi } from '../../apis';
import ReceiversSkeleton from '../shared/ReceiversSkeleton';
import EmptyList from './EmptyList';
import Filter from '../shared/Filter';
import { ModalNames } from '../../store';
import ReceiverCard from '../shared/ReceiverCard';

const List: FC = () => {
  const request = useRequest();
  const receiverListInstance = usePaginationList(ReceiverList);
  const receiverListFiltersFormInstance = useForm(ReceiverListFilters);
  const receiverListFiltersForm = receiverListFiltersFormInstance.getForm();
  const isInitialReceiversApiProcessing = request.isInitialApiProcessing(ReceiversApi);
  const isReceiversApiProcessing = request.isApiProcessing(ReceiversApi);

  const getReceiversList = useCallback(
    async (api: ReceiversApi) =>
      request.build<[ReceiverObj[], number], ReceiverObj>(api).then((response) => response.data),
    [request]
  );

  useEffect(() => {
    const api = new ReceiversApi();
    api.setInitialApi();
    getReceiversList(api).then(([list, total]) => {
      receiverListInstance.updateAndConcatList(list, 1);
      receiverListInstance.updateTotal(total);
    });
  }, []);

  const changePage = useCallback(
    (newPage: number) => {
      receiverListInstance.updatePage(newPage);

      if (receiverListInstance.isNewPageEqualToCurrentPage(newPage) || isReceiversApiProcessing) return;

      if (!receiverListInstance.isNewPageExist(newPage)) {
        getReceiversList(new ReceiversApi({ page: newPage })).then(([list, total]) => {
          receiverListInstance.updateAndConcatList(list, newPage);
          receiverListInstance.updatePage(newPage);
          receiverListInstance.updateTotal(total);
        });
      }
    },
    [isReceiversApiProcessing, receiverListInstance, getReceiversList]
  );

  const receiverListFilterFormSubmition = useCallback(() => {
    receiverListFiltersFormInstance.onSubmit(() => {
      const newPage = 1;
      receiverListInstance.updatePage(newPage);
      getReceiversList(new ReceiversApi({ page: newPage })).then(([list, total]) => {
        receiverListInstance.updateAndConcatList(list, newPage);
        receiverListInstance.updateTotal(total);
      });
    });
  }, [receiverListFiltersFormInstance, receiverListInstance, getReceiversList]);

  return (
    <>
      {isInitialReceiversApiProcessing || isReceiversApiProcessing ? (
        <ReceiversSkeleton take={receiverListInstance.getTake()} />
      ) : receiverListInstance.isListEmpty() ? (
        <EmptyList />
      ) : (
        <>
          <MuiList>
            {receiverListInstance.getList().map((receiver, index) => (
              <ReceiverCard key={index} index={index} receiver={receiver} listInstance={receiverListInstance} />
            ))}
          </MuiList>

          {receiverListInstance.getTotal() > receiverListInstance.getTake() && (
            <Pagination
              page={receiverListInstance.getPage()}
              count={receiverListInstance.getCount()}
              onPageChange={changePage}
            />
          )}
        </>
      )}

      <Filter name={ModalNames.RECEIVER_FILTERS}>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          display="flex"
          flexDirection="column"
          gap="20px"
          onSubmit={(event) => {
            event.preventDefault();
            receiverListFilterFormSubmition();
          }}
        >
          <TextField
            label="Search"
            variant="standard"
            type="text"
            fullWidth
            value={receiverListFiltersForm.q}
            onChange={(event) => receiverListFiltersFormInstance.onChange('q', event.target.value.trim())}
            helperText={receiverListFiltersFormInstance.getInputErrorMessage('q')}
            error={receiverListFiltersFormInstance.isInputInValid('q')}
            name="q"
            placeholder="name"
            disabled={isReceiversApiProcessing}
          />
          <Box component="div" display="flex" alignItems="center" gap="10px" marginTop="20px">
            <Button
              disabled={isReceiversApiProcessing || !receiverListFiltersFormInstance.isFormValid()}
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
              onClick={() => receiverListFiltersFormInstance.resetForm()}
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
