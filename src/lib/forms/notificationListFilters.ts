import { UserRoles } from '../auth';
import { DefineRules, DefineVal, CacheInput, DefineValidation } from '../decorators';
import { isDate, isUserRoles } from '../validations';
import { Form } from './formConstructor';

export interface NotificationListFiltersObj {
  q: string;
  roles: UserRoles[];
  fromDate: number;
  toDate: number;
}

export class NotificationListFilters extends Form implements NotificationListFiltersObj {
  @DefineVal()
  @DefineValidation()
  q: string = '';

  @DefineRules([isUserRoles])
  @DefineVal(Object.values(UserRoles))
  @DefineValidation()
  roles: UserRoles[] = Object.values(UserRoles);

  @DefineRules([isDate])
  @DefineVal()
  @DefineValidation()
  fromDate: number = 0;

  @DefineRules([isDate])
  @DefineVal()
  @CacheInput()
  @DefineValidation()
  toDate: number = 0;

  constructor() {
    super();
    this.q = this.q;
    this.fromDate = this.fromDate;
    this.toDate = this.toDate;
  }
}
