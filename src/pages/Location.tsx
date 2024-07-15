import { FC } from 'react';
import ClearStateProvider from '../lib/providers/ClearStateProvider';
import LocationContent from '../components/Location';

const Location: FC = () => {
  return (
    <ClearStateProvider>
      <LocationContent />
    </ClearStateProvider>
  );
};

export default Location;
