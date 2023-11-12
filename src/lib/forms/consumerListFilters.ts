import { DefineRules, DefineVal, DefineValidation } from '../decorators';
import { isConsumer } from '../validations';
import { Form, IgnoreFormConstructor } from './formConstructor';

export interface ConsumerListFiltersObj extends IgnoreFormConstructor<ConsumerListFilters> {}

export class ConsumerListFilters extends Form {
  @DefineRules([isConsumer])
  @DefineVal()
  @DefineValidation()
  q: string = '';

  constructor() {
    super();
    this.q = this.q;
  }
}
