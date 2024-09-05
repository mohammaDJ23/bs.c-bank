import { DeletedUsers } from './deletedUsers';
import { DeletedBills } from './deletedBills';
import { Notifications } from './notifications';
import { Receivers } from './receivers';
import { Locations } from './locations';
import { Users } from './users';
import { Bills } from './bills';
import { AllBills } from './allBills';
import { Consumers } from './consumers';
import { MostActiveConsumers } from './mostActiveConsumers';
import { MostActiveLocations } from './mostActiveLocations';
import { MostActiveReceivers } from './mostActiveReceivers';
import { MostActiveUsers } from './mostActiveUsers';
import { MostActiveLocationsByReceivers } from './mostActiveLocationsByReceivers';

export * from './deletedUsers';
export * from './deletedBills';
export * from './notifications';
export * from './receivers';
export * from './locations';
export * from './users';
export * from './bills';
export * from './allBills';
export * from './consumers';
export * from './mostActiveConsumers';
export * from './mostActiveLocations';
export * from './mostActiveReceivers';
export * from './mostActiveUsers';

export const lists = {
  Users,
  Bills,
  AllBills,
  Consumers,
  DeletedBills,
  DeletedUsers,
  Locations,
  Notifications,
  Receivers,
  MostActiveConsumers,
  MostActiveLocations,
  MostActiveLocationsByReceivers,
  MostActiveReceivers,
  MostActiveUsers,
};
