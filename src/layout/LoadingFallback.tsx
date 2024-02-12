import { FC } from 'react';
import { SyncLoader } from 'react-spinners';

const LoadingFallback: FC = () => {
  return (
    <SyncLoader
      size="10px"
      color="#20a0ff"
      cssOverride={{
        position: 'fixed',
        zIndex: 1000,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
};

export default LoadingFallback;
