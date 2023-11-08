import { CreateUser } from './createUser';
import { CreateBill } from './createBill';
import { UpdateBill } from './updateBill';
import { UpdateUserByOwner } from './updateUser';
import { UpdateUser } from './updateUser';
import { UserListFilters } from './userListFilters';
import { BillListFilters } from './billListFilters';
import { DeletedUserListFilters } from './deletedUserListFilters';
import { DeletedBillListFilters } from './deletedBillListFilters';
import { NotificationListFilters } from './notificationListFilters';
import { ConsumerListFilters } from './consumerListFilters';

export * from './createUser';
export * from './formConstructor';
export * from './updateUser';
export * from './createBill';
export * from './updateBill';
export * from './userListFilters';
export * from './billListFilters';
export * from './deletedUserListFilters';
export * from './deletedBillListFilters';
export * from './notificationListFilters';
export * from './consumerListFilters';

export const forms = {
  CreateUser,
  CreateBill,
  UpdateBill,
  UpdateUserByOwner,
  UpdateUser,
  UserListFilters,
  DeletedUserListFilters,
  BillListFilters,
  DeletedBillListFilters,
  NotificationListFilters,
  ConsumerListFilters,
};
