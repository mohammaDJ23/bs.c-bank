import { AxiosError } from 'axios';
import { Exception, RequestProcess } from '../reducers';

export interface ProcessingApiLoadingAction {
  type: RequestProcess.PROCESSING_API_LOADING;
  payload: { name: string };
}

export interface ProcessingApiSuccessAction {
  type: RequestProcess.PROCESSING_API_SUCCESS;
  payload: { name: string };
}

export interface ProcessingApiErrorAction {
  type: RequestProcess.PROCESSING_API_ERROR;
  payload: { name: string; error: AxiosError<Exception> };
}

export interface InitialProcessingApiLoadingAction {
  type: RequestProcess.INITIAL_PROCESSING_API_LOADING;
  payload: { name: string };
}

export interface InitialProcessingApiSuccessAction {
  type: RequestProcess.INITIAL_PROCESSING_API_SUCCESS;
  payload: { name: string };
}

export interface InitialProcessingApiErrorAction {
  type: RequestProcess.INITIAL_PROCESSING_API_ERROR;
  payload: { name: string; error: AxiosError<Exception> };
}

export type RequestProcessActions =
  | ProcessingApiLoadingAction
  | ProcessingApiSuccessAction
  | ProcessingApiErrorAction
  | InitialProcessingApiLoadingAction
  | InitialProcessingApiSuccessAction
  | InitialProcessingApiErrorAction;

export function processingApiLoading(name: string): ProcessingApiLoadingAction {
  return {
    type: RequestProcess.PROCESSING_API_LOADING,
    payload: { name },
  };
}

export function processingApiSuccess(name: string): ProcessingApiSuccessAction {
  return {
    type: RequestProcess.PROCESSING_API_SUCCESS,
    payload: { name },
  };
}

export function processingApiError(name: string, error: AxiosError<Exception>): ProcessingApiErrorAction {
  return {
    type: RequestProcess.PROCESSING_API_ERROR,
    payload: { name, error },
  };
}

export function initialProcessingApiLoading(name: string): InitialProcessingApiLoadingAction {
  return {
    type: RequestProcess.INITIAL_PROCESSING_API_LOADING,
    payload: { name },
  };
}

export function initialProcessingApiSuccess(name: string): InitialProcessingApiSuccessAction {
  return {
    type: RequestProcess.INITIAL_PROCESSING_API_SUCCESS,
    payload: { name },
  };
}

export function initialProcessingApiError(name: string, error: AxiosError<Exception>): InitialProcessingApiErrorAction {
  return {
    type: RequestProcess.INITIAL_PROCESSING_API_ERROR,
    payload: { name, error },
  };
}
