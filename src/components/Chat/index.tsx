import { FC } from 'react';
import { app } from 'chat/ChatApp';
import { useAuth, useInitialMicro } from '../../hooks';
import Navigation from '../../layout/Navigation';

const ChatContent: FC = () => {
  const initialMicro = useInitialMicro(app);
  const auth = useAuth();
  const isCurrentOwner = auth.isCurrentOwner();

  return (
    <Navigation title={isCurrentOwner ? 'Conversations' : 'Contact support'}>
      <div ref={initialMicro.ref} />
    </Navigation>
  );
};

export default ChatContent;
