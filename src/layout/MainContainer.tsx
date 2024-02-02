import { styled, Box } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

const Container = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  overflow: 'hidden',
}));

const Wrapper = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  overflow: 'auto',
}));

const Content = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  margin: 'auto',
  wordBreak: 'break-all',
  transition: 'all 0.3s',
  padding: '16px 24px',
  [theme.breakpoints.up('xl')]: {
    maxWidth: '1550px',
  },
  [theme.breakpoints.down('xl')]: {
    maxWidth: '100%',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '16px',
  },
}));

const MainContainer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Container>
      <Wrapper>
        <Content>
          <Box>{children}</Box>
        </Content>
      </Wrapper>
    </Container>
  );
};

export default MainContainer;
