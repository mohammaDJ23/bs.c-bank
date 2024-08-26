import { FC, useCallback, useEffect, useRef } from 'react';
import { getDynamicPath, getUserRoles, Pathes, reInitializeToken, UpdateUserByOwner, wait } from '../../lib';
import Modal from '../shared/Modal';
import { ModalNames } from '../../store';
import { useAction, useAuth, useForm, useRequest, useSelector } from '../../hooks';
import { Box, TextField, Button, Select, FormControl, MenuItem, InputLabel, FormHelperText } from '@mui/material';
import { UpdateUserByOwnerApi } from '../../apis';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { v4 as uuid } from 'uuid';

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
  const formElIdRef = useRef(uuid());
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
          disabled={isUpdateUserByOwnerApiProcessing}
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
          disabled={isUpdateUserByOwnerApiProcessing}
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
          disabled={isUpdateUserByOwnerApiProcessing}
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
          disabled={isUpdateUserByOwnerApiProcessing}
        />
        <FormControl variant="standard" sx={{ opacity: 0, transform: 'translateX(30px)' }}>
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
        <Box
          sx={{ opacity: 0, transform: 'translateX(35px)' }}
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
