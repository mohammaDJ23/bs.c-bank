import { DefineRules, DefineVal, DefineValidation } from '../decorators';
import { isReceiverQuery } from '../validations';
import { Form, IgnoreFormConstructor } from './formConstructor';

export interface ReceiverListFiltersObj extends IgnoreFormConstructor<ReceiverListFilters> {}

export class ReceiverListFilters extends Form {
  @DefineRules([isReceiverQuery])
  @DefineVal()
  @DefineValidation()
  q: string = '';

  constructor() {
    super();
    this.q = this.q;
  }
}
