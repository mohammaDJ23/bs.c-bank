import { FC, PropsWithChildren } from 'react';
import { ThemeProvider as TP, createTheme } from '@mui/material/styles';
import { Mode } from '@mui/system/cssVars/useCurrentColorScheme';

export const modes: Mode[] = ['light', 'dark', 'system'];

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  return <TP theme={theme}>{children}</TP>;
};

export default ThemeProvider;
