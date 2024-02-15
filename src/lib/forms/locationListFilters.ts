import { DefineVal, DefineValidation } from '../decorators';
import { Form, IgnoreFormConstructor } from './formConstructor';

export interface LocationListFiltersObj extends IgnoreFormConstructor<LocationListFilters> {}

export class LocationListFilters extends Form {
  @DefineVal()
  @DefineValidation()
  q: string = '';

  constructor() {
    super();
    this.q = this.q;
  }
}
