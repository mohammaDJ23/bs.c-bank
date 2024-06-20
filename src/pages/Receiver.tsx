import { FC } from 'react';
import ClearStateProvider from '../lib/providers/ClearStateProvider';
import ReceiverContent from '../components/Receiver';

const Receivers: FC = () => {
  return (
    <ClearStateProvider>
      <ReceiverContent />
    </ClearStateProvider>
  );
};

export default Receivers;
