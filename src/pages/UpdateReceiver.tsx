import { FC } from 'react';
import UpdateReceiverContent from '../components/UpdateReceiver';
import ClearStateProvider from '../lib/providers/ClearStateProvider';

const UpdateBill: FC = () => {
  return (
    <ClearStateProvider>
      <UpdateReceiverContent />
    </ClearStateProvider>
  );
};

export default UpdateBill;
