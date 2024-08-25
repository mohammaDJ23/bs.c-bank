import FormContainer from '../../layout/FormContainer';
import Form from './Form';
import { UpdateUser, User } from '../../lib';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import { useEffect, FC } from 'react';
import { useParams } from 'react-router-dom';
import Skeleton from './Skeleton';
import { UserApi } from '../../apis';
import NotFound from './NotFound';
import Navigation from '../../layout/Navigation';

const UpdateUserContent: FC = () => {
  const params = useParams();
  const actions = useAction();
  const selectors = useSelector();
  const request = useRequest();
  const updateUserFormInstance = useForm(UpdateUser);
  const isInitialUserApiProcessing = request.isInitialApiProcessing(UserApi);

  useEffect(() => {
    const userId = params.id;
    if (userId) {
      request.build<User, number>(new UserApi(+userId).setInitialApi()).then((response) => {
        actions.setSpecificDetails('user', response.data);
        updateUserFormInstance.initializeForm(
          new UpdateUser({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            phone: response.data.phone,
          })
        );
      });
    }
  }, []);

  return (
    <Navigation>
      <FormContainer>
        {isInitialUserApiProcessing ? (
          <Skeleton />
        ) : selectors.specificDetails.user ? (
          <Form formInstance={updateUserFormInstance} />
        ) : (
          <NotFound />
        )}
      </FormContainer>
    </Navigation>
  );
};

export default UpdateUserContent;
