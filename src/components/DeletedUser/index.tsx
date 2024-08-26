import { useEffect, FC } from 'react';
import DefaultContainer from '../../layout/DefaultContainer';
import { useParams } from 'react-router-dom';
import { useAction, useRequest, useSelector } from '../../hooks';
import Skeleton from '../shared/UserSkeleton';
import { UserWithBillInfo } from '../../lib';
import { DeletedUserApi } from '../../apis';
import NotFound from './NotFound';
import Details from './Details';
import Navigation from '../../layout/Navigation';
import { useSnackbar } from 'notistack';

const UserContent: FC = () => {
  const request = useRequest();
  const params = useParams();
  const actions = useAction();
  const selectors = useSelector();
  const snackbar = useSnackbar();
  const isInitialDeletedUserApiProcessing = request.isInitialApiProcessing(DeletedUserApi);
  const isInitialDeletedUserApiFailed = request.isInitialProcessingApiFailed(DeletedUserApi);
  const initialDeletedUserApiExceptionMessage = request.getInitialExceptionMessage(DeletedUserApi);
  const user = selectors.specificDetails.deletedUser;

  useEffect(() => {
    const id = params.id;
    if (id) {
      actions.getInitialDeletedUser(+id);
    }
  }, []);

  useEffect(() => {
    if (isInitialDeletedUserApiFailed) {
      snackbar.enqueueSnackbar({ message: initialDeletedUserApiExceptionMessage, variant: 'error' });
    }
  }, [isInitialDeletedUserApiFailed]);

  return (
    <Navigation>
      <DefaultContainer>
        {isInitialDeletedUserApiProcessing ? <Skeleton /> : user ? <Details user={user} /> : <NotFound />}
      </DefaultContainer>
    </Navigation>
  );
};

export default UserContent;
