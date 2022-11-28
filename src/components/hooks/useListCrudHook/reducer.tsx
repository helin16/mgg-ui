export interface iState<T> {
  data: Array<T>;
  isLoading: boolean;
  isConfirming: boolean;
  from?: number;
  to?: number;
  currentPage?: number;
  perPage?: number;
  total?: number;
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
    data?: Array<T>;
    from?: number;
    to?: number;
    currentPage?: number;
    perPage?: number;
    total?: number;
    targetId?: string | number;
    keyword?: string;
    item?: T;
  };
};

export const reducer = <T extends { id: string | number }>(
  state: iState<T>,
  action: Action<T>,
): iState<T> => {
  switch (action.type) {
    case ActionKind.Loading:
      return { ...state, isLoading: true };
    case ActionKind.Confirming:
      return { ...state, isConfirming: true };
    case ActionKind.Confirmed:
      return { ...state, isConfirming: false };
    case ActionKind.Loaded:
      return {
        ...state,
        isLoading: false,
        data: action.payload.data ? action.payload.data : state.data,
        from: action.payload.from,
        to: action.payload.to,
        currentPage: action.payload.currentPage,
        perPage: action.payload.perPage,
        total: action.payload.total,
      };
    case ActionKind.LoadMore:
      return {
        ...state,
        isLoading: false,
        data: action.payload.data
          ? [...state.data, ...action.payload.data]
          : state.data,
        from: action.payload.from,
        to: action.payload.to,
        currentPage: action.payload.currentPage,
        perPage: action.payload.perPage,
        total: action.payload.total,
      };
    case ActionKind.Delete:
      return {
        ...state,
        isLoading: false,
        isConfirming: false,
        data: action.payload.targetId
          ? state.data.filter((d: T) => d.id !== action.payload.targetId)
          : state.data,
      };
    case ActionKind.Reset:
      return {
        ...state,
        data: action.payload.data ? action.payload.data : state.data,
        isLoading: false,
        isConfirming: false,
      };
    //  new added put first
    case ActionKind.Add:
      return {
        ...state,
        data: action.payload.item
          ? [action.payload.item, ...state.data]
          : state.data,
        isLoading: false,
        isConfirming: false,
      };
    // updated keeps sequence
    case ActionKind.Update:
      return {
        ...state,
        data: action.payload.item
          ? state.data.map((item: T) =>
              item.id === action.payload.item?.id ? action.payload.item : item,
            )
          : state.data,
        isLoading: false,
        isConfirming: false,
      };
    default:
      return state;
  }
};
