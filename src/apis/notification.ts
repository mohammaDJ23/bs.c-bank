import { NotificationListFiltersObj } from '../lib';
import { RootApi } from './resetApi';
import { ListParams } from '../lib/lists/list';

export class NotificationsApi extends RootApi {
  constructor(params: Partial<ListParams<Partial<NotificationListFiltersObj>>> = {}) {
    super(
      {
        url: '/api/v1/notification/all',
        method: 'get',
        params,
      },
      { baseURL: process.env.NOTIFICATION_SERVICE }
    );
  }
}

export type NotificationsApiConstructorType = ConstructorParameters<typeof NotificationsApi>[0];

export class NotificationApi extends RootApi {
  constructor(id: number) {
    super(
      {
        url: `/api/v1/notification/${id}`,
        method: 'get',
      },
      { baseURL: process.env.NOTIFICATION_SERVICE }
    );
  }
}

export class NotificationQuantitiesApi extends RootApi {
  constructor() {
    super(
      {
        url: `/api/v1/notification/quantities`,
        method: 'get',
      },
      { baseURL: process.env.NOTIFICATION_SERVICE }
    );
  }
}

export class AllNotificationQuantitiesApi extends RootApi {
  constructor() {
    super(
      {
        url: `/api/v1/notification/all/quantities`,
        method: 'get',
      },
      { baseURL: process.env.NOTIFICATION_SERVICE }
    );
  }
}
