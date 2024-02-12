import { BillObj } from './bill';
import { BaseList } from './list';

export class DeletedBillList<T = BillObj> extends BaseList<T> {
  constructor(arg: Partial<BaseList<T>> = {}) {
    super(arg);
  }
}
