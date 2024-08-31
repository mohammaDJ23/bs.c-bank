import FormContainer from '../../layout/FormContainer';
import { Box, TextField, Button, Select, FormControl, MenuItem, InputLabel, FormHelperText } from '@mui/material';
import { CreateUser } from '../../lib';
import { useAuth, useForm, useRequest, useFocus, useAction } from '../../hooks';
import { CreateUserApi } from '../../apis';
import { FC, useCallback, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import Navigation from '../../layout/Navigation';
import ResetStyleWithAnimation from '../shared/ResetStyleWithAnimation';

const CreateUserContent: FC = () => {
  const auth = useAuth();
  const createUserFormInstance = useForm(CreateUser);
  const request = useRequest();
  const focus = useFocus();
  const actions = useAction();
  const isCreateUserApiProcessing = request.isApiProcessing(CreateUserApi);
  const isCreateUserApiSuccessed = request.isProcessingApiSuccessed(CreateUserApi);
  const isCreateUserApiFailed = request.isProcessingApiFailed(CreateUserApi);
  const createUserApiExceptionMessage = request.getExceptionMessage(CreateUserApi);
  const form = createUserFormInstance.getForm();
  const snackbar = useSnackbar();

  const formSubmition = useCallback(() => {
    createUserFormInstance.onSubmit(() => {
      actions.createUser(form);
    });
  }, [createUserFormInstance, form]);

  useEffect(() => {
    if (isCreateUserApiSuccessed) {
      createUserFormInstance.resetForm();
      snackbar.enqueueSnackbar({ message: 'Your have created a new user successfully.', variant: 'success' });
      focus('firstName');
    } else if (isCreateUserApiFailed) {
      snackbar.enqueueSnackbar({ message: createUserApiExceptionMessage, variant: 'error' });
    }
  }, [isCreateUserApiSuccessed, isCreateUserApiFailed]);

  useEffect(() => {
    focus('firstName');
  }, []);

  return (
    <Navigation>
      <FormContainer>
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
            formSubmition();
          }}
        >
          <ResetStyleWithAnimation sx={{ opacity: 1, transform: 'translateY(0)' }}>
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
              onChange={(event) => createUserFormInstance.onChange('firstName', event.target.value)}
              helperText={createUserFormInstance.getInputErrorMessage('firstName')}
              error={createUserFormInstance.isInputInValid('firstName')}
              disabled={isCreateUserApiProcessing}
              name="firstName"
            />
          </ResetStyleWithAnimation>
          <ResetStyleWithAnimation sx={{ opacity: 1, transform: 'translateY(0)' }}>
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
              onChange={(event) => createUserFormInstance.onChange('lastName', event.target.value)}
              helperText={createUserFormInstance.getInputErrorMessage('lastName')}
              error={createUserFormInstance.isInputInValid('lastName')}
              disabled={isCreateUserApiProcessing}
            />
          </ResetStyleWithAnimation>
          <ResetStyleWithAnimation sx={{ opacity: 1, transform: 'translateY(0)' }}>
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
              onChange={(event) => createUserFormInstance.onChange('email', event.target.value.trim())}
              helperText={createUserFormInstance.getInputErrorMessage('email')}
              error={createUserFormInstance.isInputInValid('email')}
              disabled={isCreateUserApiProcessing}
            />
          </ResetStyleWithAnimation>
          <ResetStyleWithAnimation sx={{ opacity: 1, transform: 'translateY(0)' }}>
            <TextField
              sx={{
                width: '100%',
                opacity: 0,
                transform: 'translateY(25px)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                transitionDelay: '0.09s',
              }}
              label="Password"
              type="password"
              variant="standard"
              value={form.password}
              autoComplete="off"
              onChange={(event) => createUserFormInstance.onChange('password', event.target.value.trim())}
              helperText={createUserFormInstance.getInputErrorMessage('password')}
              error={createUserFormInstance.isInputInValid('password')}
              disabled={isCreateUserApiProcessing}
            />
          </ResetStyleWithAnimation>
          <ResetStyleWithAnimation sx={{ opacity: 1, transform: 'translateY(0)' }}>
            <TextField
              sx={{
                width: '100%',
                opacity: 0,
                transform: 'translateY(30px)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                transitionDelay: '0.12s',
              }}
              label="Phone"
              type="text"
              variant="standard"
              value={form.phone}
              onChange={(event) => createUserFormInstance.onChange('phone', event.target.value.trim())}
              helperText={createUserFormInstance.getInputErrorMessage('phone')}
              error={createUserFormInstance.isInputInValid('phone')}
              disabled={isCreateUserApiProcessing}
            />
          </ResetStyleWithAnimation>
          <ResetStyleWithAnimation sx={{ opacity: 1, transform: 'translateY(0)' }}>
            <FormControl
              variant="standard"
              sx={{
                width: '100%',
                opacity: 0,
                transform: 'translateY(35px)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                transitionDelay: '0.15s',
              }}
            >
              <InputLabel id="role">Role</InputLabel>
              <Select
                disabled={isCreateUserApiProcessing}
                labelId="role"
                id="role"
                value={form.role}
                onChange={(event) => createUserFormInstance.onChange('role', event.target.value)}
                label="Role"
                error={createUserFormInstance.isInputInValid('role')}
              >
                {auth.getUserRoles().map((el) => (
                  <MenuItem key={el.value} value={el.value}>
                    {el.label}
                  </MenuItem>
                ))}
              </Select>
              {createUserFormInstance.isInputInValid('role') && (
                <FormHelperText>{createUserFormInstance.getInputErrorMessage('role')}</FormHelperText>
              )}
            </FormControl>
          </ResetStyleWithAnimation>
          <ResetStyleWithAnimation sx={{ opacity: 1, transform: 'translateY(0)' }}>
            <Box
              sx={{
                width: '100%',
                opacity: 0,
                transform: 'translateY(40px)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                transitionDelay: '0.18s',
              }}
              component="div"
              display="flex"
              alignItems="center"
              gap="10px"
              marginTop="20px"
            >
              <Button
                disabled={isCreateUserApiProcessing || !createUserFormInstance.isFormValid()}
                variant="contained"
                size="small"
                type="submit"
                sx={{ textTransform: 'capitalize' }}
              >
                Create
              </Button>
              <Button
                disabled={isCreateUserApiProcessing}
                variant="outlined"
                size="small"
                type="button"
                sx={{ textTransform: 'capitalize' }}
                onClick={() => createUserFormInstance.resetForm()}
              >
                Reset
              </Button>
            </Box>
          </ResetStyleWithAnimation>
        </Box>
      </FormContainer>
    </Navigation>
  );
};

export default CreateUserContent;
