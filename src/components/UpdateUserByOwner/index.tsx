import FormContainer from '../../layout/FormContainer';
import Form from './Form';
import { UpdateUserByOwner, User } from '../../lib';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import { useEffect, FC } from 'react';
import { useParams } from 'react-router-dom';
import Skeleton from './Skeleton';
import { UserApi } from '../../apis';
import NotFound from './NotFound';
import Navigation from '../../layout/Navigation';

const UpdateUserByOwnerContent: FC = () => {
  const params = useParams();
  const actions = useAction();
  const selectors = useSelector();
  const request = useRequest();
  const updateUserByOwnerFormInstance = useForm(UpdateUserByOwner);
  const isInitialUserApiProcessing = request.isInitialApiProcessing(UserApi);

  useEffect(() => {
    const userId = params.id;
    if (userId) {
      request.build<User, number>(new UserApi(+userId).setInitialApi()).then((response) => {
        actions.setSpecificDetails('user', response.data);
        updateUserByOwnerFormInstance.initializeForm(
          new UpdateUserByOwner({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            phone: response.data.phone,
            role: response.data.role,
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
          <Form formInstance={updateUserByOwnerFormInstance} />
        ) : (
          <NotFound />
        )}
      </FormContainer>
    </Navigation>
  );
};

export default UpdateUserByOwnerContent;
