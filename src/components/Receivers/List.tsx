import { FC, useCallback, useEffect } from 'react';
import { Box, List as MuiList, TextField, Button } from '@mui/material';
import Pagination from '../shared/Pagination';
import { ReceiverList, ReceiverListFilters, ReceiverObj } from '../../lib';
import { useForm, usePaginationList, useRequest } from '../../hooks';
import { ReceiversApi, ReceiversApiConstructorType } from '../../apis';
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

  const getReceiversListApi = useCallback(
    (options: Partial<ReceiversApiConstructorType> = {}) => {
      return new ReceiversApi({
        take: receiverListInstance.getTake(),
        page: receiverListInstance.getPage(),
        filters: {
          q: receiverListFiltersForm.q,
        },
        ...options,
      });
    },
    [receiverListFiltersForm]
  );

  const getReceiversList = useCallback(
    (api: ReceiversApi) => {
      request.build<[ReceiverObj[], number], ReceiverObj>(api).then((response) => {
        const [list, total] = response.data;
        receiverListInstance.updateAndConcatList(list, api.api.params.page);
        receiverListInstance.updatePage(api.api.params.page);
        receiverListInstance.updateTotal(total);
      });
    },
    [receiverListInstance, receiverListFiltersForm, request]
  );

  useEffect(() => {
    const api = getReceiversListApi();
    api.setInitialApi();
    getReceiversList(api);
  }, []);

  const changePage = useCallback(
    (newPage: number) => {
      receiverListInstance.updatePage(newPage);

      if (receiverListInstance.isNewPageEqualToCurrentPage(newPage) || isReceiversApiProcessing) return;

      if (!receiverListInstance.isNewPageExist(newPage)) {
        const api = getReceiversListApi({ page: newPage });
        getReceiversList(api);
      }
    },
    [isReceiversApiProcessing, receiverListInstance, getReceiversList]
  );

  const receiverListFilterFormSubmition = useCallback(() => {
    receiverListFiltersFormInstance.onSubmit(() => {
      const newPage = 1;
      receiverListInstance.updatePage(newPage);
      const api = getReceiversListApi({ page: newPage });
      getReceiversList(api);
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
