import DefaultContainer from '../../layout/DefaultContainer';
import { useParams } from 'react-router-dom';
import { useAction, useRequest, useSelector } from '../../hooks';
import { useEffect, FC } from 'react';
import Skeleton from './Skeleton';
import { BillApi } from '../../apis';
import { BillObj } from '../../lib';
import NotFound from './NotFound';
import Details from './Details';
import Navigation from '../../layout/Navigation';

const BillContent: FC = () => {
  const params = useParams();
  const request = useRequest();
  const actions = useAction();
  const selectors = useSelector();
  const isInitialBillApiProcessing = request.isInitialApiProcessing(BillApi);
  const bill = selectors.specificDetails.bill;

  useEffect(() => {
    const billId = params.id;
    if (billId) {
      request.build<BillObj, string>(new BillApi(billId).setInitialApi()).then((response) => {
        actions.setSpecificDetails('bill', response.data);
      });
    }
  }, []);

  return (
    <Navigation>
      <DefaultContainer>
        {isInitialBillApiProcessing ? <Skeleton /> : bill ? <Details bill={bill} /> : <NotFound />}
      </DefaultContainer>
    </Navigation>
  );
};

export default BillContent;
