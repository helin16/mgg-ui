import React, {useCallback} from 'react';
import styled from 'styled-components';
import {Button, Spinner, Table} from 'react-bootstrap';
import HouseAwardEventTypeService from '../../../services/HouseAwards/HouseAwardEventTypeService';
import iHouseAwardEventType from '../../../types/HouseAwards/iHouseAwardEventType';
import moment from 'moment-timezone';
import useListCrudHook from '../../../components/hooks/useListCrudHook/useListCrudHook';
import HouseAwardEventTypeAddOrEditPopup from './HouseAwardEventTypeAddOrEditPopup';
import {FlexContainer} from '../../../styles';
import * as Icons from 'react-bootstrap-icons'
import DeleteConfirmPopup from '../../../components/common/DeleteConfirm/DeleteConfirmPopup';
import {iConfigParams} from '../../../services/AppService';

const Wrapper = styled.div``;
type iHouseAwardEventTypeTable = {
}
const HouseAwardEventTypeTable = (props: iHouseAwardEventTypeTable) => {
  const {
    state,
    edit,
    onOpenAddModal,
    onOpenEditModal,
    onCloseModal,
    onOpenDeleteModal,
    onSubmit,
    onDelete,
  } = useListCrudHook<iHouseAwardEventType>({
    getFn: useCallback((config?: iConfigParams) => {
      const where = config ? JSON.parse(config?.where || '{}') : {};
      return HouseAwardEventTypeService.getEventTypes({
        where: JSON.stringify({...where, active: true})
      })
    }, []),
    createFn: HouseAwardEventTypeService.createEventType,
    updateFn: HouseAwardEventTypeService.updateEventType,
    deleteFn: HouseAwardEventTypeService.deleteEventType,
  });


  const getPopup = () => {
    if (edit.target) {
      if (!edit.delTargetId) {
        return (
          <HouseAwardEventTypeAddOrEditPopup
            eventType={edit.target}
            isShowing={edit.isModalOpen}
            handleClose={onCloseModal}
            onSubmit={onSubmit}
            isSubmitting={state.isConfirming}
          />
        )
      }

      return (
        <DeleteConfirmPopup
          confirmString={`${edit.target.name}`}
          isOpen={edit.isModalOpen}
          onClose={onCloseModal}
          onConfirm={() => onDelete(edit.delTargetId || 0)}
        />
      )
    }
    return (
      <HouseAwardEventTypeAddOrEditPopup
        isShowing={edit.isModalOpen}
        handleClose={onCloseModal}
        onSubmit={onSubmit}
        isSubmitting={state.isConfirming}
      />
    );
  }


  if (state.isLoading) {
    return <Spinner animation={'border'} />
  }

  return (
    <Wrapper>
      <FlexContainer className={'withGap'}>
        <h5>Event Types</h5>
        <Button variant={'info'} size={'sm'}onClick={() => onOpenAddModal()}><Icons.Plus /></Button>
      </FlexContainer>
      <Table striped hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Points to be awarded</th>
            <th>Comments</th>
            <th>Created</th>
            <th>Updated</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {state.data.map(eventType => {
            return (
              <tr key={eventType.id}>
                <td><Button variant={'link'} size={'sm'} onClick={() => onOpenEditModal(eventType.id)}>{eventType.name}</Button></td>
                <td>{eventType.points_to_be_awarded}</td>
                <td>{eventType.comments}</td>
                <td>{moment(eventType.created_at).format('lll')}</td>
                <td>{moment(eventType.updated_at).format('lll')}</td>
                <td className={'text-right'}>
                  <Button variant={'danger'} size={'sm'} onClick={() => onOpenDeleteModal(eventType.id)}>
                    <Icons.Trash />
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
      {getPopup()}
    </Wrapper>
  )
}

export default HouseAwardEventTypeTable
