import { Users } from '../../lib';
import { RootState } from '../store';

export function selectUsersList(state: RootState): Users {
  return state.lists[Users.name];
}
