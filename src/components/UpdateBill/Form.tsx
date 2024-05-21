import {
  ConsumerList,
  ConsumerListFilters,
  ConsumerObj,
  debounce,
  getDynamicPath,
  getTime,
  isoDate,
  LocationList,
  LocationListFilters,
  LocationObj,
  Pathes,
  ReceiverList,
  ReceiverListFilters,
  ReceiverObj,
  UpdateBill,
} from '../../lib';
import { ChangeEvent, FC, useCallback, useRef, useState } from 'react';
import { Box, TextField, Button, Autocomplete, CircularProgress } from '@mui/material';
import Modal from '../shared/Modal';
import { useAction, useForm, usePaginationList, useRequest } from '../../hooks';
import { ModalNames } from '../../store';
import { ConsumersApi, LocationsApi, ReceiversApi, UpdateBillApi } from '../../apis';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

interface FormImportation {
  formInstance: ReturnType<typeof useForm<UpdateBill>>;
}

const Form: FC<FormImportation> = ({ formInstance: updateBillFormInstance }) => {
  const [consumers, setConsumers] = useState<string[]>([]);
  const [receviers, setReceivers] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [isConsumerAutocompleteOpen, setIsConsumerAutocompleteOpen] = useState(false);
  const [isReceiverAutocompleteOpen, setIsReceiverAutocompleteOpen] = useState(false);
  const [isLocationAutocompleteOpen, setIsLocationAutocompleteOpen] = useState(false);
  const consumerListFiltersFormInstance = useForm(ConsumerListFilters);
  const receiverListFiltersFormInstance = useForm(ReceiverListFilters);
  const locationListFiltersFormInstance = useForm(LocationListFilters);
  const params = useParams();
  const actions = useAction();
  const navigate = useNavigate();
  const request = useRequest();
  const isUpdateBillApiProcessing = request.isApiProcessing(UpdateBillApi);
  const isConsumersApiProcessing = request.isApiProcessing(ConsumersApi);
  const isReceiversApiProcessing = request.isApiProcessing(ReceiversApi);
  const isLocationsApiProcessing = request.isApiProcessing(LocationsApi);
  const consumerListFiltersForm = consumerListFiltersFormInstance.getForm();
  const receiverListFiltersForm = receiverListFiltersFormInstance.getForm();
  const locationListFiltersForm = locationListFiltersFormInstance.getForm();
  const consumerListInstance = usePaginationList(ConsumerList);
  const receiverlistInstance = usePaginationList(ReceiverList);
  const locationListInstance = usePaginationList(LocationList);
  const oneQuarterDebounce = useRef(debounce(250));
  const updateBillForm = updateBillFormInstance.getForm();
  const snackbar = useSnackbar();

  const formSubmition = useCallback(() => {
    updateBillFormInstance.onSubmit(() => {
      request
        .build<UpdateBill, UpdateBill>(new UpdateBillApi(updateBillForm))
        .then(response => {
          const billId = params.id as string;
          actions.hideModal(ModalNames.CONFIRMATION);
          updateBillFormInstance.resetForm();
          snackbar.enqueueSnackbar({ message: 'You have updated the bill successfully.', variant: 'success' });
          navigate(getDynamicPath(Pathes.BILL, { id: billId }));
        })
        .catch(err => actions.hideModal(ModalNames.CONFIRMATION));
    });
  }, [updateBillForm, updateBillFormInstance, params, request]);

  const onReceiverChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const q = event.target.value.trim();
      receiverListFiltersFormInstance.onChange('q', q);
      updateBillFormInstance.onChange('receiver', q);

      oneQuarterDebounce.current(() => {
        receiverListFiltersFormInstance.onSubmit(() => {
          setIsReceiverAutocompleteOpen(true);
          const receiverApi = new ReceiversApi({
            take: receiverlistInstance.getTake(),
            page: receiverlistInstance.getPage(),
            filters: { q },
          });
          request.build<[ReceiverObj[], number]>(receiverApi).then(response => {
            const [list] = response.data;
            const receivers: string[] = [];
            if (q.length) {
              receivers.splice(receivers.length, 0, q);
            }
            receivers.splice(receivers.length, 0, ...list.map(receiver => receiver.name));
            const newReceivers = new Set(receivers);
            setReceivers(Array.from(newReceivers));
          });
        });
      });
    },
    [updateBillFormInstance, receiverListFiltersFormInstance]
  );

  const onLocationChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const q = event.target.value.trim();
      locationListFiltersFormInstance.onChange('q', q);
      updateBillFormInstance.onChange('location', q);

      oneQuarterDebounce.current(() => {
        locationListFiltersFormInstance.onSubmit(() => {
          setIsLocationAutocompleteOpen(true);
          const locationApi = new LocationsApi({
            take: locationListInstance.getTake(),
            page: locationListInstance.getPage(),
            filters: { q },
          });
          request.build<[LocationObj[], number]>(locationApi).then(response => {
            const [list] = response.data;
            const locations: string[] = [];
            if (q.length) {
              locations.splice(locations.length, 0, q);
            }
            locations.splice(locations.length, 0, ...list.map(location => location.name));
            const newLocations = new Set(locations);
            setLocations(Array.from(newLocations));
          });
        });
      });
    },
    [updateBillFormInstance, receiverListFiltersFormInstance]
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
          request.build<[ConsumerObj[], number]>(consumersApi).then(response => {
            const [list] = response.data;
            const consumers: string[] = [];
            if (q.length) {
              consumers.splice(consumers.length, 0, q);
            }
            consumers.splice(consumers.length, 0, ...updateBillForm.consumers);
            consumers.splice(consumers.length, 0, ...list.map(consumer => consumer.name));
            const newConsumers = new Set(consumers);
            setConsumers(Array.from(newConsumers));
          });
        });
      });
    },
    [updateBillForm, consumerListFiltersFormInstance]
  );

  return (
    <>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        display="flex"
        flexDirection="column"
        gap="20px"
        onSubmit={event => {
          event.preventDefault();
          updateBillFormInstance.confirmation();
        }}
      >
        <TextField
          label="Amount"
          variant="standard"
          type="number"
          value={updateBillForm.amount}
          onChange={event => updateBillFormInstance.onChange('amount', Number(event.target.value).toString())}
          helperText={updateBillFormInstance.getInputErrorMessage('amount')}
          error={updateBillFormInstance.isInputInValid('amount')}
          disabled={isUpdateBillApiProcessing}
        />
        <Box position={'relative'}>
          <Autocomplete
            freeSolo
            open={isReceiverAutocompleteOpen}
            onBlur={() => {
              setReceivers([]);
              setIsReceiverAutocompleteOpen(false);
            }}
            value={updateBillForm.receiver}
            onChange={(event, value) => {
              value = value || '';
              updateBillFormInstance.onChange('receiver', value.trim());
              receiverListFiltersFormInstance.onChange('q', '');
              setReceivers([]);
              setIsReceiverAutocompleteOpen(false);
            }}
            disabled={isUpdateBillApiProcessing}
            options={receviers}
            filterOptions={options => options}
            getOptionLabel={option => option}
            clearIcon={false}
            clearOnBlur
            clearOnEscape
            blurOnSelect
            renderInput={params => (
              <TextField
                {...params}
                sx={{}}
                onBlur={event => {
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
                  updateBillFormInstance.isInputInValid('receiver') ||
                  receiverListFiltersFormInstance.isInputInValid('q')
                }
                helperText={
                  updateBillFormInstance.getInputErrorMessage('receiver') ||
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
            freeSolo
            open={isLocationAutocompleteOpen}
            onBlur={() => {
              setLocations([]);
              setIsLocationAutocompleteOpen(false);
            }}
            value={updateBillForm.location}
            onChange={(event, value) => {
              value = value || '';
              updateBillFormInstance.onChange('location', value);
              locationListFiltersFormInstance.onChange('q', '');
              setLocations([]);
              setIsLocationAutocompleteOpen(false);
            }}
            disabled={isUpdateBillApiProcessing}
            options={locations}
            filterOptions={options => options}
            getOptionLabel={option => option}
            clearIcon={false}
            clearOnBlur
            clearOnEscape
            blurOnSelect
            renderInput={params => (
              <TextField
                {...params}
                sx={{}}
                onBlur={event => {
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
                  updateBillFormInstance.isInputInValid('location') ||
                  locationListFiltersFormInstance.isInputInValid('q')
                }
                helperText={
                  updateBillFormInstance.getInputErrorMessage('location') ||
                  locationListFiltersFormInstance.getInputErrorMessage('q')
                }
              />
            )}
          />
          {isLocationsApiProcessing && (
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
            value={updateBillForm.consumers}
            onChange={(event, value) => {
              updateBillFormInstance.onChange('consumers', value);
              setConsumers([]);
              setIsConsumerAutocompleteOpen(false);
            }}
            disabled={isUpdateBillApiProcessing}
            options={consumers}
            filterOptions={options => options}
            getOptionLabel={option => option}
            clearIcon={false}
            clearOnBlur
            clearOnEscape
            blurOnSelect
            renderInput={params => (
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
                  updateBillFormInstance.isInputInValid('consumers') ||
                  consumerListFiltersFormInstance.isInputInValid('q')
                }
                helperText={
                  updateBillFormInstance.getInputErrorMessage('consumers') ||
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
          value={updateBillForm.date ? isoDate(updateBillForm.date) : 'undefined'}
          onChange={event =>
            updateBillFormInstance.onChange('date', event.target.value ? getTime(event.target.value) : null)
          }
          helperText={updateBillFormInstance.getInputErrorMessage('date')}
          error={updateBillFormInstance.isInputInValid('date')}
          InputLabelProps={{ shrink: true }}
          disabled={isUpdateBillApiProcessing}
        />
        <TextField
          label="Description"
          type="text"
          rows="5"
          multiline
          variant="standard"
          value={updateBillForm.description}
          onChange={event => updateBillFormInstance.onChange('description', event.target.value)}
          helperText={updateBillFormInstance.getInputErrorMessage('description')}
          error={updateBillFormInstance.isInputInValid('description')}
          disabled={isUpdateBillApiProcessing}
        />
        <Box component="div" display="flex" alignItems="center" gap="10px" marginTop="20px">
          <Button
            disabled={isUpdateBillApiProcessing || !updateBillFormInstance.isFormValid()}
            variant="contained"
            size="small"
            type="submit"
            sx={{ textTransform: 'capitalize' }}
          >
            Update
          </Button>
          <Button
            disabled={isUpdateBillApiProcessing}
            variant="outlined"
            size="small"
            type="button"
            sx={{ textTransform: 'capitalize' }}
            onClick={() => updateBillFormInstance.resetForm()}
          >
            Reset
          </Button>
        </Box>
      </Box>
      <Modal
        isLoading={isUpdateBillApiProcessing}
        isActive={updateBillFormInstance.isConfirmationActive()}
        onCancel={() => actions.hideModal(ModalNames.CONFIRMATION)}
        onConfirm={formSubmition}
      />
    </>
  );
};

export default Form;
