import iHouseAwardEventType from '../../../types/HouseAwards/iHouseAwardEventType';
import PopupModal from '../../../components/common/PopupModal';
import {Button, Form} from 'react-bootstrap';
import React from 'react';
import { useForm, Controller } from "react-hook-form";
import FormErrorDisplay from '../../../components/form/FormErrorDisplay';
import FormLabel from '../../../components/form/FormLabel';
import LoadingBtn from '../../../components/common/LoadingBtn';

type iHouseAwardEventTypeAddOrEditPopup = {
  eventType?: iHouseAwardEventType;
  isShowing?: boolean;
  handleClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

const HouseAwardEventTypeAddOrEditPopup = ({eventType, isShowing, handleClose, isSubmitting, onSubmit}: iHouseAwardEventTypeAddOrEditPopup) => {

  const { control, handleSubmit, setValue, formState } = useForm();

  const getHeader = () => {
    if (!eventType) {
      return <b>Creating event type:</b>
    }
    return <b>Updating event type {eventType.name}</b>
  }

  const getBody = () => {
    return (
      <>
        <Controller
          name={'name'}
          control={control}
          rules={{
            required: true,
          }}
          defaultValue={eventType?.name || ''}
          render={ctrlProps => (
            <Form.Group>
              <FormLabel isRequired label={'Name'} />
              <Form.Control
                {...ctrlProps}
                defaultValue={eventType?.name || ''}
                onChange={(event) => setValue('name', event.target.value)}
              />
              <FormErrorDisplay errorsMap={formState.errors} fieldName={'name'} errorMsg={'Name is required'} />
            </Form.Group>
          )} />

        <Controller
          name={'points_to_be_awarded'}
          control={control}
          rules={{
            required: true,
          }}
          defaultValue={eventType?.points_to_be_awarded || ''}
          render={ctrlProps => (
            <Form.Group>
              <FormLabel isRequired label={'The points be to awarded'} />
              <Form.Control
                {...ctrlProps}
                defaultValue={eventType?.points_to_be_awarded || ''}
                onChange={(event) => setValue('points_to_be_awarded', event.target.value)}
              />
              <FormErrorDisplay errorsMap={formState.errors} fieldName={'points_to_be_awarded'} errorMsg={'Points is required'} />
            </Form.Group>
          )} />

        <Controller
          name={'comments'}
          control={control}
          defaultValue={eventType?.comments || ''}
          render={ctrlProps => (
            <Form.Group>
              <FormLabel label={'Comments'} />
              <Form.Control
                {...ctrlProps}
                defaultValue={eventType?.comments || ''}
                onChange={(event) => setValue('comments', event.target.value)}
              />
            </Form.Group>
          )} />
      </>
    )
  }

  const getFooter = () => {
    if (!eventType) {
      return (
        <>
          <Button variant={'link'} onClick={() => handleClose()}>Cancel</Button>
          <LoadingBtn isLoading={isSubmitting} variant={'primary'} onClick={handleSubmit(onSubmit)}>Create</LoadingBtn>
        </>
      )
    }
    return (
      <>
        <Button variant={'link'} onClick={() => handleClose()}>Cancel</Button>
        <LoadingBtn isLoading={isSubmitting} variant={'primary'} onClick={handleSubmit(onSubmit)}>Update</LoadingBtn>
      </>
    )
  }

  return (
    <PopupModal header={getHeader()} show={isShowing} footer={getFooter()} handleClose={() => handleClose()}>
      {getBody()}
    </PopupModal>
  );
}

export default HouseAwardEventTypeAddOrEditPopup
