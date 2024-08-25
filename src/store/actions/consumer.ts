import {
  ConsumersApi,
  ConsumersApiConstructorType,
  MostActiveConsumersApi,
  MostActiveConsumersApiConstructorType,
  Request,
} from '../../apis';
import { Consumers, MostActiveConsumer, MostActiveConsumers } from '../../lib';
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

export function getInitialConsumers(params: ConsumersApiConstructorType = {}) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(ConsumersApi.name));
      const response = await new Request(new ConsumersApi(params)).build();
      const [list, total] = response.data;
      dispatch(createNewList(new Consumers({ list, total, page: params.page, take: params.take })));
      dispatch(initialProcessingApiSuccess(ConsumersApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(ConsumersApi.name));
    }
  };
}

export function getConsumers(params: ConsumersApiConstructorType = {}) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(processingApiLoading(ConsumersApi.name));
      const response = await new Request(new ConsumersApi(params)).build();
      const [list, total] = response.data;
      dispatch(createNewList(new Consumers({ list, total, page: params.page, take: params.take })));
      dispatch(processingApiSuccess(ConsumersApi.name));
    } catch (error) {
      dispatch(processingApiError(ConsumersApi.name));
    }
  };
}

export function getInitialMostActiveConsumers(params: MostActiveConsumersApiConstructorType = {}) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(MostActiveConsumersApi.name));
      const response = await new Request<MostActiveConsumer[]>(new MostActiveConsumersApi()).build();
      dispatch(
        createNewList(
          new MostActiveConsumers({
            list: response.data,
            total: response.data.length,
            page: params.page,
            take: params.take,
          })
        )
      );
      dispatch(initialProcessingApiSuccess(MostActiveConsumersApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(MostActiveConsumersApi.name));
    }
  };
}
