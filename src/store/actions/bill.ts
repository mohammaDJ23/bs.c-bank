import {
  AllBillsApi,
  AllBillsApiConstructorType,
  BillsApi,
  BillsApiConstructorType,
  DeletedBillsApi,
  DeletedBillsApiConstructorType,
  Request,
} from '../../apis';
import { AllBills, Bill, Bills, DeletedBills } from '../../lib';
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

export function getInitialBills(params: BillsApiConstructorType = {}) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(BillsApi.name));
      const response = await new Request<[Bill[], number]>(new BillsApi(params)).build();
      const [list, total] = response.data;
      dispatch(createNewList(new Bills({ list, total, page: params.page, take: params.take })));
      dispatch(initialProcessingApiSuccess(BillsApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(BillsApi.name));
    }
  };
}

export function getBills(params: BillsApiConstructorType = {}) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(processingApiLoading(BillsApi.name));
      const response = await new Request<[Bill[], number]>(new BillsApi(params)).build();
      const [list, total] = response.data;
      dispatch(createNewList(new Bills({ list, total, page: params.page, take: params.take })));
      dispatch(processingApiSuccess(BillsApi.name));
    } catch (error) {
      dispatch(processingApiError(BillsApi.name));
    }
  };
}

export function getInitialAllBills(params: AllBillsApiConstructorType = {}) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(AllBillsApi.name));
      const response = await new Request<[Bill[], number]>(new AllBillsApi(params)).build();
      const [list, total] = response.data;
      dispatch(createNewList(new AllBills({ list, total, page: params.page, take: params.take })));
      dispatch(initialProcessingApiSuccess(AllBillsApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(AllBillsApi.name));
    }
  };
}

export function getAllBills(params: AllBillsApiConstructorType = {}) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(processingApiLoading(AllBillsApi.name));
      const response = await new Request<[Bill[], number]>(new AllBillsApi(params)).build();
      const [list, total] = response.data;
      dispatch(createNewList(new AllBills({ list, total, page: params.page, take: params.take })));
      dispatch(processingApiSuccess(AllBillsApi.name));
    } catch (error) {
      dispatch(processingApiError(AllBillsApi.name));
    }
  };
}

export function getInitialDeletedBills(params: DeletedBillsApiConstructorType = {}) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(DeletedBillsApi.name));
      const response = await new Request<[Bill[], number]>(new DeletedBillsApi(params)).build();
      const [list, total] = response.data;
      dispatch(createNewList(new DeletedBills({ list, total, page: params.page, take: params.take })));
      dispatch(initialProcessingApiSuccess(DeletedBillsApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(DeletedBillsApi.name));
    }
  };
}

export function getDeletedBills(params: DeletedBillsApiConstructorType = {}) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(processingApiLoading(DeletedBillsApi.name));
      const response = await new Request<[Bill[], number]>(new DeletedBillsApi(params)).build();
      const [list, total] = response.data;
      dispatch(createNewList(new DeletedBills({ list, total, page: params.page, take: params.take })));
      dispatch(processingApiSuccess(DeletedBillsApi.name));
    } catch (error) {
      dispatch(processingApiError(DeletedBillsApi.name));
    }
  };
}
