import { DefineRules, DefineVal, DefineValidation } from '../decorators';
import { isReceiver } from '../validations';
import { Form, IgnoreFormConstructor } from './formConstructor';

export interface UpdateReceiverObj extends IgnoreFormConstructor<UpdateReceiver> {}

export class UpdateReceiver extends Form {
  @DefineVal()
  id: number = 0;

  @DefineRules([isReceiver])
  @DefineVal()
  @DefineValidation()
  name: string = '';

  constructor({ id = 0, name = '' }: Partial<Omit<UpdateReceiver, keyof Form>> = {}) {
    super();
    this.id = id;
    this.name = name;
  }
}
