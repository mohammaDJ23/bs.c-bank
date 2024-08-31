import { getDynamicPath, Pathes, UpdateConsumer } from '../../lib';
import { FC, useCallback, useEffect } from 'react';
import { Box, TextField, Button } from '@mui/material';
import Modal from '../shared/Modal';
import { useAction, useForm, useRequest } from '../../hooks';
import { ModalNames } from '../../store';
import { UpdateConsumerApi } from '../../apis';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import ResetStyleWithAnimation from '../shared/ResetStyleWithAnimation';

interface FormImportation {
  formInstance: ReturnType<typeof useForm<UpdateConsumer>>;
}

const Form: FC<FormImportation> = ({ formInstance: updateConsumerFormInstance }) => {
  const params = useParams();
  const actions = useAction();
  const navigate = useNavigate();
  const request = useRequest();
  const isUpdateConsumerApiProcessing = request.isApiProcessing(UpdateConsumerApi);
  const isUpdateConsumerApiFailed = request.isProcessingApiFailed(UpdateConsumerApi);
  const isUpdateConsumerApiSuccessed = request.isProcessingApiSuccessed(UpdateConsumerApi);
  const updateConsumerApiExceptionMessage = request.getExceptionMessage(UpdateConsumerApi);
  const updateConsumerForm = updateConsumerFormInstance.getForm();
  const snackbar = useSnackbar();

  const formSubmition = useCallback(() => {
    updateConsumerFormInstance.onSubmit(() => {
      actions.updateConsumer(updateConsumerForm);
    });
  }, [updateConsumerForm, updateConsumerFormInstance]);

  useEffect(() => {
    if (isUpdateConsumerApiSuccessed) {
      const consumerId = params.id as string;
      actions.hideModal(ModalNames.CONFIRMATION);
      updateConsumerFormInstance.resetForm();
      snackbar.enqueueSnackbar({ message: 'You have updated the consumer successfully.', variant: 'success' });
      navigate(getDynamicPath(Pathes.CONSUMER, { id: consumerId }));
    } else if (isUpdateConsumerApiFailed) {
      actions.hideModal(ModalNames.CONFIRMATION);
      snackbar.enqueueSnackbar({ message: updateConsumerApiExceptionMessage, variant: 'error' });
    }
  }, [isUpdateConsumerApiFailed, isUpdateConsumerApiSuccessed]);

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
          updateConsumerFormInstance.confirmation();
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
            value={updateConsumerForm.name}
            onChange={(event) => updateConsumerFormInstance.onChange('name', event.target.value.toString())}
            helperText={updateConsumerFormInstance.getInputErrorMessage('name')}
            error={updateConsumerFormInstance.isInputInValid('name')}
            disabled={isUpdateConsumerApiProcessing}
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
              disabled={isUpdateConsumerApiProcessing || !updateConsumerFormInstance.isFormValid()}
              variant="contained"
              size="small"
              type="submit"
              sx={{ textTransform: 'capitalize' }}
            >
              Update
            </Button>
            <Button
              disabled={isUpdateConsumerApiProcessing}
              variant="outlined"
              size="small"
              type="button"
              sx={{ textTransform: 'capitalize' }}
              onClick={() => updateConsumerFormInstance.resetForm()}
            >
              Reset
            </Button>
          </Box>
        </ResetStyleWithAnimation>
      </Box>
      <Modal
        isLoading={isUpdateConsumerApiProcessing}
        isActive={updateConsumerFormInstance.isConfirmationActive()}
        onCancel={() => actions.hideModal(ModalNames.CONFIRMATION)}
        onConfirm={formSubmition}
      />
    </>
  );
};

export default Form;
