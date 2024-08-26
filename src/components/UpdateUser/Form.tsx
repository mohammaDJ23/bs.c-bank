import { FC, useCallback, useEffect, useRef } from 'react';
import { getDynamicPath, Pathes, reInitializeToken, UpdateUser, wait } from '../../lib';
import Modal from '../shared/Modal';
import { ModalNames } from '../../store';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import { Box, TextField, Button } from '@mui/material';
import { UpdateUserApi } from '../../apis';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { useSnackbar } from 'notistack';

interface FormImportation {
  formInstance: ReturnType<typeof useForm<UpdateUser>>;
}

const Form: FC<FormImportation> = ({ formInstance }) => {
  const params = useParams();
  const navigate = useNavigate();
  const actions = useAction();
  const request = useRequest();
  const snackbar = useSnackbar();
  const selectors = useSelector();
  const isUpdateUserApiProcessing = request.isApiProcessing(UpdateUserApi);
  const isUpdateUserApiFailed = request.isProcessingApiFailed(UpdateUserApi);
  const isUpdateUserApiSuccessed = request.isProcessingApiSuccessed(UpdateUserApi);
  const updateUserApiExceptionMessage = request.getExceptionMessage(UpdateUserApi);
  const form = formInstance.getForm();
  const updatedUser = selectors.specificDetails.updatedUser;

  const formElIdRef = useRef(uuid());

  const formSubmition = useCallback(() => {
    formInstance.onSubmit(() => {
      actions.updateUser(form);
    });
  }, [form]);

  useEffect(() => {
    if (isUpdateUserApiSuccessed && updatedUser) {
      const userId = params.id as string;
      actions.hideModal(ModalNames.CONFIRMATION);
      formInstance.resetForm();
      reInitializeToken(updatedUser.accessToken);
      navigate(getDynamicPath(Pathes.USER, { id: userId }));
    } else if (isUpdateUserApiFailed && !updatedUser) {
      actions.hideModal(ModalNames.CONFIRMATION);
      snackbar.enqueueSnackbar({ message: updateUserApiExceptionMessage, variant: 'error' });
    }
  }, [isUpdateUserApiFailed, isUpdateUserApiSuccessed, updatedUser]);

  useEffect(() => {
    (async () => {
      await wait(10);

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
        component="form"
        noValidate
        autoComplete="off"
        display="flex"
        flexDirection="column"
        gap="20px"
        onSubmit={(event) => {
          event.preventDefault();
          formInstance.confirmation();
        }}
      >
        <TextField
          sx={{ opacity: 0, transform: 'translateX(10px)' }}
          label="First Name"
          variant="standard"
          type="text"
          value={form.firstName}
          onChange={(event) => formInstance.onChange('firstName', event.target.value)}
          helperText={formInstance.getInputErrorMessage('firstName')}
          error={formInstance.isInputInValid('firstName')}
          disabled={isUpdateUserApiProcessing}
        />
        <TextField
          sx={{ opacity: 0, transform: 'translateX(15px)' }}
          label="Last Name"
          variant="standard"
          type="text"
          value={form.lastName}
          onChange={(event) => formInstance.onChange('lastName', event.target.value)}
          helperText={formInstance.getInputErrorMessage('lastName')}
          error={formInstance.isInputInValid('lastName')}
          disabled={isUpdateUserApiProcessing}
        />
        <TextField
          sx={{ opacity: 0, transform: 'translateX(20px)' }}
          label="Email"
          type="email"
          variant="standard"
          value={form.email}
          onChange={(event) => formInstance.onChange('email', event.target.value.trim())}
          helperText={formInstance.getInputErrorMessage('email')}
          error={formInstance.isInputInValid('email')}
          disabled={isUpdateUserApiProcessing}
        />
        <TextField
          sx={{ opacity: 0, transform: 'translateX(25px)' }}
          label="Phone"
          type="text"
          variant="standard"
          value={form.phone}
          onChange={(event) => formInstance.onChange('phone', event.target.value.trim())}
          helperText={formInstance.getInputErrorMessage('phone')}
          error={formInstance.isInputInValid('phone')}
          disabled={isUpdateUserApiProcessing}
        />
        <Box
          sx={{ opacity: 0, transform: 'translateX(30px)' }}
          component="div"
          display="flex"
          alignItems="center"
          gap="10px"
          marginTop="20px"
        >
          <Button
            disabled={isUpdateUserApiProcessing || !formInstance.isFormValid()}
            variant="contained"
            size="small"
            type="submit"
            sx={{ textTransform: 'capitalize' }}
          >
            Update
          </Button>
          <Button
            disabled={isUpdateUserApiProcessing}
            variant="outlined"
            size="small"
            type="button"
            sx={{ textTransform: 'capitalize' }}
            onClick={() => formInstance.resetForm()}
          >
            Reset
          </Button>
        </Box>
      </Box>
      <Modal
        isLoading={isUpdateUserApiProcessing}
        isActive={formInstance.isConfirmationActive()}
        onCancel={() => actions.hideModal(ModalNames.CONFIRMATION)}
        onConfirm={formSubmition}
      />
    </>
  );
};

export default Form;
