import { FC } from 'react';
import ClearStateProvider from '../lib/providers/ClearStateProvider';
import LocationsContent from '../components/Locations';

const Locations: FC = () => {
  return (
    <ClearStateProvider>
      <LocationsContent />
    </ClearStateProvider>
  );
};

export default Locations;
