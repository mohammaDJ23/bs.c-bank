import {
  HistoryActions,
  ListContainerActions,
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
  | ListContainerActions
  | HistoryActions
  | SpecificDetailsActions
  | FormActions
  | ClearStateActions
  | UserServiceSocketActions
  | ListActions;
