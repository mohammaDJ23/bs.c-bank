import { UserList } from './user';
import { BillList } from './bill';
import { DeletedUserList } from './deletedUsers';
import { DeletedBillList } from './deletedBills';
import { NotificationList } from './notification';
import { ConsumerList } from './consumer';

export * from './bill';
export * from './list';
export * from './user';
export * from './deletedUsers';
export * from './deletedBills';
export * from './notification';
export * from './consumer';

export const lists = {
  UserList,
  BillList,
  DeletedUserList,
  DeletedBillList,
  NotificationList,
  ConsumerList,
};
