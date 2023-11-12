import { DefineRules, DefineVal, DefineValidation } from '../decorators';
import { getTime } from '../utilFunctions';
import { isReceiver, isAmount, isDescription, isDate, isConsumers } from '../validations';
import { Form } from './formConstructor';

export class UpdateBill extends Form {
  @DefineVal()
  id: string = '0';

  @DefineRules([isAmount])
  @DefineVal()
  @DefineValidation()
  amount: string = '';

  @DefineRules([isReceiver])
  @DefineVal()
  @DefineValidation()
  receiver: string = '';

  @DefineRules([isConsumers])
  @DefineVal()
  @DefineValidation()
  consumers: string[] = [];

  @DefineRules([isDescription])
  @DefineVal()
  @DefineValidation()
  description: string = '';

  @DefineRules([isDate])
  @DefineVal(getTime())
  @DefineValidation()
  date: number = getTime();

  constructor({
    id = '0',
    amount = '',
    receiver = '',
    consumers = [],
    description = '',
    date = getTime(),
  }: Partial<Omit<UpdateBill, keyof Form>> = {}) {
    super();
    this.id = id;
    this.amount = amount;
    this.receiver = receiver;
    this.consumers = consumers;
    this.description = description;
    this.date = date;
  }
}
