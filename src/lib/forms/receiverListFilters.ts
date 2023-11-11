import { DefineRules, DefineVal, DefineValidation } from '../decorators';
import { isReceiverQuery } from '../validations';
import { Form } from './formConstructor';

export interface ReceiverListFiltersObj {
  q: string;
}

export class ReceiverListFilters extends Form implements ReceiverListFiltersObj {
  @DefineRules([isReceiverQuery])
  @DefineVal()
  @DefineValidation()
  q: string = '';

  constructor() {
    super();
    this.q = this.q;
  }
}
