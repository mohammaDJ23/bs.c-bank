import { UserServiceSocket } from '../reducers';
import { Socket } from 'socket.io-client';

export interface SetUserServiceConnectionSocketAction {
  type: UserServiceSocket.SET_CONNECTION_SOCKET;
  payload: { socket: Socket };
}

export type UserServiceSocketActions = SetUserServiceConnectionSocketAction;

export function setUserServiceConnectionSocket(socket: Socket): SetUserServiceConnectionSocketAction {
  return {
    type: UserServiceSocket.SET_CONNECTION_SOCKET,
    payload: { socket },
  };
}
