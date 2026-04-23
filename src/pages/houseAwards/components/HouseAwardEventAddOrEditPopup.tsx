import PopupModal from '../../../components/common/PopupModal';
import {Button, Form} from 'react-bootstrap';
import React from 'react';
import { useForm, Controller } from "react-hook-form";
import FormErrorDisplay from '../../../components/form/FormErrorDisplay';
import FormLabel from '../../../components/form/FormLabel';
import LoadingBtn from '../../../components/common/LoadingBtn';
import iHouseAwardEvent from '../../../types/HouseAwards/iHouseAwardEvent';

type iHouseAwardEventAddOrEditPopup = {
  event?: iHouseAwardEvent;
  isShowing?: boolean;
  handleClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

const HouseAwardEventAddOrEditPopup = ({event, isShowing, handleClose, isSubmitting, onSubmit}: iHouseAwardEventAddOrEditPopup) => {

  const { control, handleSubmit, setValue, formState } = useForm();

  const getHeader = () => {
    if (!event) {
      return <b>Creating event type:</b>
    }
    return <b>Updating event type {event.name}</b>
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
          defaultValue={event?.name || ''}
          render={ctrlProps => (
            <Form.Group>
              <FormLabel isRequired label={'Name'} />
              <Form.Control
                {...ctrlProps}
                defaultValue={event?.name || ''}
                onChange={(event) => setValue('name', event.target.value)}
              />
              <FormErrorDisplay errorsMap={formState.errors} fieldName={'name'} errorMsg={'Name is required'} />
            </Form.Group>
          )} />

        <Controller
          name={'description'}
          control={control}
          defaultValue={event?.description || ''}
          render={ctrlProps => (
            <Form.Group>
              <FormLabel label={'Description'} />
              <Form.Control
                {...ctrlProps}
                defaultValue={event?.description || ''}
                onChange={(event) => setValue('description', event.target.value)}
              />
            </Form.Group>
          )} />
      </>
    )
  }

  const getFooter = () => {
    if (!event) {
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

export default HouseAwardEventAddOrEditPopup
