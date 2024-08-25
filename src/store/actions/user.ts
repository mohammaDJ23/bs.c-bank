import { AxiosError } from 'axios';
import {
  CreateUserApi,
  DeletedUserQuantitiesApi,
  DeletedUsersApi,
  DeletedUsersApiConstructorType,
  MostActiveUsersApi,
  MostActiveUsersApiConstructorType,
  Request,
  UserQuantitiesApi,
  UsersApi,
  UsersApiConstructorType,
} from '../../apis';
import { CreateUser, DeletedUsers, MostActiveUser, MostActiveUsers, User, Users } from '../../lib';
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
import { DeletedUserQuantities, Exception, UserQuantities } from '../reducers';
import { setSpecificDetails } from './speceficDetails';

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
