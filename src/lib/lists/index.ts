import { UserList } from './user';
import { BillList } from './bill';
import { DeletedUserList } from './deletedUsers';
import { DeletedBillList } from './deletedBills';
import { NotificationList } from './notification';
import { ConsumerList } from './consumer';
import { AllBillList } from './allBill';
import { ReceiverList } from './receivers';
import { LocationList } from './locations';
import { Users } from './users';
import { Bills } from './bills';
import { AllBills } from './allBills';
import { Consumers } from './consumers';

export * from './bill';
export * from './list';
export * from './user';
export * from './deletedUsers';
export * from './deletedBills';
export * from './notification';
export * from './consumer';
export * from './allBill';
export * from './receivers';
export * from './locations';
export * from './mostActiveUsers';
export * from './mostActiveConsumers';
export * from './mostActiveLocations';
export * from './mostActiveReceivers';
export * from './users';
export * from './bills';
export * from './allBills';
export * from './consumers';

export const lists = {
  UserList,
  BillList,
  DeletedUserList,
  DeletedBillList,
  NotificationList,
  ConsumerList,
  AllBillList,
  ReceiverList,
  LocationList,
};

export const newLists = {
  Users,
  Bills,
  AllBills,
  Consumers,
};
