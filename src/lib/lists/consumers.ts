import { List } from './list';

export interface Consumer {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class Consumers extends List<Consumer> {}
