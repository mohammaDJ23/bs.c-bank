import { AllBills, Bills, Consumers, Users } from '../../lib';
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
