import { DefineRules, DefineVal, DefineValidation } from '../decorators';
import { isConsumer } from '../validations';
import { Form } from './formConstructor';

export interface ConsumerListFiltersObj {
  q: string;
}

export class ConsumerListFilters extends Form implements ConsumerListFiltersObj {
  @DefineRules([isConsumer])
  @DefineVal()
  @DefineValidation()
  q: string = '';

  constructor() {
    super();
    this.q = this.q;
  }
}
