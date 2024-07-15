import { ConsumerObj, getDynamicPath, Pathes, UpdateConsumer } from '../../lib';
import { FC, useCallback } from 'react';
import { Box, TextField, Button } from '@mui/material';
import Modal from '../shared/Modal';
import { useAction, useForm, useRequest } from '../../hooks';
import { ModalNames } from '../../store';
import { UpdateConsumerApi } from '../../apis';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

interface FormImportation {
  formInstance: ReturnType<typeof useForm<UpdateConsumer>>;
}

const Form: FC<FormImportation> = ({ formInstance: updateConsumerFormInstance }) => {
  const params = useParams();
  const actions = useAction();
  const navigate = useNavigate();
  const request = useRequest();
  const isUpdateConsumerApiProcessing = request.isApiProcessing(UpdateConsumerApi);
  const updateConsumerForm = updateConsumerFormInstance.getForm();
  const snackbar = useSnackbar();

  const formSubmition = useCallback(() => {
    updateConsumerFormInstance.onSubmit(() => {
      request
        .build<ConsumerObj, UpdateConsumer>(new UpdateConsumerApi(updateConsumerForm))
        .then((response) => {
          const consumerId = params.id as string;
          actions.hideModal(ModalNames.CONFIRMATION);
          updateConsumerFormInstance.resetForm();
          snackbar.enqueueSnackbar({ message: 'You have updated the consumer successfully.', variant: 'success' });
          navigate(getDynamicPath(Pathes.CONSUMER, { id: consumerId }));
        })
        .catch((err) => actions.hideModal(ModalNames.CONFIRMATION));
    });
  }, [updateConsumerForm, updateConsumerFormInstance, params, request]);

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
          updateConsumerFormInstance.confirmation();
        }}
      >
        <TextField
          label="Name"
          variant="standard"
          type="text"
          value={updateConsumerForm.name}
          onChange={(event) => updateConsumerFormInstance.onChange('name', event.target.value.toString())}
          helperText={updateConsumerFormInstance.getInputErrorMessage('name')}
          error={updateConsumerFormInstance.isInputInValid('name')}
          disabled={isUpdateConsumerApiProcessing}
        />

        <Box component="div" display="flex" alignItems="center" gap="10px" marginTop="20px">
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
