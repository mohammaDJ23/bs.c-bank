import { BaseList } from './list';

export interface ConsumerObj {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  userId: number;
}

export class ConsumerList<T = ConsumerObj> extends BaseList<T> {
  constructor(arg: Partial<BaseList<T>> = {}) {
    super(arg);
  }
}
