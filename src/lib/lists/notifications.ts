import { List } from './newList';
import { User } from './users';

export interface Notification {
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
  user: User;
}

export class Notifications extends List<Notification> {}
