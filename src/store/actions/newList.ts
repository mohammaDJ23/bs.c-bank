import { List } from '../../lib/lists/newList';
import { Lists } from '../reducers';

export interface ListConstructor {
  new (...args: any[]): List;
}

export interface UpdateListAction {
  type: Lists.UPDATE_LIST;
  payload: { instance: ListConstructor; list: any[] };
}

export interface UpdatePageAction {
  type: Lists.UPDATE_PAGE;
  payload: { instance: ListConstructor; page: number };
}

export interface UpdateTakeAction {
  type: Lists.UPDATE_TAKE;
  payload: { instance: ListConstructor; take: number };
}

export interface UpdateTotalAction {
  type: Lists.UPDATE_TOTAL;
  payload: { instance: ListConstructor; total: number };
}

export type ListActions = UpdateListAction | UpdatePageAction | UpdateTakeAction | UpdateTotalAction;

export function updateList(instance: ListConstructor, list: any[]): UpdateListAction {
  return {
    type: Lists.UPDATE_LIST,
    payload: { instance, list },
  };
}

export function updatePage(instance: ListConstructor, page: number): UpdatePageAction {
  return {
    type: Lists.UPDATE_PAGE,
    payload: { instance, page },
  };
}

export function updateTake(instance: ListConstructor, take: number): UpdateTakeAction {
  return {
    type: Lists.UPDATE_TAKE,
    payload: { instance, take },
  };
}

export function updateTotal(instance: ListConstructor, total: number): UpdateTotalAction {
  return {
    type: Lists.UPDATE_TOTAL,
    payload: { instance, total },
  };
}
