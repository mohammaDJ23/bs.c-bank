import { BaseList } from './list';

export interface BillObj {
  id: string;
  amount: string;
  receiver: string;
  consumers: string[];
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
