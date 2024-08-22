import { newLists, copyConstructor } from '../../lib';
import { List } from '../../lib/lists/newList';
import { RootActions, UpdateListAction, UpdatePageAction, UpdateTakeAction, UpdateTotalAction } from '../actions';
import { ClearState } from './clearState';

export enum Lists {
  UPDATE_LIST = 'UPDATE_LIST',
  UPDATE_TAKE = 'UPDATE_TAKE',
  UPDATE_PAGE = 'UPDATE_PAGE',
  UPDATE_TOTAL = 'UPDATE_TOTAL',
}

interface ListsState {
  [key: string]: List;
}

function makeLists() {
  let state: ListsState = {};
  for (let list in newLists) state[list] = new newLists[list as keyof typeof newLists]();
  return state;
}

export const initialState: ListsState = makeLists();

function updateList(state: ListsState, action: UpdateListAction): ListsState {
  const newState = Object.assign({}, state);
  const newList = copyConstructor(state[action.payload.instance.name]);
  newState[action.payload.instance.name] = newList;
  newState[action.payload.instance.name].list = action.payload.list;
  return newState;
}

function updatePage(state: ListsState, action: UpdatePageAction): ListsState {
  const newState = Object.assign({}, state);
  const newList = copyConstructor(state[action.payload.instance.name]);
  newState[action.payload.instance.name] = newList;
  newState[action.payload.instance.name].page = action.payload.page;
  return newState;
}

function updateTake(state: ListsState, action: UpdateTakeAction): ListsState {
  const newState = Object.assign({}, state);
  const newList = copyConstructor(state[action.payload.instance.name]);
  newState[action.payload.instance.name] = newList;
  newState[action.payload.instance.name].take = action.payload.take;
  return newState;
}

function updateTotal(state: ListsState, action: UpdateTotalAction): ListsState {
  const newState = Object.assign({}, state);
  const newList = copyConstructor(state[action.payload.instance.name]);
  newState[action.payload.instance.name] = newList;
  newState[action.payload.instance.name].total = action.payload.total;
  return newState;
}

function clearState(): ListsState {
  return makeLists();
}

export function listsReducer(state: ListsState = initialState, actions: RootActions) {
  switch (actions.type) {
    case Lists.UPDATE_LIST:
      return updateList(state, actions);

    case Lists.UPDATE_PAGE:
      return updatePage(state, actions);

    case Lists.UPDATE_TAKE:
      return updateTake(state, actions);

    case Lists.UPDATE_TOTAL:
      return updateTotal(state, actions);

    case ClearState.CLEAR_STATE:
      return clearState();

    default:
      return state;
  }
}
