import { DefineRules, DefineVal, DefineValidation } from '../decorators';
import { isConsumer } from '../validations';
import { Form, IgnoreFormConstructor } from './formConstructor';

export interface UpdateConsumerObj extends IgnoreFormConstructor<UpdateConsumer> {}

export class UpdateConsumer extends Form {
  @DefineVal()
  id: number = 0;

  @DefineRules([isConsumer])
  @DefineVal()
  @DefineValidation()
  name: string = '';

  constructor({ id = 0, name = '' }: Partial<Omit<UpdateConsumer, keyof Form>> = {}) {
    super();
    this.id = id;
    this.name = name;
  }
}
