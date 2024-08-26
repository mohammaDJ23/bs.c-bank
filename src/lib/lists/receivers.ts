import { List } from './list';

export interface Receiver {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class Receivers extends List<Receiver> {}
