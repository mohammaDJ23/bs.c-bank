import { DefineRules, DefineVal, DefineValidation } from '../decorators';
import { isConsumer } from '../validations';
import { Form } from './formConstructor';

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
