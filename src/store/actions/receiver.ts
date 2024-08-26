import { AxiosError } from 'axios';
import {
  MostActiveReceiversApi,
  MostActiveReceiversApiConstructorType,
  ReceiverApi,
  ReceiversApi,
  ReceiversApiConstructorType,
  Request,
} from '../../apis';
import { MostActiveReceivers, Receiver, Receivers } from '../../lib';
import { Exception } from '../reducers';
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
import { setSpecificDetails } from './speceficDetails';

export function getInitialReceivers(params: ReceiversApiConstructorType = {}) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(ReceiversApi.name));
      const response = await new Request<[Receiver[], number]>(new ReceiversApi(params)).build();
      const [list, total] = response.data;
      dispatch(createNewList(new Receivers({ list, total, page: params.page, take: params.take })));
      dispatch(initialProcessingApiSuccess(ReceiversApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(ReceiversApi.name, error as AxiosError<Exception>));
    }
  };
}

export function getReceivers(params: ReceiversApiConstructorType = {}) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(processingApiLoading(ReceiversApi.name));
      const response = await new Request<[Receiver[], number]>(new ReceiversApi(params)).build();
      const [list, total] = response.data;
      dispatch(createNewList(new Receivers({ list, total, page: params.page, take: params.take })));
      dispatch(processingApiSuccess(ReceiversApi.name));
    } catch (error) {
      dispatch(processingApiError(ReceiversApi.name, error as AxiosError<Exception>));
    }
  };
}

export function getInitialMostActiveReceivers(params: MostActiveReceiversApiConstructorType = {}) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(MostActiveReceiversApi.name));
      const response = await new Request<MostActiveReceivers[]>(new MostActiveReceiversApi(params)).build();
      dispatch(
        createNewList(
          new MostActiveReceivers({
            list: response.data,
            total: response.data.length,
            page: params.page,
            take: params.take,
          })
        )
      );
      dispatch(initialProcessingApiSuccess(MostActiveReceiversApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(MostActiveReceiversApi.name, error as AxiosError<Exception>));
    }
  };
}

export function getInitialReceiver(id: number) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(ReceiverApi.name));
      const response = await new Request<Receiver, number>(new ReceiverApi(id)).build();
      dispatch(setSpecificDetails('receiver', response.data));
      dispatch(initialProcessingApiSuccess(ReceiverApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(ReceiverApi.name, error as AxiosError<Exception>));
    }
  };
}
