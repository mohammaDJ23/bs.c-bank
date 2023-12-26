import { RootActions, SetUserServiceConnectionSocketAction } from '../actions';
import { Socket } from 'socket.io-client';

export enum UserServiceSocket {
  SET_CONNECTION_SOCKET = 'SET_CONNECTION_SOCKET',
}

export interface SocketState {
  connection: Socket | null;
}

const initialState: SocketState = {
  connection: null,
};

function setUserServiceConnectionSocket(state: SocketState, action: SetUserServiceConnectionSocketAction): SocketState {
  return Object.assign({}, state, { connection: action.payload.socket });
}

export function userServiceSocketReducer(state: SocketState = initialState, actions: RootActions): SocketState {
  switch (actions.type) {
    case UserServiceSocket.SET_CONNECTION_SOCKET:
      return setUserServiceConnectionSocket(state, actions);

    default:
      return state;
  }
}
