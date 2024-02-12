import { BaseList } from './list';
import { UserRoles } from '../auth';

export interface UserObj {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRoles;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  parent: UserObj;
}

export interface UserWithBillInfoObj extends UserObj {
  bill: {
    counts: string;
    amounts: string;
  };

  parent: UserObj;

  users: {
    quantities: string;
  };
}

export interface DeletedUserObj extends UserObj {
  parent: UserObj;
}

export class UserList<T = UserObj> extends BaseList<T> {
  constructor(arg: Partial<BaseList<T>> = {}) {
    super(arg);
  }
}
