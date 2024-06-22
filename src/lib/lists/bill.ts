import { ConsumerObj } from './consumer';
import { BaseList } from './list';
import { LocationObj } from './locations';
import { ReceiverObj } from './receivers';

export interface BillObj {
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
  userId: number;
}

export class BillList<T = BillObj> extends BaseList<T> {
  constructor(arg: Partial<BaseList<T>> = {}) {
    super(arg);
  }
}
