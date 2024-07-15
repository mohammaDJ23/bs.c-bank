import { DefineRules, DefineVal, DefineValidation } from '../decorators';
import { isLocation } from '../validations';
import { Form, IgnoreFormConstructor } from './formConstructor';

export interface UpdateLocationObj extends IgnoreFormConstructor<UpdateLocation> {}

export class UpdateLocation extends Form {
  @DefineVal()
  id: number = 0;

  @DefineRules([isLocation])
  @DefineVal()
  @DefineValidation()
  name: string = '';

  constructor({ id = 0, name = '' }: Partial<Omit<UpdateLocation, keyof Form>> = {}) {
    super();
    this.id = id;
    this.name = name;
  }
}
