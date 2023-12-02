import { BaseList } from './list';
import { UserObj } from './user';

export interface BillWithUserObj {
  id: string;
  amount: string;
  receiver: string;
  consumers: string[];
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
