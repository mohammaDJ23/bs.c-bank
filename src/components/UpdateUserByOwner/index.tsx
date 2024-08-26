import FormContainer from '../../layout/FormContainer';
import Form from './Form';
import { UpdateUserByOwner } from '../../lib';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import { useEffect, FC } from 'react';
import { useParams } from 'react-router-dom';
import Skeleton from './Skeleton';
import { UserApi } from '../../apis';
import NotFound from './NotFound';
import Navigation from '../../layout/Navigation';
import { useSnackbar } from 'notistack';

const UpdateUserByOwnerContent: FC = () => {
  const params = useParams();
  const actions = useAction();
  const selectors = useSelector();
  const request = useRequest();
  const snackbar = useSnackbar();
  const updateUserByOwnerFormInstance = useForm(UpdateUserByOwner);
  const isInitialUserApiProcessing = request.isInitialApiProcessing(UserApi);
  const isInitialUserApiFailed = request.isInitialProcessingApiFailed(UserApi);
  const isInitialUserApiSuccessed = request.isInitialProcessingApiSuccessed(UserApi);
  const initialUserApiExceptionMessage = request.getInitialExceptionMessage(UserApi);
  const user = selectors.specificDetails.user;

  useEffect(() => {
    const id = params.id;
    if (id) {
      actions.getInitialUser(+id);
    }
  }, []);

  useEffect(() => {
    if (isInitialUserApiSuccessed && user) {
      updateUserByOwnerFormInstance.initializeForm(
        new UpdateUserByOwner({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
        })
      );
    } else if (isInitialUserApiFailed && !user) {
      snackbar.enqueueSnackbar({ message: initialUserApiExceptionMessage, variant: 'error' });
    }
  }, [isInitialUserApiFailed, isInitialUserApiSuccessed, user]);

  return (
    <Navigation>
      <FormContainer>
        {isInitialUserApiProcessing ? (
          <Skeleton />
        ) : selectors.specificDetails.user ? (
          <Form formInstance={updateUserByOwnerFormInstance} />
        ) : (
          <NotFound />
        )}
      </FormContainer>
    </Navigation>
  );
};

export default UpdateUserByOwnerContent;
