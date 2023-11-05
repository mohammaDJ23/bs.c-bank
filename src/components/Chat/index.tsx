import { FC } from 'react';
import { app } from 'chat/ChatApp';
import { useAuth, useInitialMicro } from '../../hooks';
import Navigation from '../../layout/Navigation';

const ChatContent: FC = () => {
  const { ref } = useInitialMicro(app);
  const { isOwner } = useAuth();
  const isUserOwner = isOwner();

  return (
    <Navigation title={isUserOwner ? 'Conversations' : 'Contact support'}>
      <div ref={ref} />
    </Navigation>
  );
};

export default ChatContent;
