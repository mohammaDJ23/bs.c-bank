import { Fragment, useEffect, FC, PropsWithChildren } from 'react';
import { useAction } from '../../hooks';

const ClearStateProvider: FC<PropsWithChildren> = ({ children }) => {
  const actions = useAction();

  useEffect(() => {
    return () => {
      actions.clearState();
    };
  }, []);

  return <Fragment>{children}</Fragment>;
};

export default ClearStateProvider;
