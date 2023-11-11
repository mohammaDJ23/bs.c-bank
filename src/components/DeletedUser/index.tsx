import { useEffect, FC } from 'react';
import DefaultContainer from '../../layout/DefaultContainer';
import { useParams } from 'react-router-dom';
import { useAction, useRequest, useSelector } from '../../hooks';
import Skeleton from '../shared/UserSkeleton';
import { UserWithBillInfoObj } from '../../lib';
import { DeletedUserApi } from '../../apis';
import NotFound from './NotFound';
import Details from './Details';
import Navigation from '../../layout/Navigation';

const UserContent: FC = () => {
  const request = useRequest();
  const params = useParams();
  const actions = useAction();
  const selectors = useSelector();
  const isDeletedUserApiProcessing = request.isInitialApiProcessing(DeletedUserApi);
  const user = selectors.specificDetails.deletedUser;

  useEffect(() => {
    const userId = params.id;
    if (userId) {
      request.build<UserWithBillInfoObj, number>(new DeletedUserApi(+userId).setInitialApi()).then((response) => {
        actions.setSpecificDetails('deletedUser', response.data);
      });
    }
  }, []);

  return (
    <Navigation>
      <DefaultContainer>
        {isDeletedUserApiProcessing ? <Skeleton /> : user ? <Details user={user} /> : <NotFound />}
      </DefaultContainer>
    </Navigation>
  );
};

export default UserContent;
