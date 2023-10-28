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
  | UserServiceSocketActions;
