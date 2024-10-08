import { decodeToken } from 'react-jwt';
import { getTime, LocalStorage, User } from '../';

export enum UserRoles {
  OWNER = 'owner',
  ADMIN = 'admin',
  USER = 'user',
}

export interface DecodedToken {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRoles;
  expiration: number;
  parentId: number;
}

export interface UserStatusObj extends DecodedToken {
  lastConnection: Date | null;
}

export interface AccessTokenObj {
  accessToken: string;
}

export function getUserRoles() {
  return [
    { value: UserRoles.OWNER, label: UserRoles.OWNER },
    { value: UserRoles.ADMIN, label: UserRoles.ADMIN },
    { value: UserRoles.USER, label: UserRoles.USER },
  ];
}

export function getToken(): string {
  const token = LocalStorage.getItem<string>('access_token');
  const tokenExpiration = LocalStorage.getItem<number>('access_token_expiration');

  if (token && tokenExpiration) if (getTime() < getTime(tokenExpiration)) return token;

  return '';
}

export function getDecodedToken(token: string = ''): DecodedToken | null {
  return decodeToken<DecodedToken>(token || getToken());
}

export function reInitializeToken(token: string): void {
  const decodedToken = getDecodedToken(token);

  if (decodedToken) {
    LocalStorage.removeItem('access_token');
    LocalStorage.removeItem('access_token_expiration');

    const storableData: [string, string | number][] = [
      ['access_token', token],
      ['access_token_expiration', new Date().getTime() + decodedToken.expiration],
    ];

    for (let [key, value] of storableData) LocalStorage.setItem(key, value);
  }
}

export function isUserAuthenticated(): boolean {
  return !!getToken();
}

export function hasRole(...roles: UserRoles[]): boolean {
  roles = roles || Object.values(UserRoles);

  const userInfo = getDecodedToken();

  if (!userInfo) return false;
  else return roles.some((role) => userInfo.role === role);
}

export function isCurrentUser(): boolean {
  const userInfo = getDecodedToken()!;
  return userInfo.role === UserRoles.USER;
}

export function isCurrentAdmin(): boolean {
  const userInfo = getDecodedToken()!;
  return userInfo.role === UserRoles.ADMIN;
}

export function isCurrentOwner(): boolean {
  const userInfo = getDecodedToken()!;
  return userInfo.role === UserRoles.OWNER;
}

export function isUser(user: User): boolean {
  return user.role === UserRoles.USER;
}

export function isAdmin(user: User): boolean {
  return user.role === UserRoles.ADMIN;
}

export function isOwner(user: User): boolean {
  return user.role === UserRoles.OWNER;
}

export function isUserEqualToCurrentUser(data: User | number): boolean {
  const userInfo = getDecodedToken()!;
  if (typeof data === 'number') {
    return data === userInfo.id;
  } else {
    return data.id === userInfo.id;
  }
}

export function isUserCreatedByCurrentUser(user: User): boolean {
  const userInfo = getDecodedToken()!;
  return user.parent.id === userInfo.id;
}

export function hasUserRoleAuthroized(user: User): boolean {
  return isUserEqualToCurrentUser(user) && isCurrentUser();
}

export function hasAdminRoleAuthorized(user: User): boolean {
  return isUserEqualToCurrentUser(user) && isCurrentAdmin();
}

export function hasOwnerRoleAuthorized(user: User): boolean {
  return isUserEqualToCurrentUser(user) && isCurrentOwner();
}

export function hasCreatedByOwnerRoleAuthorized(user: User): boolean {
  return isUserCreatedByCurrentUser(user) && !isOwner(user) && isCurrentOwner();
}

export function hasRoleAuthorized(user: User): boolean {
  return (
    hasUserRoleAuthroized(user) ||
    hasAdminRoleAuthorized(user) ||
    hasOwnerRoleAuthorized(user) ||
    hasCreatedByOwnerRoleAuthorized(user)
  );
}
