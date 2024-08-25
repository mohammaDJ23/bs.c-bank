import {
  DeletedUsersApi,
  DeletedUsersApiConstructorType,
  MostActiveUsersApi,
  MostActiveUsersApiConstructorType,
  Request,
  UsersApi,
  UsersApiConstructorType,
} from '../../apis';
import { DeletedUsers, MostActiveUser, MostActiveUsers, User, Users } from '../../lib';
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

export function getInitialUsers(params: UsersApiConstructorType = {}) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(UsersApi.name));
      const response = await new Request<[User[], number]>(new UsersApi(params)).build();
      const [list, total] = response.data;
      dispatch(createNewList(new Users({ list, total, page: params.page, take: params.take })));
      dispatch(initialProcessingApiSuccess(UsersApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(UsersApi.name));
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
      dispatch(processingApiError(UsersApi.name));
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
      dispatch(initialProcessingApiError(DeletedUsersApi.name));
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
      dispatch(processingApiError(DeletedUsersApi.name));
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
      dispatch(initialProcessingApiError(MostActiveUsersApi.name));
    }
  };
}
