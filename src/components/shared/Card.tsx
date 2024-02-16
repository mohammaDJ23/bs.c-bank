import { Card as C, CardProps } from '@mui/material';
import { FC, PropsWithChildren, forwardRef } from 'react';

interface CardImportation extends CardProps {}

const Card: FC<PropsWithChildren<CardImportation>> = forwardRef((props, ref) => {
  return (
    <C
      {...props}
      ref={ref}
      style={{
        width: '100%',
        boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.1)',
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: '6px',
        ...props.style,
      }}
    >
      {props.children}
    </C>
  );
});

export default Card;
