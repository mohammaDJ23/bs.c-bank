import {
  MostActiveReceiversApi,
  MostActiveReceiversApiConstructorType,
  ReceiversApi,
  ReceiversApiConstructorType,
  Request,
} from '../../apis';
import { MostActiveReceivers, Receiver, Receivers } from '../../lib';
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

export function getInitialReceivers(params: ReceiversApiConstructorType = {}) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(ReceiversApi.name));
      const response = await new Request<[Receiver[], number]>(new ReceiversApi(params)).build();
      const [list, total] = response.data;
      dispatch(createNewList(new Receivers({ list, total, page: params.page, take: params.take })));
      dispatch(initialProcessingApiSuccess(ReceiversApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(ReceiversApi.name));
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
      dispatch(processingApiError(ReceiversApi.name));
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
      dispatch(initialProcessingApiError(MostActiveReceiversApi.name));
    }
  };
}
