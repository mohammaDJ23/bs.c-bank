import DefaultContainer from '../../layout/DefaultContainer';
import { useParams } from 'react-router-dom';
import { useAction, useRequest, useSelector } from '../../hooks';
import { useEffect, FC } from 'react';
import Skeleton from '../shared/BillSkeleton';
import { DeletedBillApi } from '../../apis';
import { BillObj } from '../../lib';
import NotFound from './NotFound';
import Details from './Details';
import Navigation from '../../layout/Navigation';

const DeletedBillContent: FC = () => {
  const params = useParams();
  const request = useRequest();
  const actions = useAction();
  const selectors = useSelector();
  const isInitialDeletedBillApiProcessing = request.isInitialApiProcessing(DeletedBillApi);
  const deletedBill = selectors.specificDetails.deletedBill;

  useEffect(() => {
    const billId = params.id;
    if (billId) {
      request.build<BillObj, string>(new DeletedBillApi(billId).setInitialApi()).then((response) => {
        actions.setSpecificDetails('deletedBill', response.data);
      });
    }
  }, []);

  return (
    <Navigation>
      <DefaultContainer>
        {isInitialDeletedBillApiProcessing ? <Skeleton /> : deletedBill ? <Details bill={deletedBill} /> : <NotFound />}
      </DefaultContainer>
    </Navigation>
  );
};

export default DeletedBillContent;
