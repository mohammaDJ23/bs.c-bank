import { LocationListFiltersObj, UpdateLocation } from '../lib';
import { RootApi } from './resetApi';
import { ListParams } from '../lib/lists/list';

export class LocationsApi extends RootApi {
  constructor(params: Partial<ListParams<Partial<LocationListFiltersObj>>> = {}) {
    super(
      {
        url: '/api/v1/bank/location/all',
        method: 'get',
        params,
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export type LocationsApiConstructorType = ConstructorParameters<typeof LocationsApi>[0];

export class LocaitonApi extends RootApi {
  constructor(id: number) {
    super(
      {
        url: `/api/v1/bank/location/${id}`,
        method: 'get',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class DeleteLocationApi extends RootApi {
  constructor(id: number) {
    super(
      {
        url: '/api/v1/bank/location/delete',
        method: 'delete',
        params: {
          id,
        },
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class UpdateLocationApi extends RootApi<UpdateLocation> {
  constructor(data: UpdateLocation) {
    super(
      {
        url: '/api/v1/bank/location/update',
        method: 'put',
        data,
        headers: {
          'Content-type': 'application/json',
        },
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class MostActiveLocationsApi extends RootApi {
  constructor(params: Partial<ListParams> = {}) {
    super(
      {
        url: '/api/v1/bank/location/most-active-locations',
        method: 'get',
        params,
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export type MostActiveLocationsApiConstructorType = ConstructorParameters<typeof MostActiveLocationsApi>[0];

export class MostActiveLocationsByReceiversApi extends RootApi {
  constructor(params: Partial<ListParams> = {}) {
    super(
      {
        url: '/api/v1/bank/location/most-active-locations-by-receivers',
        method: 'get',
        params,
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export type MostActiveLocationsByReceiversApiConstructorType = ConstructorParameters<
  typeof MostActiveLocationsByReceiversApi
>[0];
