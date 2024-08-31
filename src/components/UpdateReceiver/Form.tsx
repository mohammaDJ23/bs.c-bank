import { getDynamicPath, Pathes, UpdateReceiver } from '../../lib';
import { FC, useCallback, useEffect } from 'react';
import { Box, TextField, Button } from '@mui/material';
import Modal from '../shared/Modal';
import { useAction, useForm, useRequest } from '../../hooks';
import { ModalNames } from '../../store';
import { UpdateReceiverApi } from '../../apis';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import ResetStyleWithAnimation from '../shared/ResetStyleWithAnimation';

interface FormImportation {
  formInstance: ReturnType<typeof useForm<UpdateReceiver>>;
}

const Form: FC<FormImportation> = ({ formInstance: updateReceiverFormInstance }) => {
  const params = useParams();
  const actions = useAction();
  const navigate = useNavigate();
  const request = useRequest();
  const isUpdateReceiverApiProcessing = request.isApiProcessing(UpdateReceiverApi);
  const isUpdateReceiverApiFailed = request.isProcessingApiFailed(UpdateReceiverApi);
  const isUpdateReceiverApiSuccessed = request.isProcessingApiSuccessed(UpdateReceiverApi);
  const updateReceiverApiExceptionMessage = request.getExceptionMessage(UpdateReceiverApi);
  const updateReceiverForm = updateReceiverFormInstance.getForm();
  const snackbar = useSnackbar();

  const formSubmition = useCallback(() => {
    updateReceiverFormInstance.onSubmit(() => {
      actions.updateReceiver(updateReceiverForm);
    });
  }, [updateReceiverForm, updateReceiverFormInstance]);

  useEffect(() => {
    if (isUpdateReceiverApiSuccessed) {
      const receiverId = params.id as string;
      actions.hideModal(ModalNames.CONFIRMATION);
      updateReceiverFormInstance.resetForm();
      snackbar.enqueueSnackbar({ message: 'You have updated the receiver successfully.', variant: 'success' });
      navigate(getDynamicPath(Pathes.RECEIVER, { id: receiverId }));
    } else if (isUpdateReceiverApiFailed) {
      actions.hideModal(ModalNames.CONFIRMATION);
      snackbar.enqueueSnackbar({ message: updateReceiverApiExceptionMessage, variant: 'error' });
    }
  }, [isUpdateReceiverApiFailed, isUpdateReceiverApiSuccessed]);

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
          updateReceiverFormInstance.confirmation();
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
            value={updateReceiverForm.name}
            onChange={(event) => updateReceiverFormInstance.onChange('name', event.target.value.toString())}
            helperText={updateReceiverFormInstance.getInputErrorMessage('name')}
            error={updateReceiverFormInstance.isInputInValid('name')}
            disabled={isUpdateReceiverApiProcessing}
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
              disabled={isUpdateReceiverApiProcessing || !updateReceiverFormInstance.isFormValid()}
              variant="contained"
              size="small"
              type="submit"
              sx={{ textTransform: 'capitalize' }}
            >
              Update
            </Button>
            <Button
              disabled={isUpdateReceiverApiProcessing}
              variant="outlined"
              size="small"
              type="button"
              sx={{ textTransform: 'capitalize' }}
              onClick={() => updateReceiverFormInstance.resetForm()}
            >
              Reset
            </Button>
          </Box>
        </ResetStyleWithAnimation>
      </Box>
      <Modal
        isLoading={isUpdateReceiverApiProcessing}
        isActive={updateReceiverFormInstance.isConfirmationActive()}
        onCancel={() => actions.hideModal(ModalNames.CONFIRMATION)}
        onConfirm={formSubmition}
      />
    </>
  );
};

export default Form;
