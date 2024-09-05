import { List } from './list';
import { Location } from './locations';
import { MostActiveReceiver } from './mostActiveReceivers';

export interface MostActiveLocationByReceivers {
  quantities: number;
  location: Location;
  receivers: MostActiveReceiver[];
}

export class MostActiveLocationsByReceivers extends List<MostActiveLocationByReceivers> {
  constructor(arg: Partial<List> = {}) {
    super(arg);
    this.take = 20;
  }
}
