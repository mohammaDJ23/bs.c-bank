import {
  ConsumerListFilters,
  debounce,
  getDynamicPath,
  getTime,
  isoDate,
  LocationListFilters,
  Pathes,
  ReceiverListFilters,
  UpdateBill,
  wait,
} from '../../lib';
import { v4 as uuid } from 'uuid';
import { ChangeEvent, FC, useCallback, useEffect, useRef, useState } from 'react';
import { Box, TextField, Button, Autocomplete, CircularProgress } from '@mui/material';
import Modal from '../shared/Modal';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import { ModalNames } from '../../store';
import { ConsumerApi, ConsumersApi, LocationsApi, ReceiversApi, UpdateBillApi } from '../../apis';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { selectConsumersList, selectLocationsList, selectReceiversList } from '../../store/selectors';
import ResetStyleWithAnimation from '../shared/ResetStyleWithAnimation';

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
  const selectors = useSelector();
  const actions = useAction();
  const navigate = useNavigate();
  const request = useRequest();
  const isUpdateBillApiProcessing = request.isApiProcessing(UpdateBillApi);
  const isUpdateBillApiFailed = request.isProcessingApiFailed(UpdateBillApi);
  const isUpdateBillApiSuccessed = request.isProcessingApiSuccessed(UpdateBillApi);
  const updateBillApiExceptionMessage = request.getExceptionMessage(UpdateBillApi);
  const isConsumersApiProcessing = request.isApiProcessing(ConsumersApi);
  const isConsumersApiFailed = request.isProcessingApiFailed(ConsumersApi);
  const isConsumersApiSuccessed = request.isProcessingApiSuccessed(ConsumersApi);
  const consumersApiExceptionMessage = request.getExceptionMessage(ConsumersApi);
  const isReceiversApiProcessing = request.isApiProcessing(ReceiversApi);
  const isReceiversApiFailed = request.isProcessingApiFailed(ReceiversApi);
  const isReceiversApiSuccessed = request.isProcessingApiSuccessed(ReceiversApi);
  const receiversApiExceptionMessage = request.getExceptionMessage(ReceiversApi);
  const isLocationsApiProcessing = request.isApiProcessing(LocationsApi);
  const isLocationsApiFailed = request.isProcessingApiFailed(LocationsApi);
  const isLocationsApiSuccessed = request.isProcessingApiSuccessed(LocationsApi);
  const locationsApiExceptionMessage = request.getExceptionMessage(LocationsApi);
  const consumerListFiltersForm = consumerListFiltersFormInstance.getForm();
  const receiverListFiltersForm = receiverListFiltersFormInstance.getForm();
  const locationListFiltersForm = locationListFiltersFormInstance.getForm();
  const consumersList = selectConsumersList(selectors);
  const receiversList = selectReceiversList(selectors);
  const locationsList = selectLocationsList(selectors);
  const oneQuarterDebounce = useRef(debounce(250));
  const updateBillForm = updateBillFormInstance.getForm();
  const snackbar = useSnackbar();
  const formElIdRef = useRef(uuid());

  const formSubmition = useCallback(() => {
    updateBillFormInstance.onSubmit(() => {
      actions.updateBill(updateBillForm);
    });
  }, [updateBillForm, updateBillFormInstance]);

  useEffect(() => {
    if (isUpdateBillApiSuccessed) {
      const billId = params.id as string;
      actions.hideModal(ModalNames.CONFIRMATION);
      updateBillFormInstance.resetForm();
      snackbar.enqueueSnackbar({ message: 'You have updated the bill successfully.', variant: 'success' });
      navigate(getDynamicPath(Pathes.BILL, { id: billId }));
    } else if (isUpdateBillApiFailed) {
      actions.hideModal(ModalNames.CONFIRMATION);
      snackbar.enqueueSnackbar({ message: updateBillApiExceptionMessage, variant: 'error' });
    }
  }, [isUpdateBillApiSuccessed, isUpdateBillApiFailed]);

  const onReceiverChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const q = event.target.value.trim();
      receiverListFiltersFormInstance.onChange('q', q);
      updateBillFormInstance.onChange('receiver', q);
      oneQuarterDebounce.current(() => {
        receiverListFiltersFormInstance.onSubmit(() => {
          setIsReceiverAutocompleteOpen(true);
          actions.getReceivers({
            page: 1,
            take: receiversList.take,
            filters: { q },
          });
        });
      });
    },
    [updateBillFormInstance, receiverListFiltersFormInstance, receiversList]
  );

  useEffect(() => {
    if (isReceiversApiSuccessed) {
      const receivers: string[] = [];
      if (receiverListFiltersForm.q.length) {
        receivers.splice(receivers.length, 0, receiverListFiltersForm.q);
      }
      receivers.splice(receivers.length, 0, ...receiversList.list.map((receiver) => receiver.name));
      const newReceivers = new Set(receivers);
      setReceivers(Array.from(newReceivers));
    } else if (isReceiversApiFailed) {
      snackbar.enqueueSnackbar({ message: receiversApiExceptionMessage, variant: 'error' });
    }
  }, [receiversList, receiverListFiltersForm, isReceiversApiFailed, isReceiversApiSuccessed]);

  const onLocationChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const q = event.target.value.trim();
      locationListFiltersFormInstance.onChange('q', q);
      updateBillFormInstance.onChange('location', q);
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
    [updateBillFormInstance, locationListFiltersFormInstance, locationsList]
  );

  useEffect(() => {
    if (isLocationsApiSuccessed) {
      const locations: string[] = [];
      if (locationListFiltersForm.q.length) {
        locations.splice(locations.length, 0, locationListFiltersForm.q);
      }
      locations.splice(locations.length, 0, ...locationsList.list.map((location) => location.name));
      const newLocations = new Set(locations);
      setLocations(Array.from(newLocations));
    } else if (isLocationsApiFailed) {
      snackbar.enqueueSnackbar({ message: locationsApiExceptionMessage, variant: 'error' });
    }
  }, [locationsList, locationListFiltersForm, isLocationsApiSuccessed, isLocationsApiFailed]);

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
    if (isConsumersApiSuccessed) {
      const consumers: string[] = [];
      if (consumerListFiltersForm.q.length) {
        consumers.splice(consumers.length, 0, consumerListFiltersForm.q);
      }
      consumers.splice(consumers.length, 0, ...updateBillForm.consumers);
      consumers.splice(consumers.length, 0, ...consumersList.list.map((consumer) => consumer.name));
      const newConsumers = new Set(consumers);
      setConsumers(Array.from(newConsumers));
    } else if (isConsumersApiFailed) {
      snackbar.enqueueSnackbar({ message: consumersApiExceptionMessage, variant: 'error' });
    }
  }, [consumersList, consumerListFiltersForm, updateBillForm, isConsumersApiSuccessed, isConsumersApiFailed]);

  useEffect(() => {
    (async () => {
      let el = document.getElementById(formElIdRef.current);
      if (el) {
        for (const node of Array.from(el.childNodes)) {
          // @ts-ignore
          node.style.transition = 'opacity 0.1s, transform 0.2s';
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
    <>
      <Box
        id={formElIdRef.current}
        overflow="hidden"
        component="form"
        noValidate
        autoComplete="off"
        display="flex"
        flexDirection="column"
        gap="20px"
        onSubmit={(event) => {
          event.preventDefault();
          updateBillFormInstance.confirmation();
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
            value={updateBillForm.amount}
            onChange={(event) => updateBillFormInstance.onChange('amount', Number(event.target.value).toString())}
            helperText={updateBillFormInstance.getInputErrorMessage('amount')}
            error={updateBillFormInstance.isInputInValid('amount')}
            disabled={isUpdateBillApiProcessing}
          />
        </ResetStyleWithAnimation>
        <ResetStyleWithAnimation sx={{ opacity: '1', transform: 'translateY(0)' }}>
          <Box
            position={'relative'}
            sx={{
              width: '100%',
              opacity: '0',
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
        </ResetStyleWithAnimation>
        <ResetStyleWithAnimation sx={{ opacity: '1', transform: 'translateY(0)' }}>
          <Box
            position={'relative'}
            sx={{
              width: '100%',
              opacity: '0',
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
        </ResetStyleWithAnimation>

        <ResetStyleWithAnimation sx={{ opacity: '1', transform: 'translateY(0)' }}>
          <Box
            position={'relative'}
            sx={{
              width: '100%',
              opacity: '0',
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
              value={updateBillForm.consumers}
              onChange={(event, value) => {
                updateBillFormInstance.onChange('consumers', value);
                setConsumers([]);
                setIsConsumerAutocompleteOpen(false);
              }}
              disabled={isUpdateBillApiProcessing}
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
        </ResetStyleWithAnimation>

        <ResetStyleWithAnimation sx={{ opacity: '1', transform: 'translateY(0)' }}>
          <TextField
            sx={{
              width: '100%',
              opacity: '0',
              transform: 'translateY(30px)',
              transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
              transitionDelay: '0.12s',
            }}
            label="Date"
            type="date"
            variant="standard"
            value={updateBillForm.date ? isoDate(updateBillForm.date) : 'undefined'}
            onChange={(event) =>
              updateBillFormInstance.onChange('date', event.target.value ? getTime(event.target.value) : null)
            }
            helperText={updateBillFormInstance.getInputErrorMessage('date')}
            error={updateBillFormInstance.isInputInValid('date')}
            InputLabelProps={{ shrink: true }}
            disabled={isUpdateBillApiProcessing}
          />
        </ResetStyleWithAnimation>

        <ResetStyleWithAnimation sx={{ opacity: '1', transform: 'translateY(0)' }}>
          <TextField
            sx={{
              width: '100%',
              opacity: '0',
              transform: 'translateY(35px)',
              transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
              transitionDelay: '0.15s',
            }}
            label="Description"
            type="text"
            rows="5"
            multiline
            variant="standard"
            value={updateBillForm.description}
            onChange={(event) => updateBillFormInstance.onChange('description', event.target.value)}
            helperText={updateBillFormInstance.getInputErrorMessage('description')}
            error={updateBillFormInstance.isInputInValid('description')}
            disabled={isUpdateBillApiProcessing}
          />
        </ResetStyleWithAnimation>

        <ResetStyleWithAnimation sx={{ opacity: '1', transform: 'translateY(0)' }}>
          <Box
            sx={{
              width: '100%',
              opacity: '0',
              transform: 'translateY(40px)',
              transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
              transitionDelay: '0.18s',
            }}
            component="div"
            display="flex"
            alignItems="center"
            gap="10px"
            marginTop="20px"
          >
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
        </ResetStyleWithAnimation>
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
