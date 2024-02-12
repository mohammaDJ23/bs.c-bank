import { BaseList } from './list';
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

export class NotificationList<T = NotificationObj> extends BaseList<T> {
  constructor(arg: Partial<BaseList<T>> = {}) {
    super(arg);
  }
}
