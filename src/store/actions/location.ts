import {
  LocationsApi,
  LocationsApiConstructorType,
  MostActiveLocationsApi,
  MostActiveLocationsApiConstructorType,
  Request,
} from '../../apis';
import { Locations, MostActiveLocation, MostActiveLocations } from '../../lib';
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

export function getInitialLocations(params: LocationsApiConstructorType = {}) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(LocationsApi.name));
      const response = await new Request(new LocationsApi(params)).build();
      const [list, total] = response.data;
      dispatch(createNewList(new Locations({ list, total, page: params.page, take: params.take })));
      dispatch(initialProcessingApiSuccess(LocationsApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(LocationsApi.name));
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
      dispatch(processingApiError(LocationsApi.name));
    }
  };
}

export function getInitialMostActiveLocations(params: MostActiveLocationsApiConstructorType = {}) {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(MostActiveLocationsApi.name));
      const response = await new Request<MostActiveLocation[]>(new MostActiveLocationsApi()).build();
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
      dispatch(initialProcessingApiError(MostActiveLocationsApi.name));
    }
  };
}
