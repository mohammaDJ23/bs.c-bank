import { UserRoles } from '../auth';
import { ListInstance, ListObj } from './list';
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

export class AllBillList implements ListInstance {
  constructor(
    public list: ListObj<BillWithUserObj> = {},
    public total: number = 0,
    public page: number = 1,
    public take: number = 10
  ) {
    this.list = list;
    this.take = take;
    this.page = page;
    this.total = total;
  }
}
