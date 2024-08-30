import { Box, SxProps } from '@mui/material';
import { FC, PropsWithChildren, useEffect, useRef } from 'react';
import { wait } from '../../lib';

interface Props extends PropsWithChildren {
  sx: SxProps;
}

const ResetStyleWithAnimation: FC<Props> = ({ children, sx }) => {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    (async () => {
      if (ref.current) {
        await wait(1);

        if (ref.current.children) {
          const observer = new IntersectionObserver(
            (entries, observer) => {
              for (const entry of entries) {
                if (entry.isIntersecting) {
                  for (const child of Array.from(ref.current!.children)) {
                    for (const key in sx) {
                      // @ts-ignore
                      child.style[key] = sx[key];
                    }
                  }
                  observer.unobserve(ref.current!);
                }
              }
            },
            { threshold: 0.5 }
          );
          observer.observe(ref.current);
        }
      }
    })();
  }, []);

  return (
    <Box sx={{ width: '100%', height: '100%' }} ref={ref}>
      {children}
    </Box>
  );
};

export default ResetStyleWithAnimation;
