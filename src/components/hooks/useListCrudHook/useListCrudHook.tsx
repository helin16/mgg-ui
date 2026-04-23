import React, { useEffect, useReducer, useState } from "react";
import {
  reducer,
  iDataState,
  ActionKind,
  Action,
  getInitDataState,
  iViewingState
} from "./reducer";
import { iConfigParams } from "../../../services/AppService";
import iPaginatedResult from "../../../types/iPaginatedResult";
import Table, {
  iTable,
  iTableColumn,
  iTablePagination
} from "../../common/Table";
import Toaster from "../../../services/Toaster";
import MathHelper from "../../../helper/MathHelper";
import { AxiosRequestConfig } from "axios";

export type iGetFn = {
  filter?: iConfigParams;
  sort?: string;
  currentPage?: number;
  perPage?: number;
};

type iUseListCrudHook<T> = {
  getFn: (props?: iGetFn) => Promise<iPaginatedResult<T>>;
  deleteFn?: (
    model: T,
    params?: iConfigParams,
    config?: AxiosRequestConfig
  ) => Promise<any>;
  createFn?: (
    params: iConfigParams,
    config?: AxiosRequestConfig
  ) => Promise<any>;
  updateFn?: (
    model: any,
    params?: iConfigParams,
    config?: AxiosRequestConfig
  ) => Promise<any>;
  perPage?: number;
  sort?: string;
  showingPageSizer?: boolean;
  filter?: iConfigParams;
  loadOnInit?: boolean;
};

const useListCrudHook = <T extends {}>({
  getFn,
  deleteFn,
  perPage = 10,
  sort,
  filter,
  createFn,
  updateFn,
  showingPageSizer = false,
  loadOnInit = true
}: iUseListCrudHook<T>) => {
  const [state, dispatch] = useReducer<React.Reducer<iDataState<T>, Action<T>>>(
    reducer,
    getInitDataState(1, perPage)
  );
  const [viewingState, setViewingState] = useState<iViewingState<T>>({
    editingModel: null,
    isModalOpen: false,
    isShowingDeleting: false,
    isSaving: false,
    perPage,
    currentPage: 1,
    sort,
    filter,
    version: 1,
    loadOnInit,
  });

  useEffect(() => {
    if (!viewingState.loadOnInit) {
      return;
    }

    let isCanceled = false;
    dispatch({ type: ActionKind.Loading, payload: {} });

    getFn({
      filter: viewingState.filter || {},
      sort: `${viewingState.sort || ""}`.trim(),
      currentPage: viewingState.currentPage || 1,
      perPage: viewingState.perPage || 10
    })
      .then(res => {
        if (isCanceled) {
          return;
        }
        setViewingState(prev => ({
          ...prev,
          editingModel: null,
          isModalOpen: false,
          isShowingDeleting: false,
          isSaving: false
        }));
        dispatch({ type: ActionKind.Loaded, payload: { data: res } });
      })
      .catch(err => {
        Toaster.showApiError(err);
        dispatch({ type: ActionKind.Loaded, payload: {} });
      });

    return () => {
      isCanceled = true;
    };
  }, [
    getFn,
    viewingState.loadOnInit,
    viewingState.sort,
    viewingState.filter,
    viewingState.currentPage,
    viewingState.perPage,
    viewingState.version
  ]);

  const getData = (rows?: T[]) => {
    const dataRows = rows || state.data || {};
    return Array.isArray(dataRows)
      ? dataRows
      : "data" in dataRows
      ? // @ts-ignore
        dataRows.data
      : [];
  };

  const onSetSort = (sortStr: string) => {
    setViewingState(prevState => ({ ...prevState, sort: sortStr }));
  };

  const onRefresh = (extra = {}) => {
    setViewingState(prevState => ({
      ...prevState,
      currentPage: 1,
      ...extra,
      version: MathHelper.add(prevState.version, 1)
    }));
  };

  const onRefreshOnCurrentPage = (extra = {}) => {
    setViewingState(prevState => ({
      ...prevState,
      ...extra,
      version: MathHelper.add(prevState.version, 1)
    }));
  };

  const onRefreshWhenCreated = (extra = {}) => {
    onRefresh(extra);
  };

  const onSetPage = (page: number) => {
    setViewingState(prevState => ({
      ...prevState,
      currentPage: page,
      version: MathHelper.add(prevState.version, 1)
    }));
  };

  const onSetPageSize = (pageSize: number) => {
    setViewingState(prevState => ({
      ...prevState,
      currentPage: 1,
      perPage: pageSize,
      version: MathHelper.add(prevState.version, 1)
    }));
  };

  const getSort = (index: number = 0) => {
    const sorts = `${viewingState.sort || ""}`.split(",").map(orderEle => {
      const [sortKey, sortOrder = "ASC"] = orderEle.split(":");
      return [sortKey, sortOrder];
    });
    return sorts.length > index ? sorts[index] : [];
  };

  type iRenderDataTable = iTable<T> & {
    columns: iTableColumn<T>[];
    rows?: T[];
    pagination?: iTablePagination;
  };

  const renderDataTable = ({
    columns,
    rows,
    pagination,
    ...props
  }: iRenderDataTable) => {
    return (
      <Table<T>
        isLoading={state.isLoading}
        columns={columns}
        rows={getData(rows)}
        pagination={{
          currentPage: state.data.currentPage,
          totalPages: state.data.pages || 0,
          onSetCurrentPage: newPage => onSetPage(newPage),
          ...pagination,
          onPageSizeChanged:
            showingPageSizer === true
              ? newPageSize => onSetPageSize(newPageSize)
              : undefined
        }}
        {...props}
      />
    );
  };

  const onOpenEditModal = (model: T) => {
    setViewingState(prevState => ({
      ...prevState,
      editingModel: model,
      isModalOpen: true,
      isShowingDeleting: false
    }));
  };

  const onOpenAddModal = () => {
    setViewingState(prevState => ({
      ...prevState,
      editingModel: null,
      isModalOpen: true,
      isShowingDeleting: false
    }));
  };

  const onCloseModal = () => {
    setViewingState(prevState => ({
      ...prevState,
      editingModel: null,
      isModalOpen: false,
      isShowingDeleting: false
    }));
  };

  const onOpenDeleteModal = (model: T) => {
    setViewingState(prevState => ({
      ...prevState,
      editingModel: model,
      isModalOpen: true,
      isShowingDeleting: true
    }));
  };

  const onDelete = async (
    model: T,
    params?: iConfigParams,
    config?: AxiosRequestConfig
  ) => {
    if (!deleteFn) {
      return null;
    }
    return deleteFn(model, params, config);
  };

  const onSubmit = (data: any, config?: AxiosRequestConfig) => {
    setViewingState({
      ...viewingState,
      isSaving: true
    });
    const func = viewingState.editingModel
      ? updateFn && updateFn(viewingState.editingModel, data, config)
      : createFn && createFn(data, config);

    if (!func) {
      return func;
    }

    return func.finally(() => {
      setViewingState({
        ...viewingState,
        isSaving: false
      });
    });
  };

  const onSearch = (moreFilter: iConfigParams = {}) => {
    setViewingState(prevState => ({
      ...prevState,
      filter: {
        ...filter,
        ...moreFilter,
      },
      loadOnInit: true,
      version: MathHelper.add(prevState.version, 1)
    }));
  };

  return {
    state,
    viewingState,
    getSort,
    onSetSort,
    onSetPage,
    onSetPageSize,
    onRefresh,
    renderDataTable,
    onRefreshWhenCreated,
    onRefreshOnCurrentPage,
    onOpenEditModal,
    onOpenAddModal,
    onDelete,
    onCloseModal,
    onSubmit,
    onOpenDeleteModal,
    onSearch,
  };
};
export default useListCrudHook;
