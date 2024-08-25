import { Consumer } from './consumers';
import { Location } from './locations';
import { List } from './list';
import { Receiver } from './receivers';
import { User } from './users';

export interface Bill {
  id: string;
  amount: string;
  receiver: Receiver;
  location: Location;
  consumers: Consumer[];
  description: string;
  date: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  user: User;
}

export class Bills extends List<Bill> {}
