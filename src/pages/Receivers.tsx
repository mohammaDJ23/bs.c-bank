import { FC } from 'react';
import ClearStateProvider from '../lib/providers/ClearStateProvider';
import ReceiversContent from '../components/Receivers';

const Receivers: FC = () => {
  return (
    <ClearStateProvider>
      <ReceiversContent />
    </ClearStateProvider>
  );
};

export default Receivers;
