import { getDynamicPath, Pathes, ReceiverObj, UpdateReceiver } from '../../lib';
import { FC, useCallback } from 'react';
import { Box, TextField, Button } from '@mui/material';
import Modal from '../shared/Modal';
import { useAction, useForm, useRequest } from '../../hooks';
import { ModalNames } from '../../store';
import { UpdateReceiverApi } from '../../apis';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

interface FormImportation {
  formInstance: ReturnType<typeof useForm<UpdateReceiver>>;
}

const Form: FC<FormImportation> = ({ formInstance: updateReceiverFormInstance }) => {
  const params = useParams();
  const actions = useAction();
  const navigate = useNavigate();
  const request = useRequest();
  const isUpdateReceiverApiProcessing = request.isApiProcessing(UpdateReceiverApi);
  const updateReceiverForm = updateReceiverFormInstance.getForm();
  const snackbar = useSnackbar();

  const formSubmition = useCallback(() => {
    updateReceiverFormInstance.onSubmit(() => {
      request
        .build<ReceiverObj, UpdateReceiver>(new UpdateReceiverApi(updateReceiverForm))
        .then((response) => {
          const receiverId = params.id as string;
          actions.hideModal(ModalNames.CONFIRMATION);
          updateReceiverFormInstance.resetForm();
          snackbar.enqueueSnackbar({ message: 'You have updated the receiver successfully.', variant: 'success' });
          navigate(getDynamicPath(Pathes.RECEIVER, { id: receiverId }));
        })
        .catch((err) => actions.hideModal(ModalNames.CONFIRMATION));
    });
  }, [updateReceiverForm, updateReceiverFormInstance, params, request]);

  return (
    <>
      <Box
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
        <TextField
          label="Name"
          variant="standard"
          type="text"
          value={updateReceiverForm.name}
          onChange={(event) => updateReceiverFormInstance.onChange('name', event.target.value.toString())}
          helperText={updateReceiverFormInstance.getInputErrorMessage('name')}
          error={updateReceiverFormInstance.isInputInValid('name')}
          disabled={isUpdateReceiverApiProcessing}
        />

        <Box component="div" display="flex" alignItems="center" gap="10px" marginTop="20px">
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
