import { AxiosRequestConfig, CreateAxiosDefaults } from 'axios';
import {
  CreateBill,
  CreateUser,
  UpdateBill,
  UpdateUserByOwner,
  UpdateUser,
  BillListFiltersObj,
  DeletedBillListFiltersObj,
  NotificationListFiltersObj,
  AllBillListFiltersObj,
  UserObj,
  BillObj,
  ConsumerObj,
  NotificationObj,
  UserListFiltersObj,
  DeletedUserListFiltersObj,
  ConsumerListFiltersObj,
  ReceiverObj,
  LocationListFiltersObj,
  LocationObj,
  UpdateReceiver,
  UpdateLocation,
  UpdateConsumer,
  MostActiveUserObj,
  MostActiveConsumerObj,
  MostActiveReceiverObj,
} from '../lib';
import { RootApiObj } from './resetApi';
import { ReceiverListFiltersObj } from '../lib/forms/receiverListFilters';
import { ListParams } from '../lib/lists/newList';

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
  constructor(params: Partial<ListParams<Partial<UserListFiltersObj>>> = {}) {
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
  constructor(params: ListParams<BillObj> & FilterParams<Partial<AllBillListFiltersObj>>) {
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

export class BillQuantitiesApi extends RootApi {
  constructor() {
    super(
      {
        url: '/api/v1/bank/bill/quantities',
        method: 'get',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class LastYearBillsApi extends RootApi {
  constructor() {
    super(
      {
        url: '/api/v1/bank/bill/last-year',
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

export class LastYearUsersApi extends RootApi {
  constructor() {
    super(
      {
        url: '/api/v1/user/last-year',
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

export class AllDeletedBillQuantitiesApi extends RootApi {
  constructor() {
    super(
      {
        url: `/api/v1/bank/bill/all/deleted-quantities`,
        method: 'get',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class DeletedBillQuantitiesApi extends RootApi {
  constructor() {
    super(
      {
        url: `/api/v1/bank/bill/deleted-quantities`,
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

export class NotificationQuantitiesApi extends RootApi {
  constructor() {
    super(
      {
        url: `/api/v1/notification/quantities`,
        method: 'get',
      },
      { baseURL: process.env.NOTIFICATION_SERVICE }
    );
  }
}

export class AllNotificationQuantitiesApi extends RootApi {
  constructor() {
    super(
      {
        url: `/api/v1/notification/all/quantities`,
        method: 'get',
      },
      { baseURL: process.env.NOTIFICATION_SERVICE }
    );
  }
}

export class ConsumersApi extends RootApi {
  constructor(params: Partial<ListParams<ConsumerObj> & FilterParams<Partial<ConsumerListFiltersObj>>> = {}) {
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

export class ConsumerApi extends RootApi {
  constructor(id: number) {
    super(
      {
        url: `/api/v1/bank/consumer/${id}`,
        method: 'get',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class DeleteConsumerApi extends RootApi {
  constructor(id: number) {
    super(
      {
        url: '/api/v1/bank/consumer/delete',
        method: 'delete',
        params: {
          id,
        },
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class UpdateConsumerApi extends RootApi<UpdateConsumer> {
  constructor(data: UpdateConsumer) {
    super(
      {
        url: '/api/v1/bank/consumer/update',
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

export class ReceiversApi extends RootApi {
  constructor(params: Partial<ListParams<ReceiverObj> & FilterParams<Partial<ReceiverListFiltersObj>>> = {}) {
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

export class ReceiverApi extends RootApi {
  constructor(id: number) {
    super(
      {
        url: `/api/v1/bank/receiver/${id}`,
        method: 'get',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class UpdateReceiverApi extends RootApi<UpdateReceiver> {
  constructor(data: UpdateReceiver) {
    super(
      {
        url: '/api/v1/bank/receiver/update',
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

export class DeleteReceiverApi extends RootApi {
  constructor(id: number) {
    super(
      {
        url: '/api/v1/bank/receiver/delete',
        method: 'delete',
        params: {
          id,
        },
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class LocationsApi extends RootApi {
  constructor(params: Partial<ListParams<LocationObj> & FilterParams<Partial<LocationListFiltersObj>>> = {}) {
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

export class LocaitonApi extends RootApi {
  constructor(id: number) {
    super(
      {
        url: `/api/v1/bank/location/${id}`,
        method: 'get',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class DeleteLocationApi extends RootApi {
  constructor(id: number) {
    super(
      {
        url: '/api/v1/bank/location/delete',
        method: 'delete',
        params: {
          id,
        },
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class UpdateLocationApi extends RootApi<UpdateLocation> {
  constructor(data: UpdateLocation) {
    super(
      {
        url: '/api/v1/bank/location/update',
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

export class MostActiveUsersApi extends RootApi {
  constructor(params: Partial<ListParams<MostActiveUserObj>> = {}) {
    super(
      {
        url: '/api/v1/bank/owner/bill/most-active-users',
        method: 'get',
        params,
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class MostActiveConsumersApi extends RootApi {
  constructor(params: Partial<ListParams<MostActiveConsumerObj>> = {}) {
    super(
      {
        url: '/api/v1/bank/consumer/most-active-consumers',
        method: 'get',
        params,
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class MostActiveLocationsApi extends RootApi {
  constructor(params: Partial<ListParams<MostActiveConsumerObj>> = {}) {
    super(
      {
        url: '/api/v1/bank/location/most-active-locations',
        method: 'get',
        params,
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class MostActiveReceiversApi extends RootApi {
  constructor(params: Partial<ListParams<MostActiveReceiverObj>> = {}) {
    super(
      {
        url: '/api/v1/bank/receiver/most-active-receivers',
        method: 'get',
        params,
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}
