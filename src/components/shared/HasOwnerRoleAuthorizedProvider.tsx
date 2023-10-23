import { PropsWithChildren, FC, Fragment } from 'react';
import { UserObj, hasOwnerRoleAuthorized } from '../../lib';
import { Navigate } from 'react-router-dom';

interface HasOwnerRoleAuthorizedImportation extends PropsWithChildren {
  user: UserObj;
}

const HasOwnerRoleAuthorizedProvider: FC<HasOwnerRoleAuthorizedImportation> = ({ user, children }) => {
  if (!hasOwnerRoleAuthorized(user)) {
    return <Navigate to="-1" />;
  }
  return <Fragment>{children}</Fragment>;
};

export default HasOwnerRoleAuthorizedProvider;
