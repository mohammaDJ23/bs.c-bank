import { ListInstance, ListObj } from './list';
import { UserObj } from './user';

export interface NotificationObj {
  id: number;
  endpoint: string;
  expirationTime: number;
  visitorId: string;
  p256dh: string;
  auth: string;
  deviceDescription: string;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  user: UserObj;
}

export class NotificationList implements ListInstance {
  constructor(
    public list: ListObj<NotificationObj> = {},
    public total: number = 0,
    public page: number = 1,
    public take: number = 10
  ) {
    this.list = list;
    this.take = take;
    this.page = page;
    this.total = total;
  }
}
