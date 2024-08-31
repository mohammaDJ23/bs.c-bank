import { FC, useCallback, useEffect } from 'react';
import { getDynamicPath, Pathes, reInitializeToken, UpdateUser } from '../../lib';
import Modal from '../shared/Modal';
import { ModalNames } from '../../store';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import { Box, TextField, Button } from '@mui/material';
import { UpdateUserApi } from '../../apis';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import ResetStyleWithAnimation from '../shared/ResetStyleWithAnimation';

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
          formInstance.confirmation();
        }}
      >
        <ResetStyleWithAnimation sx={{ opacity: '1', transform: 'translateY(0)' }}>
          <TextField
            sx={{
              width: '100%',
              opacity: 0,
              transform: 'translateY(10px)',
              transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
            }}
            label="First Name"
            variant="standard"
            type="text"
            value={form.firstName}
            onChange={(event) => formInstance.onChange('firstName', event.target.value)}
            helperText={formInstance.getInputErrorMessage('firstName')}
            error={formInstance.isInputInValid('firstName')}
            disabled={isUpdateUserApiProcessing}
          />
        </ResetStyleWithAnimation>

        <ResetStyleWithAnimation sx={{ opacity: '1', transform: 'translateY(0)' }}>
          <TextField
            sx={{
              width: '100%',
              opacity: 0,
              transform: 'translateY(15px)',
              transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
              transitionDelay: '0.03s',
            }}
            label="Last Name"
            variant="standard"
            type="text"
            value={form.lastName}
            onChange={(event) => formInstance.onChange('lastName', event.target.value)}
            helperText={formInstance.getInputErrorMessage('lastName')}
            error={formInstance.isInputInValid('lastName')}
            disabled={isUpdateUserApiProcessing}
          />
        </ResetStyleWithAnimation>

        <ResetStyleWithAnimation sx={{ opacity: '1', transform: 'translateY(0)' }}>
          <TextField
            sx={{
              width: '100%',
              opacity: 0,
              transform: 'translateY(20px)',
              transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
              transitionDelay: '0.06s',
            }}
            label="Email"
            type="email"
            variant="standard"
            value={form.email}
            onChange={(event) => formInstance.onChange('email', event.target.value.trim())}
            helperText={formInstance.getInputErrorMessage('email')}
            error={formInstance.isInputInValid('email')}
            disabled={isUpdateUserApiProcessing}
          />
        </ResetStyleWithAnimation>

        <ResetStyleWithAnimation sx={{ opacity: '1', transform: 'translateY(0)' }}>
          <TextField
            sx={{
              width: '100%',
              opacity: 0,
              transform: 'translateY(25px)',
              transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
              transitionDelay: '0.09s',
            }}
            label="Phone"
            type="text"
            variant="standard"
            value={form.phone}
            onChange={(event) => formInstance.onChange('phone', event.target.value.trim())}
            helperText={formInstance.getInputErrorMessage('phone')}
            error={formInstance.isInputInValid('phone')}
            disabled={isUpdateUserApiProcessing}
          />
        </ResetStyleWithAnimation>

        <ResetStyleWithAnimation sx={{ opacity: '1', transform: 'translateY(0)' }}>
          <Box
            sx={{
              width: '100%',
              opacity: 0,
              transform: 'translateY(30px)',
              transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
              transitionDelay: '0.12s',
            }}
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
        </ResetStyleWithAnimation>
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
