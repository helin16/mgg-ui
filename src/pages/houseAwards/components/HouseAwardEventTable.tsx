import React, {useCallback} from 'react';
import iHouseAwardEvent from '../../../types/HouseAwards/iHouseAwardEvent';
import HouseAwardEventService from '../../../services/HouseAwards/HouseAwardEventService';
import styled from 'styled-components';
import {Button, Spinner, Table} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import moment from 'moment-timezone';
import {FlexContainer} from '../../../styles';
import useListCrudHook from '../../../components/hooks/useListCrudHook/useListCrudHook';
import {iConfigParams} from '../../../services/AppService';
import DeleteConfirmPopup from '../../../components/common/DeleteConfirm/DeleteConfirmPopup';
import HouseAwardEventAddOrEditPopup from './HouseAwardEventAddOrEditPopup';

const Wrapper = styled.div``;
const HouseAwardEventTable = () => {

  const {
    state,
    edit,
    onOpenAddModal,
    onOpenEditModal,
    onCloseModal,
    onOpenDeleteModal,
    onSubmit,
    onDelete,
  } = useListCrudHook<iHouseAwardEvent>({
    getFn: useCallback((config?: iConfigParams) => {
      const where = config ? JSON.parse(config?.where || '{}') : {};
      return HouseAwardEventService.getEvents({
        where: JSON.stringify({...where, active: true})
      })
    }, []),
    createFn: HouseAwardEventService.createEvent,
    updateFn: HouseAwardEventService.updateEvent,
    deleteFn: HouseAwardEventService.deleteEvent,
  });

  const getPopup = () => {
    if (edit.target) {
      if (!edit.delTargetId) {
        return (
          <HouseAwardEventAddOrEditPopup
            event={edit.target}
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
      <HouseAwardEventAddOrEditPopup
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
        <h5>Events</h5>
        <Button variant={'info'} size={'sm'}onClick={() => onOpenAddModal()}><Icons.Plus /></Button>
      </FlexContainer>
      <Table striped hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Created</th>
            <th>Update</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {state.data.map(event => {
            return (
              <tr key={event.id}>
                <td><Button variant={'link'} size={'sm'} onClick={() => onOpenEditModal(event.id)}>{event.name}</Button></td>
                <td>{event.description}</td>
                <td>{moment(event.created_at).format('lll')}</td>
                <td>{moment(event.updated_at).format('lll')}</td>
                <td className={'text-right'}>
                  <Button variant={'danger'} size={'sm'} onClick={() => onOpenDeleteModal(event.id)}>
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

export default HouseAwardEventTable
