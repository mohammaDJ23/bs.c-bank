import { List } from './list';
import { User } from './users';

export interface MostActiveUser {
  quantities: number;
  user: User;
}

export class MostActiveUsers extends List<MostActiveUser> {}
