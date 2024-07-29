import { getDynamicPath, Pathes, LocationObj, UpdateLocation, wait } from '../../lib';
import { FC, useCallback, useEffect, useRef } from 'react';
import { Box, TextField, Button } from '@mui/material';
import Modal from '../shared/Modal';
import { useAction, useForm, useRequest } from '../../hooks';
import { ModalNames } from '../../store';
import { UpdateLocationApi } from '../../apis';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { v4 as uuid } from 'uuid';

interface FormImportation {
  formInstance: ReturnType<typeof useForm<UpdateLocation>>;
}

const Form: FC<FormImportation> = ({ formInstance: updateLocationFormInstance }) => {
  const params = useParams();
  const actions = useAction();
  const navigate = useNavigate();
  const request = useRequest();
  const isUpdateLocationApiProcessing = request.isApiProcessing(UpdateLocationApi);
  const updateLocationForm = updateLocationFormInstance.getForm();
  const snackbar = useSnackbar();
  const formElIdRef = useRef(uuid());

  const formSubmition = useCallback(() => {
    updateLocationFormInstance.onSubmit(() => {
      request
        .build<LocationObj, UpdateLocation>(new UpdateLocationApi(updateLocationForm))
        .then((response) => {
          const locationId = params.id as string;
          actions.hideModal(ModalNames.CONFIRMATION);
          updateLocationFormInstance.resetForm();
          snackbar.enqueueSnackbar({ message: 'You have updated the location successfully.', variant: 'success' });
          navigate(getDynamicPath(Pathes.LOCATION, { id: locationId }));
        })
        .catch((err) => actions.hideModal(ModalNames.CONFIRMATION));
    });
  }, [updateLocationForm, updateLocationFormInstance, params, request]);

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
          updateLocationFormInstance.confirmation();
        }}
      >
        <TextField
          sx={{ opacity: 0, transform: 'translateX(10px)' }}
          label="Name"
          variant="standard"
          type="text"
          value={updateLocationForm.name}
          onChange={(event) => updateLocationFormInstance.onChange('name', event.target.value.toString())}
          helperText={updateLocationFormInstance.getInputErrorMessage('name')}
          error={updateLocationFormInstance.isInputInValid('name')}
          disabled={isUpdateLocationApiProcessing}
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
            disabled={isUpdateLocationApiProcessing || !updateLocationFormInstance.isFormValid()}
            variant="contained"
            size="small"
            type="submit"
            sx={{ textTransform: 'capitalize' }}
          >
            Update
          </Button>
          <Button
            disabled={isUpdateLocationApiProcessing}
            variant="outlined"
            size="small"
            type="button"
            sx={{ textTransform: 'capitalize' }}
            onClick={() => updateLocationFormInstance.resetForm()}
          >
            Reset
          </Button>
        </Box>
      </Box>
      <Modal
        isLoading={isUpdateLocationApiProcessing}
        isActive={updateLocationFormInstance.isConfirmationActive()}
        onCancel={() => actions.hideModal(ModalNames.CONFIRMATION)}
        onConfirm={formSubmition}
      />
    </>
  );
};

export default Form;
