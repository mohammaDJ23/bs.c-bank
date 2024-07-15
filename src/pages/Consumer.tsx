import { FC } from 'react';
import ClearStateProvider from '../lib/providers/ClearStateProvider';
import ConsumerContent from '../components/Consumer';

const Consumer: FC = () => {
  return (
    <ClearStateProvider>
      <ConsumerContent />
    </ClearStateProvider>
  );
};

export default Consumer;
