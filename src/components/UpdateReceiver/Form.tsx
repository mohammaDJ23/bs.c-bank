import { getDynamicPath, Pathes, UpdateReceiver, wait } from '../../lib';
import { FC, useCallback, useEffect, useRef } from 'react';
import { Box, TextField, Button } from '@mui/material';
import Modal from '../shared/Modal';
import { useAction, useForm, useRequest } from '../../hooks';
import { ModalNames } from '../../store';
import { UpdateReceiverApi } from '../../apis';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { v4 as uuid } from 'uuid';

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
  const formElIdRef = useRef(uuid());

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

  useEffect(() => {
    (async () => {
      await wait(10);

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
    <>
      <Box
        id={formElIdRef.current}
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
          sx={{ opacity: 0, transform: 'translateX(10px)' }}
          label="Name"
          variant="standard"
          type="text"
          value={updateReceiverForm.name}
          onChange={(event) => updateReceiverFormInstance.onChange('name', event.target.value.toString())}
          helperText={updateReceiverFormInstance.getInputErrorMessage('name')}
          error={updateReceiverFormInstance.isInputInValid('name')}
          disabled={isUpdateReceiverApiProcessing}
        />

        <Box
          sx={{ opacity: 0, transform: 'translateX(20px)' }}
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
