import { AxiosError } from 'axios';
import {
  DeleteLocationApi,
  LocaitonApi,
  LocationsApi,
  LocationsApiConstructorType,
  MostActiveLocationsApi,
  MostActiveLocationsApiConstructorType,
  Request,
  UpdateLocationApi,
} from '../../apis';
import { Locations, MostActiveLocation, MostActiveLocations, UpdateLocation } from '../../lib';
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
import UpdateLocation from '../../pages/UpdateLocation';

export function getInitialLocations(params: LocationsApiConstructorType = {}) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(LocationsApi.name));
      const response = await new Request(new LocationsApi(params)).build();
      const [list, total] = response.data;
      dispatch(createNewList(new Locations({ list, total, page: params.page, take: params.take })));
      dispatch(initialProcessingApiSuccess(LocationsApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(LocationsApi.name, error as AxiosError<Exception>));
    }
  };
}

export function getLocations(params: LocationsApiConstructorType = {}) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(processingApiLoading(LocationsApi.name));
      const response = await new Request(new LocationsApi(params)).build();
      const [list, total] = response.data;
      dispatch(createNewList(new Locations({ list, total, page: params.page, take: params.take })));
      dispatch(processingApiSuccess(LocationsApi.name));
    } catch (error) {
      dispatch(processingApiError(LocationsApi.name, error as AxiosError<Exception>));
    }
  };
}

export function getInitialMostActiveLocations(params: MostActiveLocationsApiConstructorType = {}) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(MostActiveLocationsApi.name));
      const response = await new Request<MostActiveLocation[]>(new MostActiveLocationsApi(params)).build();
      dispatch(
        createNewList(
          new MostActiveLocations({
            list: response.data,
            total: response.data.length,
            page: params.page,
            take: params.take,
          })
        )
      );
      dispatch(initialProcessingApiSuccess(MostActiveLocationsApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(MostActiveLocationsApi.name, error as AxiosError<Exception>));
    }
  };
}

export function getInitialLocation(id: number) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(LocaitonApi.name));
      const response = await new Request<Location, number>(new LocaitonApi(id)).build();
      dispatch(setSpecificDetails('location', response.data));
      dispatch(initialProcessingApiSuccess(LocaitonApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(LocaitonApi.name, error as AxiosError<Exception>));
    }
  };
}

export function deleteLocation(id: number) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(processingApiLoading(DeleteLocationApi.name));
      await new Request<Location, number>(new DeleteLocationApi(id)).build();
      dispatch(processingApiSuccess(DeleteLocationApi.name));
    } catch (error) {
      dispatch(processingApiError(DeleteLocationApi.name, error as AxiosError<Exception>));
    }
  };
}

export function updateLocation(data: UpdateLocation) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(processingApiLoading(UpdateLocationApi.name));
      await new Request<Location, UpdateLocation>(new UpdateLocationApi(data)).build();
      dispatch(processingApiSuccess(UpdateLocationApi.name));
    } catch (error) {
      dispatch(processingApiError(UpdateLocationApi.name, error as AxiosError<Exception>));
    }
  };
}
