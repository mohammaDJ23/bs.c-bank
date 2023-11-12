import { UserRoles } from '../auth';
import { DefineRules, DefineVal, CacheInput, DefineValidation } from '../decorators';
import { isDate, isUserRoles } from '../validations';
import { Form, IgnoreFormConstructor } from './formConstructor';

export interface UserListFiltersObj extends IgnoreFormConstructor<UserListFilters> {}

export class UserListFilters extends Form implements UserListFiltersObj {
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
    this.roles = this.roles;
    this.fromDate = this.fromDate;
    this.toDate = this.toDate;
  }
}
