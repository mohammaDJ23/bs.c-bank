import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { RootActions } from '../store/actions';

export function useDisp() {
  return useDispatch() as Dispatch<RootActions>;
}
