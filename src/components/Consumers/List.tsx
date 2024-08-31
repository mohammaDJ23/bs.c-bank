import { FC, useCallback, useEffect } from 'react';
import { Box, List as MuiList, TextField, Button } from '@mui/material';
import Pagination from '../shared/Pagination';
import { ConsumerListFilters } from '../../lib';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import { ConsumersApi } from '../../apis';
import ConsumersSkeleton from '../shared/ConsumersSkeleton';
import EmptyList from './EmptyList';
import Filter from '../shared/Filter';
import { ModalNames } from '../../store';
import ConsumerCard from '../shared/ConsumerCard';
import { selectConsumersList } from '../../store/selectors';
import { useSnackbar } from 'notistack';
import ResetStyleWithAnimation from '../shared/ResetStyleWithAnimation';

const List: FC = () => {
  const actions = useAction();
  const selectors = useSelector();
  const request = useRequest();
  const snackbar = useSnackbar();
  const consumerListFiltersFormInstance = useForm(ConsumerListFilters);
  const consumerListFiltersForm = consumerListFiltersFormInstance.getForm();
  const isInitialConsumersApiProcessing = request.isInitialApiProcessing(ConsumersApi);
  const isInitailConsumersApiFailed = request.isInitialProcessingApiFailed(ConsumersApi);
  const initialConsumersApiExceptionMessage = request.getInitialExceptionMessage(ConsumersApi);
  const isConsumersApiProcessing = request.isApiProcessing(ConsumersApi);
  const isConsumersApiFailed = request.isProcessingApiFailed(ConsumersApi);
  const consumersApiExceptionMessage = request.getExceptionMessage(ConsumersApi);
  const consumersList = selectConsumersList(selectors);

  useEffect(() => {
    actions.getInitialConsumers({ page: 1, take: consumersList.take });
  }, []);

  useEffect(() => {
    if (isInitailConsumersApiFailed) {
      snackbar.enqueueSnackbar({ message: initialConsumersApiExceptionMessage, variant: 'error' });
    } else if (isConsumersApiFailed) {
      snackbar.enqueueSnackbar({ message: consumersApiExceptionMessage, variant: 'error' });
    }
  }, [isInitailConsumersApiFailed, isConsumersApiFailed]);

  const changePage = useCallback(
    (page: number) => {
      if (consumersList.page === page || isConsumersApiProcessing) return;
      actions.getConsumers({
        page,
        take: consumersList.take,
        filters: { q: consumerListFiltersForm.q },
      });
    },
    [isConsumersApiProcessing, consumersList, consumerListFiltersForm]
  );

  const consumerListFilterFormSubmition = useCallback(() => {
    consumerListFiltersFormInstance.onSubmit(() => {
      actions.getConsumers({
        page: 1,
        take: consumersList.take,
        filters: { q: consumerListFiltersForm.q },
      });
    });
  }, [consumerListFiltersFormInstance, consumersList, consumerListFiltersForm]);

  return (
    <>
      {isInitialConsumersApiProcessing || isConsumersApiProcessing ? (
        <ConsumersSkeleton take={consumersList.take} />
      ) : consumersList.total <= 0 ? (
        <EmptyList />
      ) : (
        <>
          <MuiList>
            {consumersList.list.map((consumer, index) => (
              <ResetStyleWithAnimation key={index} sx={{ opacity: '1', transform: 'translateY(0)' }}>
                <Box
                  sx={{
                    opacity: '0',
                    transform: 'translateY(30px)',
                    transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                    transitionDelay: `${index * 0.02}s`,
                  }}
                >
                  <ConsumerCard index={index} consumer={consumer} list={consumersList} />
                </Box>
              </ResetStyleWithAnimation>
            ))}
          </MuiList>

          {consumersList.take < consumersList.total && (
            <Pagination
              page={consumersList.page}
              count={Math.ceil(consumersList.total / consumersList.take)}
              onPageChange={changePage}
            />
          )}
        </>
      )}

      <Filter name={ModalNames.CONSUMER_FILTERS}>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          display="flex"
          flexDirection="column"
          gap="20px"
          onSubmit={(event) => {
            event.preventDefault();
            consumerListFilterFormSubmition();
          }}
        >
          <TextField
            label="Search"
            variant="standard"
            type="text"
            fullWidth
            value={consumerListFiltersForm.q}
            onChange={(event) => consumerListFiltersFormInstance.onChange('q', event.target.value.trim())}
            helperText={consumerListFiltersFormInstance.getInputErrorMessage('q')}
            error={consumerListFiltersFormInstance.isInputInValid('q')}
            name="q"
            placeholder="name"
            disabled={isConsumersApiProcessing}
          />
          <Box component="div" display="flex" alignItems="center" gap="10px" marginTop="20px">
            <Button
              disabled={isConsumersApiProcessing || !consumerListFiltersFormInstance.isFormValid()}
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
              onClick={() => consumerListFiltersFormInstance.resetForm()}
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
