import { MostActiveReceiversApi, Request } from '../../apis';
import { MostActiveReceiverObj } from '../../lib';
import { RootDispatch } from '../store';
import { initialProcessingApiError, initialProcessingApiLoading, initialProcessingApiSuccess } from './requestProcess';
import { setSpecificDetails } from './speceficDetails';

export * from './modal';
export * from './requestProcess';
export * from './root-actions';
export * from './listContainer';
export * from './history';
export * from './speceficDetails';
export * from './paginationList';
export * from './form';
export * from './clearState';
export * from './userSocket';

export function getMostActiveReceivers() {
  return async function (dispatch: RootDispatch) {
    try {
      dispatch(initialProcessingApiLoading(MostActiveReceiversApi.name));
      const response = await new Request<MostActiveReceiverObj[]>(new MostActiveReceiversApi()).build();
      dispatch(setSpecificDetails('mostActiveReceivers', response.data));
      dispatch(initialProcessingApiSuccess(MostActiveReceiversApi.name));
    } catch (error) {
      dispatch(initialProcessingApiError(MostActiveReceiversApi.name));
    }
  };
}
