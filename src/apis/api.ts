import { AxiosRequestConfig, CreateAxiosDefaults } from 'axios';
import {
  CreateBill,
  CreateUser,
  UpdateBill,
  UpdateUserByOwner,
  UpdateUser,
  ListParams,
  BillListFiltersObj,
  DeletedBillListFiltersObj,
  NotificationListFiltersObj,
  AllBillListFiltersObj,
  UserObj,
  BillObj,
  BillWithUserObj,
  ConsumerObj,
  NotificationObj,
  UserListFiltersObj,
  DeletedUserListFiltersObj,
  ConsumerListFiltersObj,
  ReceiverObj,
  LocationListFiltersObj,
  LocationObj,
} from '../lib';
import { PeriodAmountFilter } from '../store';
import { RootApiObj } from './resetApi';
import { ReceiverListFiltersObj } from '../lib/forms/receiverListFilters';

export type FilterParams<T = any> = Record<'filters', T>;

export abstract class RootApi<D = any> implements RootApiObj<D> {
  protected _isInitialApi: boolean = false;

  constructor(public readonly api: AxiosRequestConfig<D>, public readonly config: CreateAxiosDefaults<D> = {}) {
    this.api = api;
    this.config = config;
  }

  get isInitialApi() {
    return this._isInitialApi;
  }

  setInitialApi(value: boolean = true) {
    this._isInitialApi = value;
    return this;
  }
}

export class CreateUserApi extends RootApi<CreateUser> {
  constructor(data: CreateUser) {
    super(
      {
        url: '/api/v1/user/create',
        method: 'post',
        data,
        headers: {
          'Content-type': 'application/json',
        },
      },
      { baseURL: process.env.USER_SERVICE }
    );
  }
}

export class CreateBillApi extends RootApi<CreateBill> {
  constructor(data: CreateBill) {
    super(
      {
        url: '/api/v1/bank/bill/create',
        method: 'post',
        data,
        headers: {
          'Content-type': 'application/json',
        },
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class UpdateUserByOwnerApi extends RootApi<UpdateUserByOwner> {
  constructor(data: UpdateUserByOwner, id: number) {
    super(
      {
        url: `/api/v1/user/owner/update/${id}`,
        method: 'put',
        data,
        headers: {
          'Content-type': 'application/json',
        },
      },
      { baseURL: process.env.USER_SERVICE }
    );
  }
}

export class UpdateUserApi extends RootApi<UpdateUser> {
  constructor(data: UpdateUser) {
    super(
      {
        url: '/api/v1/user/update',
        method: 'put',
        data,
        headers: {
          'Content-type': 'application/json',
        },
      },
      { baseURL: process.env.USER_SERVICE }
    );
  }
}

export class UpdateBillApi extends RootApi<UpdateBill> {
  constructor(data: UpdateBill) {
    super(
      {
        url: '/api/v1/bank/bill/update',
        method: 'put',
        data,
        headers: {
          'Content-type': 'application/json',
        },
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class UsersApi extends RootApi {
  constructor(params: ListParams<UserObj> & FilterParams<Partial<UserListFiltersObj>>) {
    super(
      {
        url: '/api/v1/user/all',
        method: 'get',
        params,
      },
      { baseURL: process.env.USER_SERVICE }
    );
  }
}

export type UsersApiConstructorType = ConstructorParameters<typeof UsersApi>[0];

export class DeletedUsersApi extends RootApi {
  constructor(params: ListParams<UserObj> & FilterParams<Partial<DeletedUserListFiltersObj>>) {
    super(
      {
        url: '/api/v1/user/all/deleted',
        method: 'get',
        params,
      },
      { baseURL: process.env.USER_SERVICE }
    );
  }
}

export type DeletedUsersApiConstructorType = ConstructorParameters<typeof DeletedUsersApi>[0];

export class BillsApi extends RootApi {
  constructor(params: ListParams<BillObj> & FilterParams<Partial<BillListFiltersObj>>) {
    super(
      {
        url: '/api/v1/bank/bill/all',
        method: 'get',
        params,
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export type BillsApiConstructorType = ConstructorParameters<typeof BillsApi>[0];

export class AllBillsApi extends RootApi {
  constructor(params: ListParams<BillWithUserObj> & FilterParams<Partial<AllBillListFiltersObj>>) {
    super(
      {
        url: '/api/v1/bank/owner/bill/all',
        method: 'get',
        params,
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export type AllBillsApiConstructorType = ConstructorParameters<typeof AllBillsApi>[0];

export class DeletedBillListApi extends RootApi {
  constructor(params: ListParams<BillObj> & FilterParams<Partial<DeletedBillListFiltersObj>>) {
    super(
      {
        url: '/api/v1/bank/bill/all/deleted',
        method: 'get',
        params,
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export type DeletedBillListApiConstructorType = ConstructorParameters<typeof DeletedBillListApi>[0];

export class UserApi extends RootApi {
  constructor(id: number) {
    super(
      {
        url: `/api/v1/user/${id}`,
        method: 'get',
      },
      { baseURL: process.env.USER_SERVICE }
    );
  }
}

export class DeletedUserApi extends RootApi {
  constructor(id: number) {
    super(
      {
        url: `/api/v1/user/deleted/${id}`,
        method: 'get',
      },
      { baseURL: process.env.USER_SERVICE }
    );
  }
}

export class RestoreUserApi extends RootApi {
  constructor(id: number) {
    super(
      {
        url: `/api/v1/user/restore/${id}`,
        method: 'post',
      },
      { baseURL: process.env.USER_SERVICE }
    );
  }
}

export class BillApi extends RootApi {
  constructor(id: string) {
    super(
      {
        url: `/api/v1/bank/bill/${id}`,
        method: 'get',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class DeletedBillApi extends RootApi {
  constructor(id: string) {
    super(
      {
        url: `/api/v1/bank/bill/deleted/${id}`,
        method: 'get',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class DeleteBillApi extends RootApi {
  constructor(id: string) {
    super(
      {
        url: '/api/v1/bank/bill/delete',
        method: 'delete',
        params: {
          id,
        },
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class RestoreBillApi extends RootApi {
  constructor(id: string) {
    super(
      {
        url: `/api/v1/bank/bill/restore/${id}`,
        method: 'post',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class DeleteUserApi extends RootApi {
  constructor() {
    super(
      {
        url: '/api/v1/user/delete',
        method: 'delete',
      },
      { baseURL: process.env.USER_SERVICE }
    );
  }
}

export class DeleteUserByOwnerApi extends RootApi {
  constructor(id: number) {
    super(
      {
        url: `/api/v1/user/owner/delete/${id}`,
        method: 'delete',
      },
      { baseURL: process.env.USER_SERVICE }
    );
  }
}

export class TotalAmountApi extends RootApi {
  constructor() {
    super(
      {
        url: '/api/v1/bank/bill/total-amount',
        method: 'get',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class PeriodAmountApi extends RootApi<PeriodAmountFilter> {
  constructor(data: PeriodAmountFilter) {
    super(
      {
        url: '/api/v1/bank/bill/period-amount',
        method: 'post',
        data,
        headers: {
          'Content-type': 'application/json',
        },
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class LastWeekBillsApi extends RootApi {
  constructor() {
    super(
      {
        url: '/api/v1/bank/bill/last-week',
        method: 'get',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class UserQuantitiesApi extends RootApi {
  constructor() {
    super(
      {
        url: '/api/v1/user/quantities',
        method: 'get',
      },
      { baseURL: process.env.USER_SERVICE }
    );
  }
}

export class DeletedUserQuantitiesApi extends RootApi {
  constructor() {
    super(
      {
        url: '/api/v1/user/deleted-quantities',
        method: 'get',
      },
      { baseURL: process.env.USER_SERVICE }
    );
  }
}

export class LastWeekUsersApi extends RootApi {
  constructor() {
    super(
      {
        url: '/api/v1/user/last-week',
        method: 'get',
      },
      { baseURL: process.env.USER_SERVICE }
    );
  }
}

export class UserWithBillInfoApi extends RootApi {
  constructor(id: number) {
    super(
      {
        url: `/api/v1/bank/user/${id}`,
        method: 'get',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class DownloadBillReportApi extends RootApi {
  constructor(id: number) {
    super(
      {
        url: `/api/v1/bank/bill/excel/${id}`,
        method: 'get',
        responseType: 'blob',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class AllBillQuantitiesApi extends RootApi {
  constructor() {
    super(
      {
        url: `/api/v1/bank/bill/all/quantities`,
        method: 'get',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class NotificationsApi extends RootApi {
  constructor(params: ListParams<NotificationObj> & FilterParams<Partial<NotificationListFiltersObj>>) {
    super(
      {
        url: '/api/v1/notification/all',
        method: 'get',
        params,
      },
      { baseURL: process.env.NOTIFICATION_SERVICE }
    );
  }
}

export type NotificationsApiConstructorType = ConstructorParameters<typeof NotificationsApi>[0];

export class NotificationApi extends RootApi {
  constructor(id: number) {
    super(
      {
        url: `/api/v1/notification/${id}`,
        method: 'get',
      },
      { baseURL: process.env.NOTIFICATION_SERVICE }
    );
  }
}

export class ConsumersApi extends RootApi {
  constructor(params: ListParams<ConsumerObj> & FilterParams<Partial<ConsumerListFiltersObj>>) {
    super(
      {
        url: '/api/v1/bank/consumer/all',
        method: 'get',
        params,
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class ReceiversApi extends RootApi {
  constructor(params: ListParams<ReceiverObj> & FilterParams<Partial<ReceiverListFiltersObj>>) {
    super(
      {
        url: '/api/v1/bank/receiver/all',
        method: 'get',
        params,
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class LocationsApi extends RootApi {
  constructor(params: ListParams<LocationObj> & FilterParams<Partial<LocationListFiltersObj>>) {
    super(
      {
        url: '/api/v1/bank/location/all',
        method: 'get',
        params,
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}
