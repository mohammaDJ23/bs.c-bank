import { UserRoles } from '../auth';
import { List } from './list';

export interface User {
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
  parent: User;
}

export class Users extends List<User> {}

export interface UserWithBillInfo extends User {
  bill: {
    counts: string;
    amounts: string;
  };
  parent: User;
  users: {
    quantities: string;
  };
}
