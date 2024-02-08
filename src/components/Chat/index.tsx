import { FC } from 'react';
import { app } from 'chat/ChatApp';
import { useAuth, useInitialMicro } from '../../hooks';
import Navigation from '../../layout/Navigation';
import { Box, styled } from '@mui/material';

const ChatContentWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  marginTop: '-64px',
  paddingTop: '64px',

  [theme.breakpoints.down('sm')]: {
    marginTop: '-48px',
    paddingTop: '48px',
  },
}));

const ChatContent: FC = () => {
  const initialMicro = useInitialMicro(app);
  const auth = useAuth();
  const isCurrentOwner = auth.isCurrentOwner();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Navigation title={isCurrentOwner ? 'Conversations' : 'Contact support'}></Navigation>
      <ChatContentWrapper ref={initialMicro.ref} />
    </Box>
  );
};

export default ChatContent;
