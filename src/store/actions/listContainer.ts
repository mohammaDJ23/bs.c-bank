import { ListContainer } from '../reducers';

export interface SetListContainerElementAction {
  type: ListContainer.SET_LIST_CONTAINER_ELEMENT;
  payload: { element: HTMLDivElement };
}

export type ListContainerActions = SetListContainerElementAction;

export function setListContainerElement(element: HTMLDivElement): SetListContainerElementAction {
  return {
    type: ListContainer.SET_LIST_CONTAINER_ELEMENT,
    payload: { element },
  };
}
