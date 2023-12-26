import { io } from 'socket.io-client';
import { getToken } from '../auth';

export function getUserServiceConnectionSocket() {
  return io(`${process.env.USER_SERVICE}`, {
    path: '/api/v1/user/socket/connection',
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: `Bearer ${getToken()}`,
        },
      },
    },
  });
}
