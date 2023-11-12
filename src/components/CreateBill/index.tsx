import FormContainer from '../../layout/FormContainer';
import { Box, TextField, Button, Autocomplete, CircularProgress } from '@mui/material';
import {
  ConsumerList,
  ConsumerListFilters,
  ReceiverListFilters,
  ConsumerObj,
  CreateBill,
  ReceiverList,
  debounce,
  getTime,
  isoDate,
  ReceiverObj,
} from '../../lib';
import { useForm, useRequest, useFocus, usePaginationList } from '../../hooks';
import { ChangeEvent, FC, useCallback, useEffect, useRef, useState } from 'react';
import { ConsumersApi, CreateBillApi, ReceiversApi } from '../../apis';
import { useSnackbar } from 'notistack';
import Navigation from '../../layout/Navigation';

const CreateBillContent: FC = () => {
  const [consumers, setConsumers] = useState<string[]>([]);
  const [receviers, setReceivers] = useState<string[]>([]);
  const [isConsumerAutocompleteOpen, setIsConsumerAutocompleteOpen] = useState(false);
  const [isReceiverAutocompleteOpen, setIsReceiverAutocompleteOpen] = useState(false);
  const createBillFromInstance = useForm(CreateBill);
  const consumerListFiltersFormInstance = useForm(ConsumerListFilters);
  const receiverListFiltersFormInstance = useForm(ReceiverListFilters);
  const request = useRequest();
  const focus = useFocus();
  const isCreateBillApiProcessing = request.isApiProcessing(CreateBillApi);
  const isConsumersApiProcessing = request.isApiProcessing(ConsumersApi);
  const isReceiversApiProcessing = request.isApiProcessing(ReceiversApi);
  const createBillFrom = createBillFromInstance.getForm();
  const consumerListFiltersForm = consumerListFiltersFormInstance.getForm();
  const receiverListFiltersForm = receiverListFiltersFormInstance.getForm();
  const consumerListInstance = usePaginationList(ConsumerList);
  const receiverlistInstance = usePaginationList(ReceiverList);
  const consumerListInfo = consumerListInstance.getFullInfo();
  const receiverListInfo = receiverlistInstance.getFullInfo();
  const snackbar = useSnackbar();
  const oneSecDebounce = useRef(debounce(1000));

  const formSubmition = useCallback(() => {
    createBillFromInstance.onSubmit(() => {
      request.build<CreateBill, CreateBill>(new CreateBillApi(createBillFrom)).then((response) => {
        createBillFromInstance.resetForm();
        snackbar.enqueueSnackbar({ message: 'Your bill was created successfully.', variant: 'success' });
      });
    });
  }, [createBillFromInstance, createBillFrom, request]);

  useEffect(() => {
    focus('amount');
  }, []);

  const onReceiverChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const q = event.target.value.trim();
      receiverListFiltersFormInstance.onChange('q', q);
      createBillFromInstance.onChange('receiver', q);

      oneSecDebounce.current(() => {
        receiverListFiltersFormInstance.onSubmit(() => {
          setIsReceiverAutocompleteOpen(true);
          const receiverApi = new ReceiversApi({
            take: receiverListInfo.take,
            page: receiverListInfo.page,
            filters: { q },
          });
          request.build<[ReceiverObj[], number]>(receiverApi).then((response) => {
            const [list] = response.data;
            const receivers: string[] = [];
            if (q.length) {
              receivers.splice(receivers.length, 0, q);
            }
            receivers.splice(receivers.length, 0, ...list.map((receiver) => receiver.name));
            const newReceivers = new Set(receivers);
            setReceivers(Array.from(newReceivers));
          });
        });
      });
    },
    [createBillFromInstance, receiverListFiltersFormInstance, receiverListInfo]
  );

  const onConsumerChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const q = event.target.value.trim();
      consumerListFiltersFormInstance.onChange('q', q);

      oneSecDebounce.current(() => {
        consumerListFiltersFormInstance.onSubmit(() => {
          setIsConsumerAutocompleteOpen(true);
          const consumersApi = new ConsumersApi({
            take: consumerListInfo.take,
            page: consumerListInfo.page,
            filters: { q },
          });
          request.build<[ConsumerObj[], number]>(consumersApi).then((response) => {
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
    [createBillFrom, consumerListFiltersFormInstance, consumerListInfo]
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
            onChange={(event) => createBillFromInstance.onChange('amount', Number(event.target.value).toString())}
            helperText={createBillFromInstance.getInputErrorMessage('amount')}
            error={createBillFromInstance.isInputInValid('amount')}
            disabled={isCreateBillApiProcessing}
            name="amount"
          />
          <Box position={'relative'}>
            <Autocomplete
              freeSolo
              open={isReceiverAutocompleteOpen}
              onBlur={() => {
                setReceivers([]);
                setIsReceiverAutocompleteOpen(false);
              }}
              value={createBillFrom.receiver}
              onChange={(event, value) => {
                value = value || '';
                createBillFromInstance.onChange('receiver', value);
                receiverListFiltersFormInstance.onChange('q', '');
                setReceivers([]);
                setIsReceiverAutocompleteOpen(false);
              }}
              disabled={isCreateBillApiProcessing}
              options={receviers}
              filterOptions={(options) => options}
              getOptionLabel={(option) => option}
              clearIcon={false}
              clearOnBlur
              clearOnEscape
              blurOnSelect
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{}}
                  onBlur={(event) => {
                    receiverListFiltersFormInstance.onChange('q', '');
                  }}
                  onFocus={() => {
                    setReceivers([]);
                    setIsReceiverAutocompleteOpen(false);
                  }}
                  variant="standard"
                  label="Receiver"
                  value={receiverListFiltersForm.q}
                  onChange={onReceiverChange}
                  error={
                    createBillFromInstance.isInputInValid('receiver') ||
                    receiverListFiltersFormInstance.isInputInValid('q')
                  }
                  helperText={
                    createBillFromInstance.getInputErrorMessage('receiver') ||
                    receiverListFiltersFormInstance.getInputErrorMessage('q')
                  }
                />
              )}
            />
            {isReceiversApiProcessing && (
              <CircularProgress size={20} sx={{ position: 'absolute', zIndex: '1', right: 0, top: '20px' }} />
            )}
          </Box>
          <Box position={'relative'}>
            <Autocomplete
              multiple
              freeSolo
              open={isConsumerAutocompleteOpen}
              onBlur={() => {
                setConsumers([]);
                setIsConsumerAutocompleteOpen(false);
              }}
              value={createBillFrom.consumers}
              onChange={(event, value) => {
                createBillFromInstance.onChange('consumers', value);
                setConsumers([]);
                setIsConsumerAutocompleteOpen(false);
              }}
              disabled={isCreateBillApiProcessing}
              options={consumers}
              filterOptions={(options) => options}
              getOptionLabel={(option) => option}
              clearIcon={false}
              clearOnBlur
              clearOnEscape
              blurOnSelect
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{}}
                  onFocus={() => {
                    setConsumers([]);
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
