import { FC, useCallback, useEffect } from 'react';
import { Box, List as MuiList, TextField, Button } from '@mui/material';
import Pagination from '../shared/Pagination';
import { listScrollTop, ReceiverListFilters } from '../../lib';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import { ReceiversApi } from '../../apis';
import ReceiversSkeleton from '../shared/ReceiversSkeleton';
import EmptyList from './EmptyList';
import Filter from '../shared/Filter';
import { ModalNames } from '../../store';
import ReceiverCard from '../shared/ReceiverCard';
import { selectReceiversList } from '../../store/selectors';
import { useSnackbar } from 'notistack';
import ResetStyleWithAnimation from '../shared/ResetStyleWithAnimation';

const List: FC = () => {
  const request = useRequest();
  const actions = useAction();
  const selectors = useSelector();
  const snackbar = useSnackbar();
  const receiverListFiltersFormInstance = useForm(ReceiverListFilters);
  const receiverListFiltersForm = receiverListFiltersFormInstance.getForm();
  const isInitialReceiversApiProcessing = request.isInitialApiProcessing(ReceiversApi);
  const isReceiversApiProcessing = request.isApiProcessing(ReceiversApi);
  const isInitialReceiversApiFailed = request.isInitialProcessingApiFailed(ReceiversApi);
  const isReceiversApiFailed = request.isProcessingApiFailed(ReceiversApi);
  const initialReceiversApiExceptionMessage = request.getInitialExceptionMessage(ReceiversApi);
  const receiversApiExceptionMessage = request.getExceptionMessage(ReceiversApi);
  const receiversList = selectReceiversList(selectors);

  useEffect(() => {
    actions.getInitialReceivers({ page: 1, take: receiversList.take });
  }, []);

  useEffect(() => {
    if (isInitialReceiversApiFailed) {
      snackbar.enqueueSnackbar({ message: initialReceiversApiExceptionMessage, variant: 'error' });
    } else if (isReceiversApiFailed) {
      snackbar.enqueueSnackbar({ message: receiversApiExceptionMessage, variant: 'error' });
    }
  }, [isInitialReceiversApiFailed, isReceiversApiFailed]);

  const changePage = useCallback(
    (page: number) => {
      if (receiversList.page === page || isReceiversApiProcessing) return;
      listScrollTop();
      actions.getReceivers({
        page,
        take: receiversList.take,
        filters: { q: receiverListFiltersForm.q.trim() },
      });
    },
    [isReceiversApiProcessing, receiverListFiltersForm, receiversList]
  );

  const receiverListFilterFormSubmition = useCallback(() => {
    receiverListFiltersFormInstance.onSubmit(() => {
      actions.getReceivers({
        page: 1,
        take: receiversList.take,
        filters: { q: receiverListFiltersForm.q.trim() },
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
              <ResetStyleWithAnimation key={index} sx={{ opacity: '1', transform: 'translateY(0)' }}>
                <Box
                  sx={{
                    opacity: '0',
                    transform: 'translateY(30px)',
                    transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                    transitionDelay: `${index * 0.02}s`,
                  }}
                >
                  <ReceiverCard index={index} receiver={receiver} list={receiversList} />
                </Box>
              </ResetStyleWithAnimation>
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
            id="_bank-service-receiver-filters-form-search"
            label="Search"
            variant="standard"
            type="text"
            fullWidth
            value={receiverListFiltersForm.q}
            onChange={(event) => receiverListFiltersFormInstance.onChange('q', event.target.value)}
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
