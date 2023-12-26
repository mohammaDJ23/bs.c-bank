import { BaseList } from './list';
import { UserObj } from './user';

export class DeletedUserList<T = UserObj> extends BaseList<T> {
  constructor(arg: Partial<BaseList<T>> = {}) {
    super(arg);
  }
}
