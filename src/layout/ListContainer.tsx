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
  wordBreak: 'break-word',
  transition: 'all 0.3s',
  padding: '0 16px 16px 16px',
  [theme.breakpoints.up('xl')]: {
    maxWidth: '1000px',
  },
  [theme.breakpoints.down('xl')]: {
    maxWidth: '900px',
  },
  [theme.breakpoints.down('lg')]: {
    maxWidth: '800px',
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: '700px',
  },
}));

const ListContainer: FC<PropsWithChildren> = ({ children }) => {
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

export default ListContainer;
