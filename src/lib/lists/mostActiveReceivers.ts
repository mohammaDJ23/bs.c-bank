import { List } from './list';
import { Receiver } from './receivers';

export interface MostActiveReceiver {
  quantities: number;
  receiver: Receiver;
}

export class MostActiveReceivers extends List<MostActiveReceiver> {}
