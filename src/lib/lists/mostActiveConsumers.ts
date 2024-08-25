import { Consumer } from './consumers';
import { List } from './list';

export interface MostActiveConsumer {
  quantities: number;
  consumer: Consumer;
}

export class MostActiveConsumers extends List<MostActiveConsumer> {}
