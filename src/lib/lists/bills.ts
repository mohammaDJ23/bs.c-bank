import { ConsumerObj } from './consumer';
import { LocationObj } from './locations';
import { List } from './newList';
import { ReceiverObj } from './receivers';
import { User } from './users';

export interface Bill {
  id: string;
  amount: string;
  receiver: ReceiverObj;
  location: LocationObj;
  consumers: ConsumerObj[];
  description: string;
  date: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  user: User;
}

export class Bills extends List<Bill> {}
