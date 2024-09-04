import { List } from './list';
import { Location } from './locations';
import { MostActiveReceiver } from './mostActiveReceivers';

export interface MostActiveLocationByReceivers {
  location: Location;
  receivers: MostActiveReceiver[];
}

export class MostActiveLocationsByReceivers extends List<MostActiveLocationByReceivers> {
  constructor() {
    super({ take: 20 });
  }
}
