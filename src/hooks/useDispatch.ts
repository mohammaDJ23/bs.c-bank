import * as redux from 'react-redux';
import { RootDispatch } from '../store';

export function useDispatch() {
  return redux.useDispatch<RootDispatch>();
}
