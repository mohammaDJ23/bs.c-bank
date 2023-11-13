import { useCallback } from 'react';
import {
  getToken,
  getDecodedToken,
  isUserAuthenticated,
  isUser,
  isAdmin,
  isOwner,
  getUserRoles,
  isUserEqualToCurrentUser,
  hasRole,
  hasRoleAuthorized,
  isCurrentUser,
  isCurrentAdmin,
  isCurrentOwner,
  hasAdminRoleAuthorized,
  hasCreatedByOwnerRoleAuthorized,
  hasOwnerRoleAuthorized,
  hasUserRoleAuthroized,
  isUserCreatedByCurrentUser,
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
      return isUserStatusExit(id) && getUserStatus(id).lastConnection === null;
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
    getDecodedToken,
    isUserAuthenticated,
    isUser,
    isAdmin,
    isOwner,
    getUserRoles,
    isUserEqualToCurrentUser,
    hasRole,
    hasRoleAuthorized,
    getUserStatusColor,
    isUserOnline,
    getUserLastConnection,
    isCurrentUser,
    isCurrentAdmin,
    isCurrentOwner,
    hasAdminRoleAuthorized,
    hasCreatedByOwnerRoleAuthorized,
    hasOwnerRoleAuthorized,
    hasUserRoleAuthroized,
    isUserCreatedByCurrentUser,
  };
}
