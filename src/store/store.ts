import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { RootActions } from './actions';
import {
  historyReducer,
  modalReducer,
  requsetProcessReducer,
  specificDetailsReducer,
  FormReducer,
  userServiceSocketReducer,
  listsReducer,
} from './reducers';

const reducers = combineReducers({
  modals: modalReducer,
  requestProcess: requsetProcessReducer,
  history: historyReducer,
  specificDetails: specificDetailsReducer,
  forms: FormReducer,
  userServiceSocket: userServiceSocketReducer,
  lists: listsReducer,
});

export const store = createStore(reducers, {}, applyMiddleware(thunk));

export type RootState = ReturnType<typeof reducers>;
export type RootDispatch = ThunkDispatch<RootState, any, RootActions>;
