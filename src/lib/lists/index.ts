import { UserList } from './user';
import { BillList } from './bill';
import { DeletedUsers } from './deletedUsers';
import { DeletedBills } from './deletedBills';
import { Notifications } from './notifications';
import { ConsumerList } from './consumer';
import { AllBillList } from './allBill';
import { ReceiverList } from './receivers';
import { Locations } from './locations';
import { Users } from './users';
import { Bills } from './bills';
import { AllBills } from './allBills';
import { Consumers } from './consumers';

export * from './bill';
export * from './list';
export * from './user';
export * from './deletedUsers';
export * from './deletedBills';
export * from './notifications';
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
  DeletedUsers,
  DeletedBills,
  Notifications,
  ConsumerList,
  AllBillList,
  ReceiverList,
  Locations,
};

export const newLists = {
  Users,
  Bills,
  AllBills,
  Consumers,
  DeletedBills,
  DeletedUsers,
  Locations,
  Notifications,
};
