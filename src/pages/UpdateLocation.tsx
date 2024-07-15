import { FC } from 'react';
import UpdateLocationContent from '../components/UpdateLocation';
import ClearStateProvider from '../lib/providers/ClearStateProvider';

const UpdateLocation: FC = () => {
  return (
    <ClearStateProvider>
      <UpdateLocationContent />
    </ClearStateProvider>
  );
};

export default UpdateLocation;
