import FormContainer from '../../layout/FormContainer';
import { v4 as uuid } from 'uuid';
import { Box, TextField, Button, Select, FormControl, MenuItem, InputLabel, FormHelperText } from '@mui/material';
import { CreateUser, wait } from '../../lib';
import { useAuth, useForm, useRequest, useFocus, useAction } from '../../hooks';
import { CreateUserApi } from '../../apis';
import { FC, useCallback, useEffect, useRef } from 'react';
import { useSnackbar } from 'notistack';
import Navigation from '../../layout/Navigation';

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
  const formElIdRef = useRef(uuid());

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

  useEffect(() => {
    (async () => {
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
    <Navigation>
      <FormContainer>
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
            formSubmition();
          }}
        >
          <TextField
            sx={{ opacity: 0, transform: 'translateX(10px)' }}
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
          <TextField
            sx={{ opacity: 0, transform: 'translateX(20px)' }}
            label="Last Name"
            variant="standard"
            type="text"
            value={form.lastName}
            onChange={(event) => createUserFormInstance.onChange('lastName', event.target.value)}
            helperText={createUserFormInstance.getInputErrorMessage('lastName')}
            error={createUserFormInstance.isInputInValid('lastName')}
            disabled={isCreateUserApiProcessing}
          />
          <TextField
            sx={{ opacity: 0, transform: 'translateX(30px)' }}
            label="Email"
            type="email"
            variant="standard"
            value={form.email}
            onChange={(event) => createUserFormInstance.onChange('email', event.target.value.trim())}
            helperText={createUserFormInstance.getInputErrorMessage('email')}
            error={createUserFormInstance.isInputInValid('email')}
            disabled={isCreateUserApiProcessing}
          />
          <TextField
            sx={{ opacity: 0, transform: 'translateX(40px)' }}
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
          <TextField
            sx={{ opacity: 0, transform: 'translateX(50px)' }}
            label="Phone"
            type="text"
            variant="standard"
            value={form.phone}
            onChange={(event) => createUserFormInstance.onChange('phone', event.target.value.trim())}
            helperText={createUserFormInstance.getInputErrorMessage('phone')}
            error={createUserFormInstance.isInputInValid('phone')}
            disabled={isCreateUserApiProcessing}
          />
          <FormControl variant="standard" sx={{ opacity: 0, transform: 'translateX(60px)' }}>
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
          <Box
            sx={{ opacity: 0, transform: 'translateX(70px)' }}
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
        </Box>
      </FormContainer>
    </Navigation>
  );
};

export default CreateUserContent;
