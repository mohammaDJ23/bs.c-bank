import { AxiosError } from 'axios';
import {
  ConsumerApi,
  ConsumersApi,
  ConsumersApiConstructorType,
  DeleteConsumerApi,
  MostActiveConsumersApi,
  MostActiveConsumersApiConstructorType,
  Request,
  UpdateConsumerApi,
} from '../../apis';
import { Consumer, Consumers, MostActiveConsumer, MostActiveConsumers, UpdateConsumer } from '../../lib';
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
import { Exception } from '../reducers';
import { setSpecificDetails } from './speceficDetails';

export function getInitialConsumer(id: number) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(ConsumerApi.name));
      const response = await new Request<Consumer>(new ConsumerApi(id)).build();
      dispatch(setSpecificDetails('consumer', response.data));
      dispatch(initialProcessingApiSuccess(ConsumerApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(ConsumerApi.name, error as AxiosError<Exception>));
    }
  };
}

export function deleteConsumer(id: number) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(processingApiLoading(DeleteConsumerApi.name));
      await new Request<Consumer>(new DeleteConsumerApi(id)).build();
      dispatch(processingApiSuccess(DeleteConsumerApi.name));
    } catch (error) {
      dispatch(processingApiError(DeleteConsumerApi.name, error as AxiosError<Exception>));
    }
  };
}

export function getInitialConsumers(params: ConsumersApiConstructorType = {}) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(ConsumersApi.name));
      const response = await new Request(new ConsumersApi(params)).build();
      const [list, total] = response.data;
      dispatch(createNewList(new Consumers({ list, total, page: params.page, take: params.take })));
      dispatch(initialProcessingApiSuccess(ConsumersApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(ConsumersApi.name, error as AxiosError<Exception>));
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
      dispatch(processingApiError(ConsumersApi.name, error as AxiosError<Exception>));
    }
  };
}

export function getInitialMostActiveConsumers(params: MostActiveConsumersApiConstructorType = {}) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(MostActiveConsumersApi.name));
      const response = await new Request<MostActiveConsumer[]>(new MostActiveConsumersApi(params)).build();
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
      dispatch(initialProcessingApiError(MostActiveConsumersApi.name, error as AxiosError<Exception>));
    }
  };
}

export function updateConsumer(data: UpdateConsumer) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(processingApiLoading(UpdateConsumerApi.name));
      await new Request<Consumer, UpdateConsumer>(new UpdateConsumerApi(data)).build();
      dispatch(processingApiSuccess(UpdateConsumerApi.name));
    } catch (error) {
      dispatch(processingApiError(UpdateConsumerApi.name, error as AxiosError<Exception>));
    }
  };
}
