import { Request, UsersApi, UsersApiConstructorType } from '../../apis';
import { User, Users } from '../../lib';
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

export function getInitialUsers() {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(UsersApi.name));
      const response = await new Request<[User[], number]>(new UsersApi()).build();
      const [list, total] = response.data;
      dispatch(createNewList(new Users({ list, total })));
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
      dispatch(createNewList(new Users({ list, total, page: params.page })));
      dispatch(processingApiSuccess(UsersApi.name));
    } catch (error) {
      dispatch(processingApiError(UsersApi.name));
    }
  };
}
