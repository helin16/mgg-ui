import { iConfigParams } from '../../../services/AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';

export interface iDataState<T> {
  data: iPaginatedResult<T>;
  isLoading: boolean;
  // isConfirming: boolean;
}

export const getInitDataState = (currentPage: number, perPage: number)=> {
  return {
    data: { data: [], perPage, currentPage, from: 0, to: 0, pages: 0, total: 0 },
    isLoading: false,
  };
};

export interface iViewingState<T extends {}> {
  editingModel?: T | null;
  perPage?: number;
  sort?: string;
  filter?: iConfigParams;
  currentPage?: number;
  isModalOpen?: boolean;
  isSaving?: boolean;
  isShowingDeleting?: boolean;
  version: number;
}

export enum ActionKind {
  Loading = 'LOADING',
  Loaded = 'LOADED',
  Delete = 'DELETE',
  Confirming = 'CONFIRMING',
  Confirmed = 'CONFIRMED',
  Search = 'SEARCH',
  Reset = 'RESET',
  LoadMore = 'LOAD_MORE',
  Add = 'ADD',
  Update = 'UPDATE',
}

export type Action<T> = {
  type: ActionKind;
  payload: {
    data?: iPaginatedResult<T>;
    currentPage?: number;
    sort?: string;
    filter?: iConfigParams;

    targetId?: string;
    keyword?: string;
    item?: T;
  };
};

export const reducer = <T extends {}>(
  state: iDataState<T>,
  action: Action<T>,
): iDataState<T> => {
  switch (action.type) {
    case ActionKind.Loading:
      return { ...state, isLoading: true };
    case ActionKind.Loaded:
      return {
        ...state,
        isLoading: false,
        data: action.payload.data ? action.payload.data : state.data,
      };
    default:
      return state;
  }
};
