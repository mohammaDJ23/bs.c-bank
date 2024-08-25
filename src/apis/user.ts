import { CreateUser, UpdateUserByOwner, UpdateUser, UserListFiltersObj, DeletedUserListFiltersObj } from '../lib';
import { RootApi } from './resetApi';
import { ListParams } from '../lib/lists/list';

export class MostActiveUsersApi extends RootApi {
  constructor(params: Partial<ListParams> = {}) {
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

export type MostActiveUsersApiConstructorType = ConstructorParameters<typeof MostActiveUsersApi>[0];

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
  constructor(params: Partial<ListParams<Partial<DeletedUserListFiltersObj>>>) {
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
