import useListCrudHook from '../../../components/hooks/useListCrudHook/useListCrudHook';
import MggAppDeviceService from '../../../services/Settings/MggAppDeviceService';
import PageLoadingSpinner from '../../../components/common/PageLoadingSpinner';
import {iTableColumn} from '../../../components/common/Table';
import iMggAppDevice from '../../../types/Settings/iMggAppDevice';
import {Button} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import PopupModal from '../../../components/common/PopupModal';
import MggDeviceAddOrEditPanel from './MggDeviceAddOrEditPanel';
import DeleteConfirmPopupBtn from '../../../components/common/DeleteConfirm/DeleteConfirmPopupBtn';
import {FlexContainer} from '../../../styles';
import moment from 'moment-timezone';
import {useCallback} from 'react';

const MggDeviceList = () => {
  const {
    state,
    onOpenEditModal,
    onOpenAddModal,
    onRefresh,
    onDelete,
    viewingState,
    onCloseModal,
    renderDataTable,
    onRefreshWhenCreated,
    onRefreshOnCurrentPage,
    onSubmit,
  } = useListCrudHook<iMggAppDevice>({
    getFn: useCallback((config) => {
      const {filter, ...props} = (config || {});

      return MggAppDeviceService.getAll({
        where: JSON.stringify({...filter, isActive: true}),
        include: ['CreatedBy', 'UpdatedBy', 'MggApp'].join(','),
        ...props,
      })
    }, []),
    deleteFn: (model) => MggAppDeviceService.deactivate(model.id),
    createFn: (params) => MggAppDeviceService.create(params),
    updateFn: (model, params) => MggAppDeviceService.update(model.id, params || {}),
  });

  const getColumns = <T extends {}>(): iTableColumn<T>[] => [
    {
      key: 'device',
      header: (column: iTableColumn<T>) => {
        return <th key={column.key}>
          <FlexContainer className={'justify-content space-between'}>
            <div>Device</div>
            <div>DeviceID</div>
          </FlexContainer>
        </th>
      },
      cell: (column: iTableColumn<T>, row: iMggAppDevice) => {
        return <td key={column.key}>
          <FlexContainer className={'justify-content space-between'}>
            <Button variant={'link'} size={'sm'} onClick={() => onOpenEditModal(row)}>{row.name}</Button>
            <div>{row.deviceId}</div>
          </FlexContainer>
          <small>{row.description}</small>
        </td>
      }
    },
    {
      key: 'code',
      header: 'App Code',
      cell: (column: iTableColumn<T>, row: iMggAppDevice) => {
        return <td key={column.key}>{row.code}</td>
      }
    },
    {
      key: 'make',
      header: 'Make',
      cell: (column: iTableColumn<T>, row: iMggAppDevice) => {
        return <td key={column.key}>{row.make}</td>
      }
    },{
      key: 'model',
      header: 'Model',
      cell: (column: iTableColumn<T>, row: iMggAppDevice) => {
        return <td key={column.key}>{row.model}</td>
      }
    },
    {
      key: 'location',
      header: 'Location',
      cell: (column: iTableColumn<T>, row: iMggAppDevice) => {
        return <td key={column.key}>{row.location}</td>
      }
    },
    {
      key: 'created',
      header: 'Created',
      cell: (column: iTableColumn<T>, row: iMggAppDevice) => {
        return <td key={column.key}>
          <div><b>By:</b> {row.CreatedBy?.firstName} {row.CreatedBy?.lastName}</div>
          <div><b>@:</b> {moment(row.createdAt).format('lll')}</div>
        </td>
      }
    },
    {
      key: 'updated',
      header: 'Updated',
      cell: (column: iTableColumn<T>, row: iMggAppDevice) => {
        return <td key={column.key}>
          <div><b>By:</b> {row.UpdatedBy?.firstName} {row.UpdatedBy?.lastName}</div>
          <div><b>@:</b> {moment(row.updatedAt).format('lll')}</div>
        </td>
      }
    },
    {
      key: 'operations',
      header: (column: iTableColumn<T>) => <th className={'text-right'} key={column.key}><Button variant={'success'} size={'sm'} onClick={() => onOpenAddModal()}><Icons.Plus /> New</Button></th>,
      cell: (column: iTableColumn<T>, row: iMggAppDevice) => {
        return <td className={'text-right'} key={column.key}>
          <DeleteConfirmPopupBtn
            variant={'danger'}
            deletingFn={() => onDelete(row)}
            deletedCallbackFn={() => onRefresh()}
            size={'sm'}
            description={<>You are about to deregister this device: <b>{row.name} {row.deviceId}</b></>}
            confirmString={`${row.code}`}
          >
            <Icons.Trash />
          </DeleteConfirmPopupBtn>
        </td>
      }
    },
  ];

  const getAddOrEditPopup = () => {
    return (
      <PopupModal
        dialogClassName={'modal-80w'}
        show={viewingState.isModalOpen}
        handleClose={() => onCloseModal()}
        title={`${viewingState.editingModel?.id || ''}`.trim() !== '' ? `Updating a device: ${viewingState.editingModel?.name}`: `Registering a device`}
      >
        <MggDeviceAddOrEditPanel
          isSubmitting={viewingState.isSaving}
          mggAppDevice={viewingState.editingModel || undefined}
          onCancel={() => onCloseModal()}
          onSave={(data) => onSubmit(data)?.then(res => {
            if (viewingState.editingModel) {
              onRefreshOnCurrentPage();
            } else {
              onRefreshWhenCreated();
            }
            return res;
          })}
        />
      </PopupModal>
    )
  }

  if (state.isLoading) {
    return <PageLoadingSpinner />
  }
  return (
    <div>
      {renderDataTable({
        columns: getColumns<iMggAppDevice>(),
        hover: true,
        responsive: true,
      })}
      {getAddOrEditPopup()}
    </div>
  )
}

export default MggDeviceList;
