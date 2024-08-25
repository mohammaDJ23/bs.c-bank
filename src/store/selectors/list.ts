import {
  AllBills,
  Bills,
  Consumers,
  DeletedBills,
  DeletedUsers,
  Locations,
  MostActiveConsumers,
  MostActiveLocations,
  MostActiveReceivers,
  Notifications,
  Receivers,
  Users,
} from '../../lib';
import { RootState } from '../store';

export function selectUsersList(state: RootState): Users {
  return state.lists[Users.name];
}

export function selectBillsList(state: RootState): Bills {
  return state.lists[Bills.name];
}

export function selectAllBillsList(state: RootState): AllBills {
  return state.lists[AllBills.name];
}

export function selectConsumersList(state: RootState): Consumers {
  return state.lists[Consumers.name];
}

export function selectDeletedBillsList(state: RootState): DeletedBills {
  return state.lists[DeletedBills.name];
}

export function selectDeletedUsersList(state: RootState): DeletedUsers {
  return state.lists[DeletedUsers.name];
}

export function selectLocationsList(state: RootState): Locations {
  return state.lists[Locations.name];
}

export function selectNotificationsList(state: RootState): Notifications {
  return state.lists[Notifications.name];
}

export function selectReceiversList(state: RootState): Receivers {
  return state.lists[Receivers.name];
}

export function selectMostActiveConsumersList(state: RootState): MostActiveConsumers {
  return state.lists[MostActiveConsumers.name];
}

export function selectMostActiveLocationsList(state: RootState): MostActiveLocations {
  return state.lists[MostActiveLocations.name];
}

export function selectMostActiveReceiversList(state: RootState): MostActiveReceivers {
  return state.lists[MostActiveReceivers.name];
}
