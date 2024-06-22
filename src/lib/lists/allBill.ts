import { ConsumerObj } from './consumer';
import { BaseList } from './list';
import { LocationObj } from './locations';
import { ReceiverObj } from './receivers';
import { UserObj } from './user';

export interface BillWithUserObj {
  id: string;
  amount: string;
  receiver: ReceiverObj;
  location: LocationObj;
  consumers: ConsumerObj[];
  description: string;
  date: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  user: UserObj;
}

export class AllBillList<T = BillWithUserObj> extends BaseList<T> {
  constructor(arg: Partial<BaseList<T>> = {}) {
    super(arg);
  }
}
