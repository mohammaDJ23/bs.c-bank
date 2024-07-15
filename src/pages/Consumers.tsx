import { FC } from 'react';
import ClearStateProvider from '../lib/providers/ClearStateProvider';
import ConsumersContent from '../components/Consumers';

const Consumers: FC = () => {
  return (
    <ClearStateProvider>
      <ConsumersContent />
    </ClearStateProvider>
  );
};

export default Consumers;
