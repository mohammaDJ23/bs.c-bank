import FormContainer from '../../layout/FormContainer';
import { Box, TextField, Button, Autocomplete, CircularProgress } from '@mui/material';
import {
  ConsumerListFilters,
  ReceiverListFilters,
  CreateBill,
  debounce,
  getTime,
  isoDate,
  LocationListFilters,
} from '../../lib';
import { useForm, useRequest, useFocus, useSelector, useAction } from '../../hooks';
import { ChangeEvent, FC, useCallback, useEffect, useRef, useState } from 'react';
import { ConsumersApi, CreateBillApi, LocationsApi, ReceiversApi } from '../../apis';
import { useSnackbar } from 'notistack';
import Navigation from '../../layout/Navigation';
import { selectConsumersList, selectLocationsList, selectReceiversList } from '../../store/selectors';
import ResetStyleWithAnimation from '../shared/ResetStyleWithAnimation';

const CreateBillContent: FC = () => {
  const selectors = useSelector();
  const actions = useAction();
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
  const isCreateBillApiSuccess = request.isProcessingApiSuccessed(CreateBillApi);
  const isCreateBillApiFailed = request.isProcessingApiFailed(CreateBillApi);
  const createBillExceptionMessage = request.getExceptionMessage(CreateBillApi);
  const isConsumersApiProcessing = request.isApiProcessing(ConsumersApi);
  const isReceiversApiProcessing = request.isApiProcessing(ReceiversApi);
  const isLocationsApiProcessing = request.isApiProcessing(LocationsApi);
  const createBillFrom = createBillFromInstance.getForm();
  const consumerListFiltersForm = consumerListFiltersFormInstance.getForm();
  const receiverListFiltersForm = receiverListFiltersFormInstance.getForm();
  const locationListFiltersForm = locationListFiltersFormInstance.getForm();
  const consumersList = selectConsumersList(selectors);
  const receiverslist = selectReceiversList(selectors);
  const locationsList = selectLocationsList(selectors);
  const snackbar = useSnackbar();
  const oneQuarterDebounce = useRef(debounce(250));

  const formSubmition = useCallback(() => {
    createBillFromInstance.onSubmit(() => {
      actions.createBill(createBillFrom);
    });
  }, [createBillFromInstance, createBillFrom, request]);

  useEffect(() => {
    if (isCreateBillApiFailed) {
      snackbar.enqueueSnackbar({ message: createBillExceptionMessage, variant: 'error' });
    } else if (isCreateBillApiSuccess) {
      createBillFromInstance.resetForm();
      snackbar.enqueueSnackbar({ message: 'Your bill was created successfully.', variant: 'success' });
      focus('amount');
    }
  }, [isCreateBillApiSuccess, isCreateBillApiFailed]);

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
          actions.getReceivers({
            page: 1,
            take: receiverslist.take,
            filters: { q },
          });
        });
      });
    },
    [createBillFromInstance, receiverListFiltersFormInstance, receiverslist]
  );

  useEffect(() => {
    const receivers: string[] = [];
    if (receiverListFiltersForm.q.length) {
      receivers.splice(receivers.length, 0, receiverListFiltersForm.q);
    }
    receivers.splice(receivers.length, 0, ...receiverslist.list.map((receiver) => receiver.name));
    const newReceivers = new Set(receivers);
    setReceivers(Array.from(newReceivers));
  }, [receiverslist, receiverListFiltersForm]);

  const onLocationChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const q = event.target.value.trim();
      locationListFiltersFormInstance.onChange('q', q);
      createBillFromInstance.onChange('location', q);
      oneQuarterDebounce.current(() => {
        locationListFiltersFormInstance.onSubmit(() => {
          setIsLocationAutocompleteOpen(true);
          actions.getLocations({
            page: 1,
            take: locationsList.take,
            filters: { q },
          });
        });
      });
    },
    [createBillFromInstance, locationListFiltersFormInstance, locationsList]
  );

  useEffect(() => {
    const locations: string[] = [];
    if (locationListFiltersForm.q.length) {
      locations.splice(locations.length, 0, locationListFiltersForm.q);
    }
    locations.splice(locations.length, 0, ...locationsList.list.map((location) => location.name));
    const newLocations = new Set(locations);
    setLocations(Array.from(newLocations));
  }, [locationsList, locationListFiltersForm]);

  const onConsumerChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const q = event.target.value.trim();
      consumerListFiltersFormInstance.onChange('q', q);
      oneQuarterDebounce.current(() => {
        consumerListFiltersFormInstance.onSubmit(() => {
          setIsConsumerAutocompleteOpen(true);
          actions.getConsumers({
            page: 1,
            take: consumersList.take,
            filters: { q },
          });
        });
      });
    },
    [consumerListFiltersFormInstance, consumersList]
  );

  useEffect(() => {
    const consumers: string[] = [];
    if (consumerListFiltersForm.q.length) {
      consumers.splice(consumers.length, 0, consumerListFiltersForm.q);
    }
    consumers.splice(consumers.length, 0, ...createBillFrom.consumers);
    consumers.splice(consumers.length, 0, ...consumersList.list.map((consumer) => consumer.name));
    const newConsumers = new Set(consumers);
    setConsumers(Array.from(newConsumers));
  }, [consumersList, consumerListFiltersForm, createBillFrom]);

  return (
    <Navigation>
      <FormContainer>
        <Box
          overflow="hidden"
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
          <ResetStyleWithAnimation sx={{ opacity: '1', transform: 'translateY(0)' }}>
            <TextField
              sx={{
                width: '100%',
                opacity: '0',
                transform: 'translateY(10px)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
              }}
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
          </ResetStyleWithAnimation>
          <ResetStyleWithAnimation sx={{ opacity: '1', transform: 'translateY(0)' }}>
            <Box
              position={'relative'}
              sx={{
                opacity: 0,
                transform: 'translateY(15px)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                transitionDelay: '0.03s',
              }}
            >
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
          </ResetStyleWithAnimation>
          <ResetStyleWithAnimation sx={{ opacity: '1', transform: 'translateY(0)' }}>
            <Box
              position={'relative'}
              sx={{
                opacity: 0,
                transform: 'translateY(20px)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                transitionDelay: '0.06s',
              }}
            >
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
          </ResetStyleWithAnimation>
          <ResetStyleWithAnimation sx={{ opacity: '1', transform: 'translateY(0)' }}>
            <Box
              position={'relative'}
              sx={{
                opacity: 0,
                transform: 'translateY(25px)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                transitionDelay: '0.09s',
              }}
            >
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
          </ResetStyleWithAnimation>
          <ResetStyleWithAnimation sx={{ opacity: '1', transform: 'translateY(0)' }}>
            <TextField
              sx={{
                width: '100%',
                opacity: 0,
                transform: 'translateY(30px)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                transitionDelay: '0.12s',
              }}
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
          </ResetStyleWithAnimation>
          <ResetStyleWithAnimation sx={{ opacity: '1', transform: 'translateY(0)' }}>
            <TextField
              sx={{
                width: '100%',
                opacity: 0,
                transform: 'translateY(35px)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                transitionDelay: '0.15s',
              }}
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
          </ResetStyleWithAnimation>
          <ResetStyleWithAnimation sx={{ opacity: '1', transform: 'translateY(0)' }}>
            <Box
              component="div"
              display="flex"
              alignItems="center"
              gap="10px"
              marginTop="20px"
              sx={{
                opacity: 0,
                transform: 'translateY(40px)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                transitionDelay: '0.18s',
              }}
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
          </ResetStyleWithAnimation>
        </Box>
      </FormContainer>
    </Navigation>
  );
};

export default CreateBillContent;
