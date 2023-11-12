import { DefineRules, DefineVal, CacheInput, DefineValidation } from '../decorators';
import { isDate } from '../validations';
import { Form, IgnoreFormConstructor } from './formConstructor';

export interface DeletedBillListFiltersObj extends IgnoreFormConstructor<DeletedBillListFilters> {}

export class DeletedBillListFilters extends Form {
  @DefineVal()
  @DefineValidation()
  q: string = '';

  @DefineRules([isDate])
  @DefineVal()
  @DefineValidation()
  fromDate: number = 0;

  @DefineRules([isDate])
  @DefineVal()
  @CacheInput()
  @DefineValidation()
  toDate: number = 0;

  @DefineRules([isDate])
  @DefineVal()
  @CacheInput()
  @DefineValidation()
  deletedDate: number = 0;

  constructor() {
    super();
    this.q = this.q;
    this.fromDate = this.fromDate;
    this.toDate = this.toDate;
    this.deletedDate = this.deletedDate;
  }
}
