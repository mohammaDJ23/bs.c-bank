import { FC, useCallback } from 'react';
import { AccessTokenObj, getDynamicPath, getUserRoles, Pathes, reInitializeToken, UpdateUserByOwner } from '../../lib';
import Modal from '../shared/Modal';
import { ModalNames } from '../../store';
import { useAction, useAuth, useForm, useRequest } from '../../hooks';
import { Box, TextField, Button, Select, FormControl, MenuItem, InputLabel, FormHelperText } from '@mui/material';
import { UpdateUserByOwnerApi } from '../../apis';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

interface FormImportation {
  formInstance: ReturnType<typeof useForm<UpdateUserByOwner>>;
}

const Form: FC<FormImportation> = ({ formInstance }) => {
  const params = useParams();
  const navigate = useNavigate();
  const actions = useAction();
  const request = useRequest();
  const isUpdateUserByOwnerApiProcessing = request.isApiProcessing(UpdateUserByOwnerApi);
  const form = formInstance.getForm();
  const snackbar = useSnackbar();
  const auth = useAuth();
  const decodedToken = auth.getDecodedToken();

  const formSubmition = useCallback(() => {
    formInstance.onSubmit(() => {
      const isUserIdExist = !!params.id;
      if (!isUserIdExist) {
        return;
      }
      const userId = +params.id!;
      request
        .build<AccessTokenObj, UpdateUserByOwner>(new UpdateUserByOwnerApi(form, userId))
        .then((response) => {
          actions.hideModal(ModalNames.CONFIRMATION);
          formInstance.resetForm();

          if (decodedToken && decodedToken.id === userId) {
            reInitializeToken(response.data.accessToken);
          } else {
            snackbar.enqueueSnackbar({ message: 'You have updated the user successfully.', variant: 'success' });
          }
          navigate(getDynamicPath(Pathes.USER, { id: userId }));
        })
        .catch((err) => actions.hideModal(ModalNames.CONFIRMATION));
    });
  }, [formInstance, form, params, request]);

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
          formInstance.confirmation();
        }}
      >
        <TextField
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
          label="Phone"
          type="text"
          variant="standard"
          value={form.phone}
          onChange={(event) => formInstance.onChange('phone', event.target.value.trim())}
          helperText={formInstance.getInputErrorMessage('phone')}
          error={formInstance.isInputInValid('phone')}
          disabled={isUpdateUserByOwnerApiProcessing}
        />
        <FormControl variant="standard">
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
        <Box component="div" display="flex" alignItems="center" gap="10px" marginTop="20px">
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
