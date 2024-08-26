import { AxiosError } from 'axios';
import {
  AllNotificationQuantitiesApi,
  NotificationApi,
  NotificationQuantitiesApi,
  NotificationsApi,
  NotificationsApiConstructorType,
  Request,
} from '../../apis';
import { Notification, Notifications } from '../../lib';
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

export function getInitialAllNotificationQuantities() {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(AllNotificationQuantitiesApi.name));
      const response = await new Request<NotificationQuantities>(new AllNotificationQuantitiesApi()).build();
      dispatch(setSpecificDetails('allNotificationQuantities', response.data));
      dispatch(initialProcessingApiSuccess(AllNotificationQuantitiesApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(AllNotificationQuantitiesApi.name, error as AxiosError<Exception>));
    }
  };
}

export function getInitialNotification(id: number) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(NotificationApi.name));
      const response = await new Request<Notification, number>(new NotificationApi(id)).build();
      dispatch(setSpecificDetails('notification', response.data));
      dispatch(initialProcessingApiSuccess(NotificationApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(NotificationApi.name, error as AxiosError<Exception>));
    }
  };
}
