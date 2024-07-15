import { FC } from 'react';
import UpdateConsumerContent from '../components/UpdateConsumer';
import ClearStateProvider from '../lib/providers/ClearStateProvider';

const UpdateConsumer: FC = () => {
  return (
    <ClearStateProvider>
      <UpdateConsumerContent />
    </ClearStateProvider>
  );
};

export default UpdateConsumer;
