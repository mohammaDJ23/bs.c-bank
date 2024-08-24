import { NotificationsApi, NotificationsApiConstructorType, Request } from '../../apis';
import { Notifications } from '../../lib';
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

export function getInitialNotifications(params: NotificationsApiConstructorType = {}) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(NotificationsApi.name));
      const response = await new Request(new NotificationsApi(params)).build();
      const [list, total] = response.data;
      dispatch(createNewList(new Notifications({ list, total, page: params.page, take: params.take })));
      dispatch(initialProcessingApiSuccess(NotificationsApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(NotificationsApi.name));
    }
  };
}

export function getNotifications(params: NotificationsApiConstructorType = {}) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(processingApiLoading(NotificationsApi.name));
      const response = await new Request(new NotificationsApi(params)).build();
      const [list, total] = response.data;
      dispatch(createNewList(new Notifications({ list, total, page: params.page, take: params.take })));
      dispatch(processingApiSuccess(NotificationsApi.name));
    } catch (error) {
      dispatch(processingApiError(NotificationsApi.name));
    }
  };
}
