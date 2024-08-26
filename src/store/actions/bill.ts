import { AxiosError } from 'axios';
import {
  AllBillQuantitiesApi,
  AllBillsApi,
  AllBillsApiConstructorType,
  AllDeletedBillQuantitiesApi,
  BillApi,
  BillQuantitiesApi,
  BillsApi,
  BillsApiConstructorType,
  CreateBillApi,
  DeleteBillApi,
  DeletedBillsApi,
  DeletedBillsApiConstructorType,
  LastYearBillsApi,
  Request,
} from '../../apis';
import { AllBills, Bill, Bills, CreateBill, DeletedBills } from '../../lib';
import {
  AllBillQuantities,
  AllDeletedBillQuantities,
  BillQuantities,
  DeletedBillQuantities,
  Exception,
  LastYearBill,
} from '../reducers';
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

export function getInitialBill(id: string) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(BillApi.name));
      const response = await new Request<Bill, string>(new BillApi(id)).build();
      dispatch(setSpecificDetails('bill', response.data));
      dispatch(initialProcessingApiSuccess(BillApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(BillApi.name, error as AxiosError<Exception>));
    }
  };
}

export function getInitialBills(params: BillsApiConstructorType = {}) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(BillsApi.name));
      const response = await new Request<[Bill[], number]>(new BillsApi(params)).build();
      const [list, total] = response.data;
      dispatch(createNewList(new Bills({ list, total, page: params.page, take: params.take })));
      dispatch(initialProcessingApiSuccess(BillsApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(BillsApi.name, error as AxiosError<Exception>));
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
      dispatch(processingApiError(BillsApi.name, error as AxiosError<Exception>));
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
      dispatch(initialProcessingApiError(AllBillsApi.name, error as AxiosError<Exception>));
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
      dispatch(processingApiError(AllBillsApi.name, error as AxiosError<Exception>));
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
      dispatch(initialProcessingApiError(DeletedBillsApi.name, error as AxiosError<Exception>));
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
      dispatch(processingApiError(DeletedBillsApi.name, error as AxiosError<Exception>));
    }
  };
}

export function deleteBill(id: string) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(processingApiLoading(DeleteBillApi.name));
      await new Request<Bill, string>(new DeleteBillApi(id)).build();
      dispatch(processingApiSuccess(DeleteBillApi.name));
    } catch (error) {
      dispatch(processingApiError(DeleteBillApi.name, error as AxiosError<Exception>));
    }
  };
}

export function createBill(data: CreateBill) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(processingApiLoading(CreateBillApi.name));
      await new Request<Bill, CreateBill>(new CreateBillApi(data)).build();
      dispatch(processingApiSuccess(CreateBillApi.name));
    } catch (error) {
      dispatch(processingApiError(CreateBillApi.name, error as AxiosError<Exception>));
    }
  };
}

export function getInitialAllBillQuantities() {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(AllBillQuantitiesApi.name));
      const response = await new Request<AllBillQuantities>(new AllBillQuantitiesApi()).build();
      dispatch(
        setSpecificDetails('allBillQuantities', new AllBillQuantities(response.data.amount, response.data.quantities))
      );
      dispatch(initialProcessingApiSuccess(AllBillQuantitiesApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(AllBillQuantitiesApi.name, error as AxiosError<Exception>));
    }
  };
}

export function getInitialAllDeletedBillQuantities() {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(AllDeletedBillQuantitiesApi.name));
      const response = await new Request<AllDeletedBillQuantities>(new AllDeletedBillQuantitiesApi()).build();
      dispatch(
        setSpecificDetails(
          'allDeletedBillQuantities',
          new AllDeletedBillQuantities(response.data.amount, response.data.quantities)
        )
      );
      dispatch(initialProcessingApiSuccess(AllDeletedBillQuantitiesApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(AllDeletedBillQuantitiesApi.name, error as AxiosError<Exception>));
    }
  };
}

export function getInitialBillQuantities() {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(BillQuantitiesApi.name));
      const response = await new Request<BillQuantities>(new BillQuantitiesApi()).build();
      dispatch(
        setSpecificDetails('billquantities', new BillQuantities(response.data.amount, response.data.quantities))
      );
      dispatch(initialProcessingApiSuccess(BillQuantitiesApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(BillQuantitiesApi.name, error as AxiosError<Exception>));
    }
  };
}

export function getInitialLastYearBill() {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(LastYearBillsApi.name));
      const response = await new Request<LastYearBill[]>(new LastYearBillsApi()).build();
      dispatch(setSpecificDetails('lastYearBills', response.data));
      dispatch(initialProcessingApiSuccess(LastYearBillsApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(LastYearBillsApi.name, error as AxiosError<Exception>));
    }
  };
}
