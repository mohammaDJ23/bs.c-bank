import { useCallback, useRef } from 'react';
import {
  getToken,
  getTokenInfo,
  isUserAuthenticated,
  isUser,
  isAdmin,
  isOwner,
  getUserRoles,
  isSameUser,
  hasRole,
  hasUserAuthorized,
} from '../lib';
import { useSelector } from './useSelector';

export function useAuth() {
  const { specificDetails } = useSelector();

  const getUserStatus = useCallback(
    (id: number) => {
      return specificDetails.usersStatus[id];
    },
    [specificDetails]
  );

  const isUserStatusExit = useCallback(
    (id: number) => {
      return !!getUserStatus(id);
    },
    [specificDetails]
  );

  const isUserOnline = useCallback(
    (id: number) => {
      return isUserStatusExit(id) && !getUserStatus(id).lastConnection;
    },
    [specificDetails]
  );

  const getUserLastConnection = useCallback(
    (id: number) => {
      if (!isUserStatusExit(id)) {
        return undefined;
      }
      return getUserStatus(id).lastConnection;
    },
    [specificDetails]
  );

  const getUserStatusColor = useCallback(
    (id: number) => {
      return isUserOnline(id) ? '#00e81b' : '#e80000';
    },
    [isUserStatusExit]
  );

  return {
    getToken,
    getTokenInfo,
    isUserAuthenticated,
    isUser,
    isAdmin,
    isOwner,
    getUserRoles,
    isSameUser,
    hasRole,
    hasUserAuthorized,
    getUserStatusColor,
    isUserOnline,
    getUserLastConnection,
  };
}
