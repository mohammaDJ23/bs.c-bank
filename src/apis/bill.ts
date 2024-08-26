import { CreateBill, UpdateBill, BillListFiltersObj, DeletedBillListFiltersObj, AllBillListFiltersObj } from '../lib';
import { RootApi } from './resetApi';
import { ListParams } from '../lib/lists/list';

export class CreateBillApi extends RootApi<CreateBill> {
  constructor(data: CreateBill) {
    super(
      {
        url: '/api/v1/bank/bill/create',
        method: 'post',
        data,
        headers: {
          'Content-type': 'application/json',
        },
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class UpdateBillApi extends RootApi<UpdateBill> {
  constructor(data: UpdateBill) {
    super(
      {
        url: '/api/v1/bank/bill/update',
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

export class BillsApi extends RootApi {
  constructor(params: Partial<ListParams<Partial<BillListFiltersObj>>> = {}) {
    super(
      {
        url: '/api/v1/bank/bill/all',
        method: 'get',
        params,
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export type BillsApiConstructorType = ConstructorParameters<typeof BillsApi>[0];

export class AllBillsApi extends RootApi {
  constructor(params: Partial<ListParams<Partial<AllBillListFiltersObj>>> = {}) {
    super(
      {
        url: '/api/v1/bank/owner/bill/all',
        method: 'get',
        params,
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export type AllBillsApiConstructorType = ConstructorParameters<typeof AllBillsApi>[0];

export class DeletedBillsApi extends RootApi {
  constructor(params: Partial<ListParams<Partial<DeletedBillListFiltersObj>>> = {}) {
    super(
      {
        url: '/api/v1/bank/bill/all/deleted',
        method: 'get',
        params,
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export type DeletedBillsApiConstructorType = ConstructorParameters<typeof DeletedBillsApi>[0];

export class BillApi extends RootApi {
  constructor(id: string) {
    super(
      {
        url: `/api/v1/bank/bill/${id}`,
        method: 'get',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class DeletedBillApi extends RootApi {
  constructor(id: string) {
    super(
      {
        url: `/api/v1/bank/bill/deleted/${id}`,
        method: 'get',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class DeleteBillApi extends RootApi {
  constructor(id: string) {
    super(
      {
        url: '/api/v1/bank/bill/delete',
        method: 'delete',
        params: {
          id,
        },
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class RestoreBillApi extends RootApi {
  constructor(id: string) {
    super(
      {
        url: `/api/v1/bank/bill/restore/${id}`,
        method: 'post',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class BillQuantitiesApi extends RootApi {
  constructor() {
    super(
      {
        url: '/api/v1/bank/bill/quantities',
        method: 'get',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class LastYearBillsApi extends RootApi {
  constructor() {
    super(
      {
        url: '/api/v1/bank/bill/last-year',
        method: 'get',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class DownloadBillReportApi extends RootApi {
  constructor(id: number) {
    super(
      {
        url: `/api/v1/bank/bill/excel/${id}`,
        method: 'get',
        responseType: 'blob',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class AllBillQuantitiesApi extends RootApi {
  constructor() {
    super(
      {
        url: `/api/v1/bank/bill/all/quantities`,
        method: 'get',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class AllDeletedBillQuantitiesApi extends RootApi {
  constructor() {
    super(
      {
        url: `/api/v1/bank/bill/all/deleted-quantities`,
        method: 'get',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class DeletedBillQuantitiesApi extends RootApi {
  constructor() {
    super(
      {
        url: `/api/v1/bank/bill/deleted-quantities`,
        method: 'get',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}
