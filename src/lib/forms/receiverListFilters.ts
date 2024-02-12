import { DefineVal, DefineValidation } from '../decorators';
import { Form, IgnoreFormConstructor } from './formConstructor';

export interface ReceiverListFiltersObj extends IgnoreFormConstructor<ReceiverListFilters> {}

export class ReceiverListFilters extends Form {
  @DefineVal()
  @DefineValidation()
  q: string = '';

  constructor() {
    super();
    this.q = this.q;
  }
}
