import { FC, useCallback, useEffect } from 'react';
import { Box, List as MuiList, TextField, Button } from '@mui/material';
import Pagination from '../shared/Pagination';
import { ConsumerList, ConsumerListFilters, ConsumerObj } from '../../lib';
import { useForm, usePaginationList, useRequest } from '../../hooks';
import { ConsumersApi } from '../../apis';
import ConsumersSkeleton from '../shared/ConsumersSkeleton';
import EmptyList from './EmptyList';
import Filter from '../shared/Filter';
import { ModalNames } from '../../store';
import ConsumerCard from '../shared/ConsumerCard';

const List: FC = () => {
  const request = useRequest();
  const consumerListInstance = usePaginationList(ConsumerList);
  const consumerListFiltersFormInstance = useForm(ConsumerListFilters);
  const consumerListFiltersForm = consumerListFiltersFormInstance.getForm();
  const isInitialConsumersApiProcessing = request.isInitialApiProcessing(ConsumersApi);
  const isConsumersApiProcessing = request.isApiProcessing(ConsumersApi);

  const getConsumersList = useCallback(
    async (api: ConsumersApi) =>
      request.build<[ConsumerObj[], number], ConsumerObj>(api).then((response) => response.data),
    [request]
  );

  useEffect(() => {
    const api = new ConsumersApi();
    api.setInitialApi();
    getConsumersList(api).then(([list, total]) => {
      consumerListInstance.updateAndConcatList(list, 1);
      consumerListInstance.updateTotal(total);
    });
  }, []);

  const changePage = useCallback(
    (newPage: number) => {
      consumerListInstance.updatePage(newPage);

      if (consumerListInstance.isNewPageEqualToCurrentPage(newPage) || isConsumersApiProcessing) return;

      if (!consumerListInstance.isNewPageExist(newPage)) {
        getConsumersList(
          new ConsumersApi({
            page: newPage,
            filters: {
              q: consumerListFiltersForm.q,
            },
          })
        ).then(([list, total]) => {
          consumerListInstance.updateAndConcatList(list, newPage);
          consumerListInstance.updatePage(newPage);
          consumerListInstance.updateTotal(total);
        });
      }
    },
    [isConsumersApiProcessing, consumerListInstance, consumerListFiltersForm, getConsumersList]
  );

  const consumerListFilterFormSubmition = useCallback(() => {
    consumerListFiltersFormInstance.onSubmit(() => {
      const newPage = 1;
      consumerListInstance.updatePage(newPage);
      getConsumersList(
        new ConsumersApi({
          page: newPage,
          filters: {
            q: consumerListFiltersForm.q,
          },
        })
      ).then(([list, total]) => {
        consumerListInstance.updateAndConcatList(list, newPage);
        consumerListInstance.updateTotal(total);
      });
    });
  }, [consumerListFiltersFormInstance, consumerListInstance, consumerListFiltersForm, getConsumersList]);

  return (
    <>
      {isInitialConsumersApiProcessing || isConsumersApiProcessing ? (
        <ConsumersSkeleton take={consumerListInstance.getTake()} />
      ) : consumerListInstance.isListEmpty() ? (
        <EmptyList />
      ) : (
        <>
          <MuiList>
            {consumerListInstance.getList().map((consumer, index) => (
              <ConsumerCard key={index} index={index} consumer={consumer} listInstance={consumerListInstance} />
            ))}
          </MuiList>

          {consumerListInstance.getTotal() > consumerListInstance.getTake() && (
            <Pagination
              page={consumerListInstance.getPage()}
              count={consumerListInstance.getCount()}
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
