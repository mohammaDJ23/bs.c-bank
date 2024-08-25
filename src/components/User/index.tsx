import { useEffect, FC } from 'react';
import DefaultContainer from '../../layout/DefaultContainer';
import { useParams } from 'react-router-dom';
import { useAction, useRequest, useSelector } from '../../hooks';
import Skeleton from './Skeleton';
import { UserWithBillInfo } from '../../lib';
import { UserWithBillInfoApi } from '../../apis';
import NotFound from './NotFound';
import Details from './Details';
import Navigation from '../../layout/Navigation';

const UserContent: FC = () => {
  const request = useRequest();
  const params = useParams();
  const actions = useAction();
  const selectors = useSelector();
  const isUserWithBillInfoApiProcessing = request.isInitialApiProcessing(UserWithBillInfoApi);
  const user = selectors.specificDetails.userWithBillInfo;

  useEffect(() => {
    const userId = params.id;
    if (userId) {
      request.build<UserWithBillInfo, number>(new UserWithBillInfoApi(+userId).setInitialApi()).then((response) => {
        actions.setSpecificDetails('userWithBillInfo', response.data);
      });
    }
  }, []);

  return (
    <Navigation>
      <DefaultContainer>
        {isUserWithBillInfoApiProcessing ? <Skeleton /> : user ? <Details user={user} /> : <NotFound />}
      </DefaultContainer>
    </Navigation>
  );
};

export default UserContent;
