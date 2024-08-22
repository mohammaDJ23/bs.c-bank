import {
  HistoryActions,
  ListContainerActions,
  ModalActions,
  SpecificDetailsActions,
  PaginationListActions,
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
  | PaginationListActions
  | FormActions
  | ClearStateActions
  | UserServiceSocketActions
  | ListActions;
