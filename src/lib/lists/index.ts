import { UserList } from './user';
import { BillList } from './bill';
import { DeletedUserList } from './deletedUsers';
import { DeletedBillList } from './deletedBills';
import { NotificationList } from './notification';

export * from './bill';
export * from './list';
export * from './user';
export * from './deletedUsers';
export * from './deletedBills';
export * from './notification';

export const lists = {
  UserList,
  BillList,
  DeletedUserList,
  DeletedBillList,
  NotificationList,
};
