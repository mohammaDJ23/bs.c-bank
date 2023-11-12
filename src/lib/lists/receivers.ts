import { ListInstance, ListObj } from './list';

export interface ReceiverObj {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  userId: number;
}

export class ReceiverList implements ListInstance {
  constructor(
    public list: ListObj<ReceiverObj> = {},
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
