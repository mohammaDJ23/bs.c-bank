import { AxiosError } from 'axios';
import {
  CreateUserApi,
  DeletedUserApi,
  DeletedUserQuantitiesApi,
  DeletedUsersApi,
  DeletedUsersApiConstructorType,
  DeleteUserApi,
  DeleteUserByOwnerApi,
  LastYearUsersApi,
  MostActiveUsersApi,
  MostActiveUsersApiConstructorType,
  Request,
  RestoreUserApi,
  UpdateUserApi,
  UpdateUserByOwnerApi,
  UserApi,
  UserQuantitiesApi,
  UsersApi,
  UsersApiConstructorType,
  UserWithBillInfoApi,
} from '../../apis';
import {
  AccessTokenObj,
  CreateUser,
  DeletedUsers,
  MostActiveUser,
  MostActiveUsers,
  UpdateUser,
  UpdateUserByOwner,
  User,
  Users,
  UserWithBillInfo,
} from '../../lib';
import { RootDispatch } from '../store';
import { createNewList } from './list';
import {
  initialProcessingApiError,
  initialProcessingApiLoading,
  initialProcessingApiSuccess,
  processingApiError,
  processingApiLoading,
  processingApiSuccess,
} from './requestProcess';
import { DeletedUserQuantities, Exception, LastYearUser, UserQuantities } from '../reducers';
import { setSpecificDetails } from './speceficDetails';

export function getInitialUser(id: number) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(UserApi.name));
      const response = await new Request<User, number>(new UserApi(id)).build();
      dispatch(setSpecificDetails('user', response.data));
      dispatch(initialProcessingApiSuccess(UserApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(UserApi.name, error as AxiosError<Exception>));
    }
  };
}

export function getInitialUsers(params: UsersApiConstructorType = {}) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(UsersApi.name));
      const response = await new Request<[User[], number]>(new UsersApi(params)).build();
      const [list, total] = response.data;
      dispatch(createNewList(new Users({ list, total, page: params.page, take: params.take })));
      dispatch(initialProcessingApiSuccess(UsersApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(UsersApi.name, error as AxiosError<Exception>));
    }
  };
}

export function getUsers(params: UsersApiConstructorType = {}) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(processingApiLoading(UsersApi.name));
      const response = await new Request<[User[], number]>(new UsersApi(params)).build();
      const [list, total] = response.data;
      dispatch(createNewList(new Users({ list, total, page: params.page, take: params.take })));
      dispatch(processingApiSuccess(UsersApi.name));
    } catch (error) {
      dispatch(processingApiError(UsersApi.name, error as AxiosError<Exception>));
    }
  };
}

export function getInitialDeletedUsers(params: DeletedUsersApiConstructorType = {}) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(DeletedUsersApi.name));
      const response = await new Request<[User[], number]>(new DeletedUsersApi(params)).build();
      const [list, total] = response.data;
      dispatch(createNewList(new DeletedUsers({ list, total, page: params.page, take: params.take })));
      dispatch(initialProcessingApiSuccess(DeletedUsersApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(DeletedUsersApi.name, error as AxiosError<Exception>));
    }
  };
}

export function getDeletedUsers(params: DeletedUsersApiConstructorType = {}) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(processingApiLoading(DeletedUsersApi.name));
      const response = await new Request<[User[], number]>(new DeletedUsersApi(params)).build();
      const [list, total] = response.data;
      dispatch(createNewList(new DeletedUsers({ list, total, page: params.page, take: params.take })));
      dispatch(processingApiSuccess(DeletedUsersApi.name));
    } catch (error) {
      dispatch(processingApiError(DeletedUsersApi.name, error as AxiosError<Exception>));
    }
  };
}

export function getInitialMostActiveUsers(params: MostActiveUsersApiConstructorType = {}) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(MostActiveUsersApi.name));
      const response = await new Request<MostActiveUser[]>(new MostActiveUsersApi(params)).build();
      dispatch(
        createNewList(
          new MostActiveUsers({
            list: response.data,
            total: response.data.length,
            page: params.page,
            take: params.take,
          })
        )
      );
      dispatch(initialProcessingApiSuccess(MostActiveUsersApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(MostActiveUsersApi.name, error as AxiosError<Exception>));
    }
  };
}

export function createUser(data: CreateUser) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(processingApiLoading(CreateUserApi.name));
      await new Request<User, CreateUser>(new CreateUserApi(data)).build();
      dispatch(processingApiSuccess(CreateUserApi.name));
    } catch (error) {
      dispatch(processingApiError(CreateUserApi.name, error as AxiosError<Exception>));
    }
  };
}

export function getInitialUserQuantities() {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(UserQuantitiesApi.name));
      const response = await new Request<UserQuantities>(new UserQuantitiesApi()).build();
      dispatch(setSpecificDetails('userQuantities', new UserQuantities(response.data)));
      dispatch(initialProcessingApiSuccess(UserQuantitiesApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(UserQuantitiesApi.name, error as AxiosError<Exception>));
    }
  };
}

export function getInitialDeletedUserQuantities() {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(DeletedUserQuantitiesApi.name));
      const response = await new Request<DeletedUserQuantities>(new DeletedUserQuantitiesApi()).build();
      dispatch(setSpecificDetails('deletedUserQuantities', new DeletedUserQuantities(response.data)));
      dispatch(initialProcessingApiSuccess(DeletedUserQuantitiesApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(DeletedUserQuantitiesApi.name, error as AxiosError<Exception>));
    }
  };
}

export function getInitialLastYearUsers() {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(LastYearUsersApi.name));
      const response = await new Request<LastYearUser[]>(new LastYearUsersApi()).build();
      dispatch(setSpecificDetails('lastYearUsers', response.data));
      dispatch(initialProcessingApiSuccess(LastYearUsersApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(LastYearUsersApi.name, error as AxiosError<Exception>));
    }
  };
}

export function getInitialDeletedUser(id: number) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(DeletedUserApi.name));
      const response = await new Request<UserWithBillInfo, number>(new DeletedUserApi(id)).build();
      dispatch(setSpecificDetails('deletedUser', response.data));
      dispatch(initialProcessingApiSuccess(DeletedUserApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(DeletedUserApi.name, error as AxiosError<Exception>));
    }
  };
}

export function restoreUser(id: number) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(processingApiLoading(RestoreUserApi.name));
      await new Request<User, number>(new RestoreUserApi(id)).build();
      dispatch(processingApiSuccess(RestoreUserApi.name));
    } catch (error) {
      dispatch(processingApiError(RestoreUserApi.name, error as AxiosError<Exception>));
    }
  };
}

export function updateUser(data: UpdateUser) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(processingApiLoading(UpdateUserApi.name));
      const response = await new Request<AccessTokenObj, UpdateUser>(new UpdateUserApi(data)).build();
      dispatch(setSpecificDetails('updatedUser', response.data));
      dispatch(processingApiSuccess(UpdateUserApi.name));
    } catch (error) {
      dispatch(processingApiError(UpdateUserApi.name, error as AxiosError<Exception>));
    }
  };
}

export function updateUserByOwner(data: UpdateUserByOwner, id: number) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(processingApiLoading(UpdateUserByOwnerApi.name));
      const response = await new Request<AccessTokenObj, UpdateUserByOwner>(new UpdateUserByOwnerApi(data, id)).build();
      dispatch(setSpecificDetails('updatedUserByOwner', response.data));
      dispatch(processingApiSuccess(UpdateUserByOwnerApi.name));
    } catch (error) {
      dispatch(processingApiError(UpdateUserByOwnerApi.name, error as AxiosError<Exception>));
    }
  };
}

export function getInitialUserWithBillInfo(id: number) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(UserWithBillInfoApi.name));
      const response = await new Request<UserWithBillInfo, number>(new UserWithBillInfoApi(id)).build();
      dispatch(setSpecificDetails('userWithBillInfo', response.data));
      dispatch(initialProcessingApiSuccess(UserWithBillInfoApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(UserWithBillInfoApi.name, error as AxiosError<Exception>));
    }
  };
}

export function deleteUser() {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(processingApiLoading(DeleteUserApi.name));
      await new Request<User>(new DeleteUserApi()).build();
      dispatch(processingApiSuccess(DeleteUserApi.name));
    } catch (error) {
      dispatch(processingApiError(DeleteUserApi.name, error as AxiosError<Exception>));
    }
  };
}

export function deleteUserByOwner(id: number) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(processingApiLoading(DeleteUserByOwnerApi.name));
      await new Request<User, number>(new DeleteUserByOwnerApi(id)).build();
      dispatch(processingApiSuccess(DeleteUserByOwnerApi.name));
    } catch (error) {
      dispatch(processingApiError(DeleteUserByOwnerApi.name, error as AxiosError<Exception>));
    }
  };
}
