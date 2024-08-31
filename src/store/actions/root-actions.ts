import {
  HistoryActions,
  ModalActions,
  SpecificDetailsActions,
  RequestProcessActions,
  FormActions,
  ClearStateActions,
  UserServiceSocketActions,
  ListActions,
} from './';

export type RootActions =
  | ModalActions
  | RequestProcessActions
  | HistoryActions
  | SpecificDetailsActions
  | FormActions
  | ClearStateActions
  | UserServiceSocketActions
  | ListActions;
