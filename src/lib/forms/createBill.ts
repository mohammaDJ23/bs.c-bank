import { DefineRules, DefineVal, CacheInput, DefineValidation } from '../decorators';
import { getTime } from '../utilFunctions';
import { isReceiver, isAmount, isDescription, isDate, isConsumer } from '../validations';
import { Form } from './formConstructor';

export class CreateBill extends Form {
  @DefineRules([isAmount])
  @DefineVal()
  @CacheInput()
  @DefineValidation()
  amount: string = '';

  @DefineRules([isReceiver])
  @DefineVal()
  @CacheInput()
  @DefineValidation()
  receiver: string = '';

  @DefineRules([isConsumer])
  @DefineVal()
  @CacheInput()
  @DefineValidation()
  consumers: string[] = [];

  @DefineRules([isDescription])
  @DefineVal()
  @CacheInput()
  @DefineValidation()
  description: string = '';

  @DefineRules([isDate])
  @DefineVal(getTime())
  @CacheInput()
  @DefineValidation()
  date: number = getTime();

  constructor() {
    super();
    this.amount = this.getCachedInput('amount');
    this.receiver = this.getCachedInput('receiver');
    this.consumers = this.getCachedInput('consumers');
    this.description = this.getCachedInput('description');
    this.date = +this.getCachedInput('date');
  }
}
