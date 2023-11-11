import {
  DefineRules,
  DefineVal,
  isEmail,
  isFirstName,
  isLastName,
  isPhone,
  isRole,
  UserRoles,
  DefineValidation,
} from '../';
import { Form } from './formConstructor';

export class UpdateUserByOwner extends Form {
  @DefineRules([isFirstName])
  @DefineVal()
  @DefineValidation()
  firstName: string = '';

  @DefineRules([isLastName])
  @DefineVal()
  @DefineValidation()
  lastName: string = '';

  @DefineRules([isEmail])
  @DefineVal()
  @DefineValidation()
  email: string = '';

  @DefineRules([isPhone])
  @DefineVal()
  @DefineValidation()
  phone: string = '';

  @DefineRules([isRole])
  @DefineVal()
  @DefineValidation()
  role: UserRoles = UserRoles.USER;

  constructor({
    firstName = '',
    lastName = '',
    email = '',
    phone = '',
    role = UserRoles.USER,
  }: Partial<Omit<UpdateUserByOwner, keyof Form>> = {}) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.role = role;
  }
}

export class UpdateUser extends Form {
  @DefineRules([isFirstName])
  @DefineVal()
  @DefineValidation()
  firstName: string = '';

  @DefineRules([isLastName])
  @DefineVal()
  @DefineValidation()
  lastName: string = '';

  @DefineRules([isEmail])
  @DefineVal()
  @DefineValidation()
  email: string = '';

  @DefineRules([isPhone])
  @DefineVal()
  @DefineValidation()
  phone: string = '';

  constructor({ firstName = '', lastName = '', email = '', phone = '' }: Partial<Omit<UpdateUser, keyof Form>> = {}) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
  }
}
