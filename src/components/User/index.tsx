import { useEffect, FC } from 'react';
import DefaultContainer from '../../layout/DefaultContainer';
import { useParams } from 'react-router-dom';
import { useAction, useRequest, useSelector } from '../../hooks';
import Skeleton from './Skeleton';
import { UserWithBillInfoApi } from '../../apis';
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
  const isInitialUserWithBillInfoApiProcessing = request.isInitialApiProcessing(UserWithBillInfoApi);
  const isInitialUserWithBillInfoApiFailed = request.isInitialProcessingApiFailed(UserWithBillInfoApi);
  const initialUserWithBillInfoApiExceptionMessage = request.getInitialExceptionMessage(UserWithBillInfoApi);
  const user = selectors.specificDetails.userWithBillInfo;

  useEffect(() => {
    const id = params.id;
    if (id) {
      actions.getInitialUserWithBillInfo(+id);
    }
  }, []);

  useEffect(() => {
    if (isInitialUserWithBillInfoApiFailed) {
      snackbar.enqueueSnackbar({ message: initialUserWithBillInfoApiExceptionMessage, variant: 'error' });
    }
  }, [isInitialUserWithBillInfoApiFailed]);

  return (
    <Navigation>
      <DefaultContainer>
        {isInitialUserWithBillInfoApiProcessing ? <Skeleton /> : user ? <Details user={user} /> : <NotFound />}
      </DefaultContainer>
    </Navigation>
  );
};

export default UserContent;
