import FormContainer from '../../layout/FormContainer';
import { Box, TextField, Button, Autocomplete, CircularProgress } from '@mui/material';
import { ConsumerList, ConsumerListFilters, ConsumerObj, CreateBill, debounce, getTime, isoDate } from '../../lib';
import { useForm, useRequest, useFocus, usePaginationList } from '../../hooks';
import { ChangeEvent, FC, useCallback, useEffect, useRef, useState } from 'react';
import { ConsumersApi, CreateBillApi } from '../../apis';
import { useSnackbar } from 'notistack';
import Navigation from '../../layout/Navigation';

const CreateBillContent: FC = () => {
  const [consumers, setConsumers] = useState<string[]>([]);
  const [isConsumerAutocompleteOpen, setIsConsumerAutocompleteOpen] = useState(false);
  const createBillFromInstance = useForm(CreateBill);
  const consumerListFiltersFormInstance = useForm(ConsumerListFilters);
  const { isApiProcessing, request } = useRequest();
  const { focus } = useFocus();
  const isCreateBillApiProcessing = isApiProcessing(CreateBillApi);
  const isConsumersApiProcessing = isApiProcessing(ConsumersApi);
  const createBillFrom = createBillFromInstance.getForm();
  const consumerListFiltersForm = consumerListFiltersFormInstance.getForm();
  const consumerListInstance = usePaginationList(ConsumerList);
  const consumerListInfo = consumerListInstance.getFullInfo();
  const { enqueueSnackbar } = useSnackbar();
  const oneSecDebounce = useRef(debounce(1000));

  const formSubmition = useCallback(() => {
    createBillFromInstance.onSubmit(() => {
      request<CreateBill, CreateBill>(new CreateBillApi(createBillFrom)).then((response) => {
        createBillFromInstance.resetForm();
        enqueueSnackbar({ message: 'Your bill was created successfully.', variant: 'success' });
      });
    });
  }, [createBillFromInstance, createBillFrom, request]);

  useEffect(() => {
    focus('amount');
  }, []);

  const onConsumerChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const q = event.target.value.trim();
      consumerListFiltersFormInstance.onChange('q', q);

      oneSecDebounce.current(() => {
        consumerListFiltersFormInstance.onSubmit(() => {
          setIsConsumerAutocompleteOpen(true);
          const consumersApi = new ConsumersApi<ConsumerObj>({
            take: consumerListInfo.take,
            page: consumerListInfo.page,
            q,
          });
          request<[ConsumerObj[], number], ConsumerObj>(consumersApi).then((response) => {
            const [list] = response.data;
            const consumers: string[] = [];
            if (q.length) {
              consumers.splice(consumers.length, 0, q);
            }
            consumers.splice(consumers.length, 0, ...createBillFrom.consumers);
            consumers.splice(consumers.length, 0, ...list.map((consumer) => consumer.name));
            const newConsumers = new Set(consumers);
            setConsumers(Array.from(newConsumers));
          });
        });
      });
    },
    [createBillFrom, consumerListInfo]
  );

  return (
    <Navigation>
      <FormContainer>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          display="flex"
          flexDirection="column"
          gap="20px"
          onSubmit={(event) => {
            event.preventDefault();
            formSubmition();
          }}
        >
          <TextField
            label="Amount"
            variant="standard"
            type="number"
            value={createBillFrom.amount}
            onChange={(event) => createBillFromInstance.onChange('amount', event.target.value)}
            helperText={createBillFromInstance.getInputErrorMessage('amount')}
            error={createBillFromInstance.isInputInValid('amount')}
            disabled={isCreateBillApiProcessing}
            name="amount"
          />
          <TextField
            label="Receiver"
            variant="standard"
            type="text"
            value={createBillFrom.receiver}
            onChange={(event) => createBillFromInstance.onChange('receiver', event.target.value)}
            helperText={createBillFromInstance.getInputErrorMessage('receiver')}
            error={createBillFromInstance.isInputInValid('receiver')}
            disabled={isCreateBillApiProcessing}
          />
          <Box position={'relative'}>
            <Autocomplete
              multiple
              freeSolo
              open={isConsumerAutocompleteOpen}
              onBlur={() => {
                consumerListInstance.setList(new ConsumerList());
                setIsConsumerAutocompleteOpen(false);
              }}
              value={createBillFrom.consumers}
              onChange={(event, value) => {
                createBillFromInstance.onChange('consumers', value);
                consumerListInstance.setList(new ConsumerList());
                setIsConsumerAutocompleteOpen(false);
              }}
              disabled={isCreateBillApiProcessing}
              options={consumers}
              filterOptions={(options) => options}
              getOptionLabel={(option) => option}
              clearIcon={false}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{}}
                  onFocus={() => {
                    consumerListInstance.setList(new ConsumerList());
                    setIsConsumerAutocompleteOpen(false);
                  }}
                  variant="standard"
                  label="Consumers"
                  value={consumerListFiltersForm.q}
                  onChange={onConsumerChange}
                  error={
                    createBillFromInstance.isInputInValid('consumers') ||
                    consumerListFiltersFormInstance.isInputInValid('q')
                  }
                  helperText={
                    createBillFromInstance.getInputErrorMessage('consumers') ||
                    consumerListFiltersFormInstance.getInputErrorMessage('q')
                  }
                />
              )}
            />
            {isConsumersApiProcessing && (
              <CircularProgress size={20} sx={{ position: 'absolute', zIndex: '1', right: 0, top: '20px' }} />
            )}
          </Box>
          <TextField
            label="Date"
            type="date"
            variant="standard"
            value={isoDate(createBillFrom.date)}
            onChange={(event) => createBillFromInstance.onChange('date', getTime(event.target.value))}
            helperText={createBillFromInstance.getInputErrorMessage('date')}
            error={createBillFromInstance.isInputInValid('date')}
            InputLabelProps={{ shrink: true }}
            disabled={isCreateBillApiProcessing}
          />
          <TextField
            label="Description"
            type="text"
            rows="5"
            multiline
            variant="standard"
            value={createBillFrom.description}
            onChange={(event) => createBillFromInstance.onChange('description', event.target.value)}
            helperText={createBillFromInstance.getInputErrorMessage('description')}
            error={createBillFromInstance.isInputInValid('description')}
            disabled={isCreateBillApiProcessing}
          />
          <Box component="div" display="flex" alignItems="center" gap="10px" marginTop="20px">
            <Button
              disabled={isCreateBillApiProcessing || !createBillFromInstance.isFormValid()}
              variant="contained"
              size="small"
              type="submit"
              sx={{ textTransform: 'capitalize' }}
            >
              Create
            </Button>
            <Button
              disabled={isCreateBillApiProcessing}
              variant="outlined"
              size="small"
              type="button"
              sx={{ textTransform: 'capitalize' }}
              onClick={() => createBillFromInstance.resetForm()}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </FormContainer>
    </Navigation>
  );
};

export default CreateBillContent;
