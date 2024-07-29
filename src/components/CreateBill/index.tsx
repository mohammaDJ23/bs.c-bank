import { v4 as uuid } from 'uuid';
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
  LocationListFilters,
  LocationList,
  LocationObj,
  wait,
} from '../../lib';
import { useForm, useRequest, useFocus, usePaginationList } from '../../hooks';
import { ChangeEvent, FC, useCallback, useEffect, useRef, useState } from 'react';
import { ConsumersApi, CreateBillApi, LocationsApi, ReceiversApi } from '../../apis';
import { useSnackbar } from 'notistack';
import Navigation from '../../layout/Navigation';

const CreateBillContent: FC = () => {
  const [consumers, setConsumers] = useState<string[]>([]);
  const [receviers, setReceivers] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [isConsumerAutocompleteOpen, setIsConsumerAutocompleteOpen] = useState(false);
  const [isReceiverAutocompleteOpen, setIsReceiverAutocompleteOpen] = useState(false);
  const [isLocationAutocompleteOpen, setIsLocationAutocompleteOpen] = useState(false);
  const createBillFromInstance = useForm(CreateBill);
  const consumerListFiltersFormInstance = useForm(ConsumerListFilters);
  const receiverListFiltersFormInstance = useForm(ReceiverListFilters);
  const locationListFiltersFormInstance = useForm(LocationListFilters);
  const request = useRequest();
  const focus = useFocus();
  const isCreateBillApiProcessing = request.isApiProcessing(CreateBillApi);
  const isConsumersApiProcessing = request.isApiProcessing(ConsumersApi);
  const isReceiversApiProcessing = request.isApiProcessing(ReceiversApi);
  const isLocationsApiProcessing = request.isApiProcessing(LocationsApi);
  const createBillFrom = createBillFromInstance.getForm();
  const consumerListFiltersForm = consumerListFiltersFormInstance.getForm();
  const receiverListFiltersForm = receiverListFiltersFormInstance.getForm();
  const locationListFiltersForm = locationListFiltersFormInstance.getForm();
  const consumerListInstance = usePaginationList(ConsumerList);
  const receiverlistInstance = usePaginationList(ReceiverList);
  const locationListInstance = usePaginationList(LocationList);
  const snackbar = useSnackbar();
  const oneQuarterDebounce = useRef(debounce(250));
  const formElIdRef = useRef(uuid());

  const formSubmition = useCallback(() => {
    createBillFromInstance.onSubmit(() => {
      request.build<CreateBill, CreateBill>(new CreateBillApi(createBillFrom)).then((response) => {
        createBillFromInstance.resetForm();
        snackbar.enqueueSnackbar({ message: 'Your bill was created successfully.', variant: 'success' });
        focus('amount');
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

      oneQuarterDebounce.current(() => {
        receiverListFiltersFormInstance.onSubmit(() => {
          setIsReceiverAutocompleteOpen(true);
          const receiverApi = new ReceiversApi({
            take: receiverlistInstance.getTake(),
            page: receiverlistInstance.getPage(),
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
    [createBillFromInstance, receiverListFiltersFormInstance]
  );

  const onLocationChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const q = event.target.value.trim();
      locationListFiltersFormInstance.onChange('q', q);
      createBillFromInstance.onChange('location', q);

      oneQuarterDebounce.current(() => {
        locationListFiltersFormInstance.onSubmit(() => {
          setIsLocationAutocompleteOpen(true);
          const locationApi = new LocationsApi({
            take: locationListInstance.getTake(),
            page: locationListInstance.getPage(),
            filters: { q },
          });
          request.build<[LocationObj[], number]>(locationApi).then((response) => {
            const [list] = response.data;
            const locations: string[] = [];
            if (q.length) {
              locations.splice(locations.length, 0, q);
            }
            locations.splice(locations.length, 0, ...list.map((location) => location.name));
            const newLocations = new Set(locations);
            setLocations(Array.from(newLocations));
          });
        });
      });
    },
    [createBillFromInstance, receiverListFiltersFormInstance]
  );

  const onConsumerChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const q = event.target.value.trim();
      consumerListFiltersFormInstance.onChange('q', q);

      oneQuarterDebounce.current(() => {
        consumerListFiltersFormInstance.onSubmit(() => {
          setIsConsumerAutocompleteOpen(true);
          const consumersApi = new ConsumersApi({
            take: consumerListInstance.getTake(),
            page: consumerListInstance.getPage(),
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
    [createBillFrom, consumerListFiltersFormInstance]
  );

  useEffect(() => {
    (async () => {
      let el = document.getElementById(formElIdRef.current);
      if (el) {
        for (const node of Array.from(el.childNodes)) {
          // @ts-ignore
          node.style.transition = 'opacity 0.2s, transform 0.3s';
          // @ts-ignore
          node.style.opacity = 1;
          // @ts-ignore
          node.style.transform = 'translateX(0)';

          await wait();
        }
      }
    })();
  }, []);

  return (
    <Navigation>
      <FormContainer>
        <Box
          component="form"
          noValidate
          id={formElIdRef.current}
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
            sx={{ opacity: 0, transform: 'translateX(10px)' }}
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
          <Box position={'relative'} sx={{ opacity: 0, transform: 'translateX(20px)' }}>
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
          <Box position={'relative'} sx={{ opacity: 0, transform: 'translateX(30px)' }}>
            <Autocomplete
              freeSolo
              open={isLocationAutocompleteOpen}
              onBlur={() => {
                setLocations([]);
                setIsLocationAutocompleteOpen(false);
              }}
              value={createBillFrom.location}
              onChange={(event, value) => {
                value = value || '';
                createBillFromInstance.onChange('location', value);
                locationListFiltersFormInstance.onChange('q', '');
                setLocations([]);
                setIsLocationAutocompleteOpen(false);
              }}
              disabled={isCreateBillApiProcessing}
              options={locations}
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
                    locationListFiltersFormInstance.onChange('q', '');
                  }}
                  onFocus={() => {
                    setLocations([]);
                    setIsLocationAutocompleteOpen(false);
                  }}
                  variant="standard"
                  label="Location"
                  value={locationListFiltersForm.q}
                  onChange={onLocationChange}
                  error={
                    createBillFromInstance.isInputInValid('location') ||
                    locationListFiltersFormInstance.isInputInValid('q')
                  }
                  helperText={
                    createBillFromInstance.getInputErrorMessage('location') ||
                    locationListFiltersFormInstance.getInputErrorMessage('q')
                  }
                />
              )}
            />
            {isLocationsApiProcessing && (
              <CircularProgress size={20} sx={{ position: 'absolute', zIndex: '1', right: 0, top: '20px' }} />
            )}
          </Box>
          <Box position={'relative'} sx={{ opacity: 0, transform: 'translateX(40px)' }}>
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
            sx={{ opacity: 0, transform: 'translateX(50px)' }}
            label="Date"
            type="date"
            variant="standard"
            value={createBillFrom.date ? isoDate(createBillFrom.date) : 'undefined'}
            onChange={(event) =>
              createBillFromInstance.onChange('date', event.target.value ? getTime(event.target.value) : null)
            }
            helperText={createBillFromInstance.getInputErrorMessage('date')}
            error={createBillFromInstance.isInputInValid('date')}
            InputLabelProps={{ shrink: true }}
            disabled={isCreateBillApiProcessing}
          />
          <TextField
            sx={{ opacity: 0, transform: 'translateX(60px)' }}
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
          <Box
            component="div"
            display="flex"
            alignItems="center"
            gap="10px"
            marginTop="20px"
            sx={{ opacity: 0, transform: 'translateX(70px)' }}
          >
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
