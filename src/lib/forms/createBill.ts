import { DefineRules, DefineVal, CacheInput, DefineValidation } from '../decorators';
import { isReceiver, isAmount, isDescription, isDate, isConsumers, isLocation } from '../validations';
import { Form, IgnoreFormConstructor } from './formConstructor';

export interface CreateBillObj extends IgnoreFormConstructor<CreateBill> {}

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

  @DefineRules([isLocation])
  @DefineVal()
  @CacheInput()
  @DefineValidation()
  location: string = '';

  @DefineRules([isConsumers])
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
  @DefineVal(null)
  @CacheInput()
  @DefineValidation()
  date: number | null = null;

  constructor() {
    super();
    this.amount = this.getCachedInput('amount');
    this.receiver = this.getCachedInput('receiver');
    this.consumers = this.getCachedInput('consumers');
    this.description = this.getCachedInput('description');

    const cachedDate = this.getCachedInput('date');
    this.date = cachedDate ? +cachedDate : null;
  }
}
