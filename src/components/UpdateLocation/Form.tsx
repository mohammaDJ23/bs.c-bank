import { getDynamicPath, Pathes, UpdateLocation } from '../../lib';
import { FC, useCallback, useEffect } from 'react';
import { Box, TextField, Button } from '@mui/material';
import Modal from '../shared/Modal';
import { useAction, useForm, useRequest } from '../../hooks';
import { ModalNames } from '../../store';
import { UpdateLocationApi } from '../../apis';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import ResetStyleWithAnimation from '../shared/ResetStyleWithAnimation';

interface FormImportation {
  formInstance: ReturnType<typeof useForm<UpdateLocation>>;
}

const Form: FC<FormImportation> = ({ formInstance: updateLocationFormInstance }) => {
  const params = useParams();
  const actions = useAction();
  const navigate = useNavigate();
  const request = useRequest();
  const isUpdateLocationApiProcessing = request.isApiProcessing(UpdateLocationApi);
  const isUpdateLocationApiFailed = request.isProcessingApiFailed(UpdateLocationApi);
  const isUpdateLocationApiSuccessed = request.isProcessingApiSuccessed(UpdateLocationApi);
  const updateLocationApiExceptionMessage = request.getExceptionMessage(UpdateLocationApi);
  const updateLocationForm = updateLocationFormInstance.getForm();
  const snackbar = useSnackbar();

  const formSubmition = useCallback(() => {
    updateLocationFormInstance.onSubmit(() => {
      actions.updateLocation(updateLocationForm);
    });
  }, [updateLocationForm, updateLocationFormInstance]);

  useEffect(() => {
    if (isUpdateLocationApiSuccessed) {
      const locationId = params.id as string;
      actions.hideModal(ModalNames.CONFIRMATION);
      updateLocationFormInstance.resetForm();
      snackbar.enqueueSnackbar({ message: 'You have updated the location successfully.', variant: 'success' });
      navigate(getDynamicPath(Pathes.LOCATION, { id: locationId }));
    } else if (isUpdateLocationApiFailed) {
      actions.hideModal(ModalNames.CONFIRMATION);
      snackbar.enqueueSnackbar({ message: updateLocationApiExceptionMessage, variant: 'error' });
    }
  }, [isUpdateLocationApiFailed, isUpdateLocationApiSuccessed]);

  return (
    <>
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
          updateLocationFormInstance.confirmation();
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
            label="Name"
            variant="standard"
            type="text"
            value={updateLocationForm.name}
            onChange={(event) => updateLocationFormInstance.onChange('name', event.target.value.toString())}
            helperText={updateLocationFormInstance.getInputErrorMessage('name')}
            error={updateLocationFormInstance.isInputInValid('name')}
            disabled={isUpdateLocationApiProcessing}
          />
        </ResetStyleWithAnimation>

        <ResetStyleWithAnimation sx={{ opacity: '1', transform: 'translateY(0)' }}>
          <Box
            sx={{
              width: '100%',
              opacity: '0',
              transform: 'translateY(15px)',
              transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
              transitionDelay: '0.03s',
            }}
            component="div"
            display="flex"
            alignItems="center"
            gap="10px"
            marginTop="20px"
          >
            <Button
              disabled={isUpdateLocationApiProcessing || !updateLocationFormInstance.isFormValid()}
              variant="contained"
              size="small"
              type="submit"
              sx={{ textTransform: 'capitalize' }}
            >
              Update
            </Button>
            <Button
              disabled={isUpdateLocationApiProcessing}
              variant="outlined"
              size="small"
              type="button"
              sx={{ textTransform: 'capitalize' }}
              onClick={() => updateLocationFormInstance.resetForm()}
            >
              Reset
            </Button>
          </Box>
        </ResetStyleWithAnimation>
      </Box>
      <Modal
        isLoading={isUpdateLocationApiProcessing}
        isActive={updateLocationFormInstance.isConfirmationActive()}
        onCancel={() => actions.hideModal(ModalNames.CONFIRMATION)}
        onConfirm={formSubmition}
      />
    </>
  );
};

export default Form;
