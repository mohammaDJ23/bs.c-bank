import { ConsumerListFiltersObj, UpdateConsumer } from '../lib';
import { RootApi } from './resetApi';
import { ListParams } from '../lib/lists/list';

export class ConsumersApi extends RootApi {
  constructor(params: Partial<ListParams<Partial<ConsumerListFiltersObj>>> = {}) {
    super(
      {
        url: '/api/v1/bank/consumer/all',
        method: 'get',
        params,
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export type ConsumersApiConstructorType = ConstructorParameters<typeof ConsumersApi>[0];

export class ConsumerApi extends RootApi {
  constructor(id: number) {
    super(
      {
        url: `/api/v1/bank/consumer/${id}`,
        method: 'get',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class DeleteConsumerApi extends RootApi {
  constructor(id: number) {
    super(
      {
        url: '/api/v1/bank/consumer/delete',
        method: 'delete',
        params: {
          id,
        },
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class UpdateConsumerApi extends RootApi<UpdateConsumer> {
  constructor(data: UpdateConsumer) {
    super(
      {
        url: '/api/v1/bank/consumer/update',
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

export class MostActiveConsumersApi extends RootApi {
  constructor(params: Partial<ListParams> = {}) {
    super(
      {
        url: '/api/v1/bank/consumer/most-active-consumers',
        method: 'get',
        params,
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export type MostActiveConsumersApiConstructorType = ConstructorParameters<typeof MostActiveConsumersApi>[0];
