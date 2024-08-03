import { FC, PropsWithChildren } from 'react';
import { CardContent as CC } from '@mui/material';

const CardContent: FC<PropsWithChildren> = ({ children }) => {
  return <CC sx={{ padding: '16px', paddingBottom: '16px !important' }}>{children}</CC>;
};

export default CardContent;
