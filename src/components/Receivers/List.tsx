import { FC, useCallback, useEffect } from 'react';
import { Box, List as MuiList, TextField, Button } from '@mui/material';
import Pagination from '../shared/Pagination';
import { ReceiverListFilters } from '../../lib';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import { ReceiversApi } from '../../apis';
import ReceiversSkeleton from '../shared/ReceiversSkeleton';
import EmptyList from './EmptyList';
import Filter from '../shared/Filter';
import { ModalNames } from '../../store';
import ReceiverCard from '../shared/ReceiverCard';
import { selectReceiversList } from '../../store/selectors';

const List: FC = () => {
  const request = useRequest();
  const actions = useAction();
  const selectors = useSelector();
  const receiverListFiltersFormInstance = useForm(ReceiverListFilters);
  const receiverListFiltersForm = receiverListFiltersFormInstance.getForm();
  const isInitialReceiversApiProcessing = request.isInitialApiProcessing(ReceiversApi);
  const isReceiversApiProcessing = request.isApiProcessing(ReceiversApi);
  const receiversList = selectReceiversList(selectors);

  useEffect(() => {
    actions.getInitialReceivers({ page: 1, take: receiversList.take });
  }, []);

  const changePage = useCallback(
    (page: number) => {
      if (receiversList.page === page || isReceiversApiProcessing) return;
      actions.getReceivers({
        page,
        take: receiversList.take,
        filters: { q: receiverListFiltersForm.q },
      });
    },
    [isReceiversApiProcessing, receiverListFiltersForm, receiversList]
  );

  const receiverListFilterFormSubmition = useCallback(() => {
    receiverListFiltersFormInstance.onSubmit(() => {
      actions.getReceivers({
        page: 1,
        take: receiversList.take,
        filters: { q: receiverListFiltersForm.q },
      });
    });
  }, [receiverListFiltersFormInstance, receiverListFiltersForm, receiversList]);

  return (
    <>
      {isInitialReceiversApiProcessing || isReceiversApiProcessing ? (
        <ReceiversSkeleton take={receiversList.take} />
      ) : receiversList.total <= 0 ? (
        <EmptyList />
      ) : (
        <>
          <MuiList>
            {receiversList.list.map((receiver, index) => (
              <ReceiverCard key={index} index={index} receiver={receiver} list={receiversList} />
            ))}
          </MuiList>
          {receiversList.take < receiversList.total && (
            <Pagination
              page={receiversList.page}
              count={Math.ceil(receiversList.total / receiversList.take)}
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
