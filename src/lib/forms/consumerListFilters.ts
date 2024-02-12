import { DefineVal, DefineValidation } from '../decorators';
import { Form, IgnoreFormConstructor } from './formConstructor';

export interface ConsumerListFiltersObj extends IgnoreFormConstructor<ConsumerListFilters> {}

export class ConsumerListFilters extends Form {
  @DefineVal()
  @DefineValidation()
  q: string = '';

  constructor() {
    super();
    this.q = this.q;
  }
}
