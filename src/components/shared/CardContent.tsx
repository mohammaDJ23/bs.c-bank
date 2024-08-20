import { FC, PropsWithChildren } from 'react';
import { CardContent as CC, CardContentProps } from '@mui/material';

interface Props extends CardContentProps, PropsWithChildren {}

const CardContent: FC<Props> = ({ children, ...props }) => {
  return (
    <CC sx={{ padding: '16px', paddingBottom: '16px !important' }} {...props}>
      {children}
    </CC>
  );
};

export default CardContent;
