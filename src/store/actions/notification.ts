import { AxiosError } from 'axios';
import { NotificationQuantitiesApi, NotificationsApi, NotificationsApiConstructorType, Request } from '../../apis';
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
import { Exception, NotificationQuantities } from '../reducers';
import { setSpecificDetails } from './speceficDetails';

export function getInitialNotifications(params: NotificationsApiConstructorType = {}) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(NotificationsApi.name));
      const response = await new Request(new NotificationsApi(params)).build();
      const [list, total] = response.data;
      dispatch(createNewList(new Notifications({ list, total, page: params.page, take: params.take })));
      dispatch(initialProcessingApiSuccess(NotificationsApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(NotificationsApi.name, error as AxiosError<Exception>));
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
      dispatch(processingApiError(NotificationsApi.name, error as AxiosError<Exception>));
    }
  };
}

export function getInitialNotificationQuantities() {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(NotificationQuantitiesApi.name));
      const response = await new Request<NotificationQuantities>(new NotificationQuantitiesApi()).build();
      dispatch(setSpecificDetails('notificationQuantities', response.data));
      dispatch(initialProcessingApiSuccess(NotificationQuantitiesApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(NotificationQuantitiesApi.name, error as AxiosError<Exception>));
    }
  };
}
