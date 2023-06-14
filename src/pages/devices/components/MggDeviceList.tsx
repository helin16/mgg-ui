import useListCrudHook from '../../../components/hooks/useListCrudHook/useListCrudHook';
import {useCallback} from 'react';
import {iConfigParams} from '../../../services/AppService';
import MggAppDeviceService from '../../../services/Settings/MggAppDeviceService';
import PageLoadingSpinner from '../../../components/common/PageLoadingSpinner';
import Table, {iTableColumn} from '../../../components/common/Table';
import iMggAppDevice from '../../../types/Settings/iMggAppDevice';
import {Button} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import PopupModal from '../../../components/common/PopupModal';
import MggDeviceAddOrEditPanel from './MggDeviceAddOrEditPanel';
import DeleteConfirmPopupBtn from '../../../components/common/DeleteConfirm/DeleteConfirmPopupBtn';
import {FlexContainer} from '../../../styles';

const MggDeviceList = () => {
  const {
    state,
    edit,
    onOpenAddModal,
    onOpenEditModal,
    onCloseModal,
    onSubmit,
    onDelete,
    onRefreshList,
    onSetCurrentPage,
  } = useListCrudHook<iMggAppDevice>({
    paginationApplied: true,
    getFn: useCallback((config?: iConfigParams) => {
      const where = config ? JSON.parse(config?.where || '{}') : {};
      delete config?.where;
      return MggAppDeviceService.getAll({
        where: JSON.stringify({...where, isActive: true}),
        ...(config || {}),
      })
    }, []),
    createFn: MggAppDeviceService.create,
    updateFn: MggAppDeviceService.update,
    deleteFn: MggAppDeviceService.deactivate,
  });

  const getColumns = (): iTableColumn[] => [
    {
      key: 'device',
      header: (column: iTableColumn) => {
        return <th key={column.key}>
          <FlexContainer className={'justify-content space-between'}>
            <div>Device</div>
            <div>MAC</div>
          </FlexContainer>
        </th>
      },
      cell: (column: iTableColumn, row: iMggAppDevice) => {
        return <td key={column.key}>
          <FlexContainer className={'justify-content space-between'}>
            <Button variant={'link'} size={'sm'} onClick={() => onOpenEditModal(row.id)}>{row.name}</Button>
            <div>{row.macAddress}</div>
          </FlexContainer>
          <small>{row.description}</small>
        </td>
      }
    },
    {
      key: 'code',
      header: 'App Code',
      cell: (column: iTableColumn, row: iMggAppDevice) => {
        return <td key={column.key}>{row.code}</td>
      }
    },
    {
      key: 'make',
      header: 'Make',
      cell: (column: iTableColumn, row: iMggAppDevice) => {
        return <td key={column.key}>{row.make}</td>
      }
    },{
      key: 'model',
      header: 'Model',
      cell: (column: iTableColumn, row: iMggAppDevice) => {
        return <td key={column.key}>{row.model}</td>
      }
    },
    {
      key: 'location',
      header: 'Location',
      cell: (column: iTableColumn, row: iMggAppDevice) => {
        return <td key={column.key}>{row.location}</td>
      }
    },
    {
      key: 'operations',
      header: (column: iTableColumn) => <th className={'text-right'} key={column.key}><Button variant={'success'} size={'sm'} onClick={() => onOpenAddModal()}><Icons.Plus /> New</Button></th>,
      cell: (column: iTableColumn, row: iMggAppDevice) => {
        return <td className={'text-right'} key={column.key}>
          <DeleteConfirmPopupBtn
            variant={'danger'}
            deletingFn={() => onDelete(row.id)}
            deletedCallbackFn={() => onRefreshList()}
            size={'sm'}
            description={<>You are about to deregister this device: <b>{row.name} {row.macAddress}</b></>}
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
        show={edit.isModalOpen}
        handleClose={() => onCloseModal()}
        title={edit.target?.id ? `Updating a device: ${edit.target.name}`: `Registering a device`}
      >
        <MggDeviceAddOrEditPanel
          isSubmitting={state.isConfirming}
          mggAppDevice={edit.target}
          onCancel={() => onCloseModal()}
          onSave={(data) => onSubmit(data)}
        />
      </PopupModal>
    )
  }

  if (state.isLoading) {
    return <PageLoadingSpinner />
  }
  return (
    <div>
      <Table
        columns={getColumns()}
        rows={state.data}
        pagination={{
          totalPages: state.pages || 0,
          currentPage: state.currentPage || 1,
          onSetCurrentPage: (currentPage) => onSetCurrentPage(currentPage),
        }}
      />
      {getAddOrEditPopup()}
    </div>
  )
}

export default MggDeviceList;
