import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { RootActions } from './actions';
import {
  historyReducer,
  listContainerReducer,
  modalReducer,
  requsetProcessReducer,
  specificDetailsReducer,
  paginationListReducer,
  FormReducer,
  userServiceSocketReducer,
} from './reducers';

const reducers = combineReducers({
  modals: modalReducer,
  requestProcess: requsetProcessReducer,
  listContainer: listContainerReducer,
  history: historyReducer,
  specificDetails: specificDetailsReducer,
  paginationList: paginationListReducer,
  forms: FormReducer,
  userServiceSocket: userServiceSocketReducer,
});

export const store = createStore(reducers, {}, applyMiddleware(thunk));

export type RootState = ReturnType<typeof reducers>;
export type RootDispatch = ThunkDispatch<RootState, any, RootActions>;
