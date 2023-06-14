import React, { useState, useEffect, useReducer } from 'react';
import { reducer, ActionKind, iState, Action } from './reducer';
import Toaster, {TOAST_TYPE_SUCCESS} from '../../../services/Toaster';

type iEditState<T> = {
  isModalOpen: boolean;
  version: number;
  target?: T;
  keyword?: string;
  perPage: number;
  currentPage: number;
  sort?: string;
  filter?: string;
  advancedFilter?: string;
  jsonFilter?: string;
  delTargetId?: string | number;
};
type iProps = {
  //  eslint-disable-next-line
  createFn?: (content: any) => any;
  //  eslint-disable-next-line
  updateFn?: (id: string | number , content: any) => any;
  deleteFn?: (id: string | number ) => void;
  //  eslint-disable-next-line
  getFn: (config?: { [key: string]: string }) => any;
  keywordColumns?: string;
  perPage?: number;
  loadMoreApplied?: boolean;
  paginationApplied?: boolean;
  forceRefreshAfterSave?: boolean;
  sort?: string;
  filter?: string;
  advancedFilter?: string;
  jsonFilter?: string;
  notRenderWithoutFilter?: boolean;
  createCallBack?: (id: string) => void;
  editCallBack?: (id: string) => void;
};
const useListCrudHook = <T extends { id: string | number }>({
  createFn,
  deleteFn,
  updateFn,
  getFn,
  keywordColumns,
  perPage = 10,
  paginationApplied = false,
  loadMoreApplied = false,
  sort,
  filter,
  advancedFilter,
  jsonFilter,
  notRenderWithoutFilter = false,
  forceRefreshAfterSave = false,
  createCallBack,
  editCallBack,
}: iProps) => {
  const initialState: iState<T> = {
    data: [],
    isLoading: false,
    isConfirming: false,
  };
  const initialEditState: iEditState<T> = {
    isModalOpen: false,
    version: 0,
    perPage,
    currentPage: 1,
    sort,
    filter,
    advancedFilter,
    jsonFilter,
  };
  const [state, dispatch] = useReducer<React.Reducer<iState<T>, Action<T>>>(reducer, initialState);
  const [edit, setEdit] = useState(initialEditState);

  useEffect(() => {
    let isCancelled = false;
    //  interface for configs
    const getConfig = () => {
      let likeConfig;
      let paginationConfig;
      let sortConfig;
      let filterConfig;
      let advancedFilterConfig;
      let jsonFilterConfig;
      if (edit.sort) {
        sortConfig = { sort: edit.sort };
      }
      if (paginationApplied || loadMoreApplied) {
        paginationConfig = {
          perPage: edit.perPage.toString(),
          currentPage: edit.currentPage.toString(),
        };
      }
      if (
        typeof edit.keyword !== 'undefined' &&
        edit.keyword !== '' &&
        typeof keywordColumns !== 'undefined' &&
        keywordColumns.trim() !== ''
      ) {
        const columns = keywordColumns.split(',');
        likeConfig = {
          like: columns
            .filter((column: string) => column)
            ?.map((column: string) => `${column}:${edit.keyword}`)
            .join(','),
        };
      }
      if (edit.filter) {
        filterConfig = { filter: edit.filter };
      }
      if (edit.advancedFilter) {
        advancedFilterConfig = { advancedFilter: edit.advancedFilter };
        filterConfig = undefined;
      }
      if (edit.jsonFilter) {
        jsonFilterConfig = { jsonFilter: edit.jsonFilter };
        filterConfig = undefined;
        advancedFilterConfig = undefined;
      }
      return {
        ...paginationConfig,
        ...likeConfig,
        ...sortConfig,
        ...filterConfig,
        ...advancedFilterConfig,
        ...jsonFilterConfig,
      };
    };
    const fetchData = async () => {
      if (
        typeof edit.filter === 'undefined' &&
        typeof edit.advancedFilter === 'undefined' &&
        typeof edit.jsonFilter === 'undefined' &&
        notRenderWithoutFilter
      ) {
        return;
      }
      dispatch({ type: ActionKind.Loading, payload: {} });
      try {
        //  eslint-disable-next-line
        const fetchResult: any = await getFn(getConfig());
        if (isCancelled) return;
        // if overpaged, roll back to page 1
        if ((paginationApplied || loadMoreApplied) && fetchResult.data.length === 0 && fetchResult.total !== 0) {
          setEdit({ ...edit, currentPage: 1 });
        }

        //  load more is to append resolved result to original list
        //  general pagination is to replace original list by resolved result
        dispatch({
          type: loadMoreApplied ? ActionKind.LoadMore : ActionKind.Loaded,
          payload:
            paginationApplied || loadMoreApplied
              ? {
                  data: fetchResult.data,
                  from: fetchResult.from,
                  to: fetchResult.to,
                  total: fetchResult.total,
                  currentPage: fetchResult.currentPage,
                  perPage: fetchResult.perPage,
                  pages: fetchResult.pages,
                }
              : { data: fetchResult },
        });
      } catch (error) {
        if (isCancelled) return;
        Toaster.showApiError(error);
        dispatch({
          type: ActionKind.Reset,
          payload: {},
        });
      }
    };
    fetchData();
    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    edit.version,
    edit.keyword,
    edit.perPage,
    edit.currentPage,
    edit.sort,
    edit.filter,
    edit.advancedFilter,
    paginationApplied,
    loadMoreApplied,
    getFn,
    keywordColumns,
    notRenderWithoutFilter,
  ]);

  const onRefresh = () => {
    setEdit({ ...edit, version: edit.version + 1 });
  };

  // eslint-disable-next-line
  const onSubmit = async (data: any) => {
    dispatch({ type: ActionKind.Confirming, payload: {} });
    try {
      if (typeof updateFn !== 'function') return;
      if (typeof createFn !== 'function') return;
      const result = edit.target ? await updateFn(edit.target.id, data) : await createFn(data);
      if (!edit.target && typeof createCallBack === 'function') {
        createCallBack(result.id);
        return;
      }
      Toaster.showToast('Saved Successfully', TOAST_TYPE_SUCCESS);
      // eslint-disable-next-line
      const eagerLoadResult: any = await getFn({ where: JSON.stringify({ id: result.id }) });
      dispatch({
        type: edit.target ? ActionKind.Update : ActionKind.Add,
        payload: {
          item: Array.isArray(eagerLoadResult) ? eagerLoadResult[0] : eagerLoadResult.data[0],
        },
      });
      setEdit({
        ...edit,
        target: undefined,
        isModalOpen: false,
        ...(forceRefreshAfterSave === true ? {version: edit.version + 1} : {})
      });
    } catch (error) {
      dispatch({ type: ActionKind.Confirmed, payload: {} });
      Toaster.showApiError(error);
    }
  };

  // eslint-disable-next-line
  const onCreate = async (data: any) => {
    dispatch({ type: ActionKind.Confirming, payload: {} });
    try {
      if (typeof createFn !== 'function') return;
      const result = await createFn(data);
      // eslint-disable-next-line
      const eagerLoadResult: any = await getFn({ where: JSON.stringify({ id: result.id }) });
      dispatch({
        type: ActionKind.Add,
        payload: {
          item: Array.isArray(eagerLoadResult) ? eagerLoadResult[0] : eagerLoadResult.data[0],
        },
      });
      setEdit({
        ...edit,
        target: undefined,
        isModalOpen: false,
        ...(forceRefreshAfterSave === true ? {version: edit.version + 1} : {})
      });
      if (typeof createCallBack === 'function') {
        createCallBack(result.id);
      }
    } catch (error) {
      dispatch({ type: ActionKind.Confirmed, payload: {} });
      Toaster.showApiError(error);
    }
  };
  // eslint-disable-next-line
  const onEdit = async (targetId: string | number, data: any) => {
    dispatch({ type: ActionKind.Confirming, payload: {} });
    try {
      if (typeof updateFn !== 'function') return;
      const result = await updateFn(targetId, data);
      // eslint-disable-next-line
      const eagerLoadResult: any = await getFn({ where: JSON.stringify({ id: result.id }) });
      dispatch({
        type: ActionKind.Update,
        payload: {
          item: Array.isArray(eagerLoadResult) ? eagerLoadResult[0] : eagerLoadResult.data[0],
        },
      });
      setEdit({
        ...edit,
        target: undefined,
        isModalOpen: false,
        ...(forceRefreshAfterSave === true ? {version: edit.version + 1} : {})
      });
      if (typeof editCallBack === 'function') {
        editCallBack(result.id);
        return;
      }
    } catch (error) {
      dispatch({ type: ActionKind.Confirmed, payload: {} });
      Toaster.showApiError(error);
    }
  };
  const onDelete = async (deleteTargetId: string | number) => {
    try {
      if (typeof deleteFn !== 'function') return;
      dispatch({ type: ActionKind.Confirming, payload: {} });
      await deleteFn(deleteTargetId);
      dispatch({
        type: ActionKind.Delete,
        payload: { targetId: deleteTargetId },
      });
      setEdit({
        ...edit,
        target: undefined,
        delTargetId: undefined,
        isModalOpen: false,
      });
    } catch (error) {
      Toaster.showApiError(error);
      dispatch({ type: ActionKind.Confirmed, payload: {} });
    }
  };

  const onReorder = async (reorderedArr: any[]) => {
    if (typeof updateFn !== 'function') return;
    try {
      dispatch({ type: ActionKind.Confirming, payload: {} });
      const promises: (() => void)[] = [];
      reorderedArr.forEach((cur, index) => {
        promises.push(updateFn(cur.id, { sortOrder: index }));
      });
      Promise.all(promises).then(() => {
        Toaster.showToast('', 'success');
        onRefresh();
        dispatch({ type: ActionKind.Confirmed, payload: {} });
      });
    } catch (e) {
      Toaster.showApiError(e);
      dispatch({ type: ActionKind.Confirmed, payload: {} });
    }
  };

  const onOpenAddModal = () =>
    setEdit({
      ...edit,
      isModalOpen: true,
      target: undefined,
      delTargetId: undefined,
    });
  const onOpenEditModal = (targetId: string | number) => {
    const target = state.data.find((u: T) => u.id === targetId);
    setEdit(prevState => ({
      ...prevState,
      isModalOpen: true,
      target,
      delTargetId: undefined,
    }));
  };
  const onOpenDeleteModal = (targetId: string | number) => {
    const target = state.data.find((u: T) => u.id === targetId);
    setEdit({
      ...edit,
      isModalOpen: true,
      delTargetId: targetId,
      target,
    });
  };
  const onCloseModal = () =>
    setEdit({
      ...edit,
      isModalOpen: false,
      target: undefined,
      delTargetId: undefined,
    });

  const onSearch = (keyword: string) =>
    setEdit({
      ...edit,
      keyword,
      currentPage: 1,
    });
  const onFilter = (value: string) => {
    setEdit({
      ...edit,
      filter: value,
    });
  };
  const onAdvancedFilter = (value: string) => {
    setEdit({
      ...edit,
      advancedFilter: value,
    });
  };
  const onSetCurrentPage = (page: number) => setEdit({ ...edit, currentPage: page });
  const onSetSort = (sortStr: string) => setEdit({ ...edit, currentPage: 1, sort: sortStr });
  const onRefreshList = () => {
    setEdit({ ...edit, currentPage: 1, version: edit.version + 1 });
  };
  return {
    state,
    edit,
    onSubmit,
    onCloseModal,
    onDelete,
    onOpenEditModal,
    onOpenAddModal,
    onSearch,
    onSetCurrentPage,
    onSetSort,
    onFilter,
    onAdvancedFilter,
    onOpenDeleteModal,
    onRefresh,
    onRefreshList,
    onReorder,
    onEdit,
    onCreate,
  };
};

export type iListCrudHookResult<T> = {
  state: iState<T>;
  edit: iEditState<T>;
  //  eslint-disable-next-line
  onSubmit: (data: any) => Promise<void>;
  onCloseModal: () => void;
  onOpenEditModal: (targetId: string) => void;
  onOpenAddModal: () => void;
  onSearch: (keyword: string) => void;
  onSetCurrentPage: (page: number) => void;
  onSetSort: (sortStr: string) => void;
  onFilter: (value: string) => void;
  onAdvancedFilter: (value: string) => void;
  onOpenDeleteModal: (targetId: string) => void;
  onRefresh: () => void;
  onRefreshList: () => void;
  //  eslint-disable-next-line
  onReorder: (reorderedArr: any[]) => Promise<void>;
  //  eslint-disable-next-line
  onEdit: (targetId: string, data: any) => Promise<void>;
  //  eslint-disable-next-line
  onCreate: (data: any) => Promise<void>;
  onDelete: (deleteTargetId: string) => Promise<void>;
};
export default useListCrudHook;
