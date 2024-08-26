import { UpdateReceiver } from '../lib';
import { RootApi } from './resetApi';
import { ReceiverListFiltersObj } from '../lib/forms/receiverListFilters';
import { ListParams } from '../lib/lists/list';

export class MostActiveReceiversApi extends RootApi {
  constructor(params: Partial<ListParams> = {}) {
    super(
      {
        url: '/api/v1/bank/receiver/most-active-receivers',
        method: 'get',
        params,
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export type MostActiveReceiversApiConstructorType = ConstructorParameters<typeof MostActiveReceiversApi>[0];

export class ReceiversApi extends RootApi {
  constructor(params: Partial<ListParams<Partial<ReceiverListFiltersObj>>> = {}) {
    super(
      {
        url: '/api/v1/bank/receiver/all',
        method: 'get',
        params,
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export type ReceiversApiConstructorType = ConstructorParameters<typeof ReceiversApi>[0];

export class ReceiverApi extends RootApi {
  constructor(id: number) {
    super(
      {
        url: `/api/v1/bank/receiver/${id}`,
        method: 'get',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class UpdateReceiverApi extends RootApi<UpdateReceiver> {
  constructor(data: UpdateReceiver) {
    super(
      {
        url: '/api/v1/bank/receiver/update',
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

export class DeleteReceiverApi extends RootApi {
  constructor(id: number) {
    super(
      {
        url: '/api/v1/bank/receiver/delete',
        method: 'delete',
        params: {
          id,
        },
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}
