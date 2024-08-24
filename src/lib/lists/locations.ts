import { List } from './newList';

export interface Location {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class Locations extends List<Location> {}
