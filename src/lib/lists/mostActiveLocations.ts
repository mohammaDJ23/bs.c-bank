import { List } from './list';
import { Location } from './locations';

export interface MostActiveLocation {
  quantities: number;
  location: Location;
}

export class MostActiveLocations extends List<MostActiveLocation> {}
