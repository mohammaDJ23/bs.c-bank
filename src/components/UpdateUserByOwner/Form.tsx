import { FC, useCallback, useEffect } from 'react';
import { getDynamicPath, getUserRoles, Pathes, reInitializeToken, UpdateUserByOwner } from '../../lib';
import Modal from '../shared/Modal';
import { ModalNames } from '../../store';
import { useAction, useAuth, useForm, useRequest, useSelector } from '../../hooks';
import { Box, TextField, Button, Select, FormControl, MenuItem, InputLabel, FormHelperText } from '@mui/material';
import { UpdateUserByOwnerApi } from '../../apis';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import ResetStyleWithAnimation from '../shared/ResetStyleWithAnimation';

interface FormImportation {
  formInstance: ReturnType<typeof useForm<UpdateUserByOwner>>;
}

const Form: FC<FormImportation> = ({ formInstance }) => {
  const params = useParams();
  const navigate = useNavigate();
  const actions = useAction();
  const selectors = useSelector();
  const request = useRequest();
  const isUpdateUserByOwnerApiProcessing = request.isApiProcessing(UpdateUserByOwnerApi);
  const isUpdateUserByOwnerApiFailed = request.isProcessingApiFailed(UpdateUserByOwnerApi);
  const isUpdateUserByOwnerApiSuccessed = request.isProcessingApiSuccessed(UpdateUserByOwnerApi);
  const updateUserByOwnerApiExceptionMessage = request.getExceptionMessage(UpdateUserByOwnerApi);
  const form = formInstance.getForm();
  const snackbar = useSnackbar();
  const auth = useAuth();
  const decodedToken = auth.getDecodedToken();
  const updatedUserByOwner = selectors.specificDetails.updatedUserByOwner;

  const formSubmition = useCallback(() => {
    formInstance.onSubmit(() => {
      actions.updateUserByOwner(form, +(params.id as string));
    });
  }, [formInstance, form]);

  useEffect(() => {
    if (isUpdateUserByOwnerApiSuccessed && updatedUserByOwner) {
      const id = params.id as string;
      actions.hideModal(ModalNames.CONFIRMATION);
      formInstance.resetForm();
      if (decodedToken && decodedToken.id === +id) {
        reInitializeToken(updatedUserByOwner.accessToken);
      } else {
        snackbar.enqueueSnackbar({ message: 'You have updated the user successfully.', variant: 'success' });
      }
      navigate(getDynamicPath(Pathes.USER, { id }));
    } else if (isUpdateUserByOwnerApiFailed && !updatedUserByOwner) {
      actions.hideModal(ModalNames.CONFIRMATION);
      snackbar.enqueueSnackbar({ message: updateUserByOwnerApiExceptionMessage, variant: 'error' });
    }
  }, [isUpdateUserByOwnerApiFailed, isUpdateUserByOwnerApiSuccessed, updatedUserByOwner]);

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
            disabled={isUpdateUserByOwnerApiProcessing}
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
            disabled={isUpdateUserByOwnerApiProcessing}
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
            disabled={isUpdateUserByOwnerApiProcessing}
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
            disabled={isUpdateUserByOwnerApiProcessing}
          />
        </ResetStyleWithAnimation>

        <ResetStyleWithAnimation sx={{ opacity: '1', transform: 'translateY(0)' }}>
          <FormControl
            variant="standard"
            sx={{
              width: '100%',
              opacity: 0,
              transform: 'translateY(30px)',
              transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
              transitionDelay: '0.12s',
            }}
          >
            <InputLabel id="role">Role</InputLabel>
            <Select
              labelId="role"
              id="role"
              value={form.role}
              onChange={(event) => formInstance.onChange('role', event.target.value)}
              label="Role"
              error={formInstance.isInputInValid('role')}
            >
              {getUserRoles().map((el) => (
                <MenuItem key={el.value} value={el.value}>
                  {el.label}
                </MenuItem>
              ))}
            </Select>
            {formInstance.isInputInValid('role') && (
              <FormHelperText>{formInstance.getInputErrorMessage('role')}</FormHelperText>
            )}
          </FormControl>
        </ResetStyleWithAnimation>

        <ResetStyleWithAnimation sx={{ opacity: '1', transform: 'translateY(0)' }}>
          <Box
            sx={{
              width: '100%',
              opacity: 0,
              transform: 'translateY(30px)',
              transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
              transitionDelay: '0.15s',
            }}
            component="div"
            display="flex"
            alignItems="center"
            gap="10px"
            marginTop="20px"
          >
            <Button
              disabled={isUpdateUserByOwnerApiProcessing || !formInstance.isFormValid()}
              variant="contained"
              size="small"
              type="submit"
              sx={{ textTransform: 'capitalize' }}
            >
              Update
            </Button>
            <Button
              disabled={isUpdateUserByOwnerApiProcessing}
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
        isLoading={isUpdateUserByOwnerApiProcessing}
        isActive={formInstance.isConfirmationActive()}
        onCancel={() => actions.hideModal(ModalNames.CONFIRMATION)}
        onConfirm={formSubmition}
      />
    </>
  );
};

export default Form;
