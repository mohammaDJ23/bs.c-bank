import { useCallback } from 'react';
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

  const isUserStatusExit = useCallback(
    (id: number) => {
      return !!specificDetails.usersStatus[id];
    },
    [specificDetails]
  );

  const getUserStatusColor = useCallback(
    (id: number) => {
      return isUserStatusExit(id) ? '#00e81b' : '#e80000';
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
  };
}
