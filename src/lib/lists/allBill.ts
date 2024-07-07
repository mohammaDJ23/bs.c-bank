import { BillObj } from './bill';
import { BaseList } from './list';

export class AllBillList<T = BillObj> extends BaseList<T> {
  constructor(arg: Partial<BaseList<T>> = {}) {
    super(arg);
  }
}
