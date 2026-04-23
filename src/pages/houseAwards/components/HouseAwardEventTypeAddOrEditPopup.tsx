import iHouseAwardEventType from "../../../types/HouseAwards/iHouseAwardEventType";
import PopupModal from "../../../components/common/PopupModal";
import { Button, Form } from "react-bootstrap";
import React, {useEffect, useState} from "react";
import FormErrorDisplay, {iErrorMap} from "../../../components/form/FormErrorDisplay";
import FormLabel from "../../../components/form/FormLabel";
import LoadingBtn from "../../../components/common/LoadingBtn";
import SectionDiv from "../../../components/common/SectionDiv";
import IconSelector from '../../../components/common/IconSelector';
import IconDisplay from '../../../components/IconDisplay';
import UtilsService from '../../../services/UtilsService';

type iHouseAwardEventTypeAddOrEditPopup = {
  eventType?: iHouseAwardEventType;
  isShowing?: boolean;
  handleClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
};

const HouseAwardEventTypeAddOrEditPopup = ({
  eventType,
  isShowing,
  handleClose,
  isSubmitting,
  onSubmit
}: iHouseAwardEventTypeAddOrEditPopup) => {
  const [editingType, setEditingType] = useState<iHouseAwardEventType | null>(null);
  const [errMap, setErrMap] = useState<iErrorMap>({});

  useEffect(() => {
    // @ts-ignore
    setEditingType(`${eventType?.id || ''}`.trim() === '' ? null : {
      name: eventType?.name || '',
      points_to_be_awarded: eventType?.points_to_be_awarded || '',
      icon: eventType?.icon || '',
      comments: eventType?.comments || '',
    });

  }, [eventType]);

  const setValue = (fieldName: string, newValue: string | null) => {
    // @ts-ignore
    setEditingType({
      ...(editingType || {}),
      [fieldName]: newValue,
    })
  }

  const preSubmit = () => {
    const errors: iErrorMap = {};
    if (`${editingType?.name || ''}`.trim() === '') {
      errors.name = 'Name is required.';
    }
    if (`${editingType?.points_to_be_awarded || ''}`.trim() === '') {
      errors.points_to_be_awarded = 'Points is required.';
    } else if (UtilsService.isNumeric(`${editingType?.points_to_be_awarded || ''}`) !== true) {
      errors.points_to_be_awarded = 'Points needs to be a number.';
    } else if (Number(`${editingType?.points_to_be_awarded || 0}`) < 0) {
      errors.points_to_be_awarded = 'Points needs to be a positive number.';
    }

    setErrMap(errors);
    return Object.keys(errors).length === 0
  }

  const handleSubmit = () => {
    if (preSubmit() !== true) {
      return;
    }
    onSubmit(editingType);
  }

  const getHeader = () => {
    if (!eventType) {
      return <b>Creating event type:</b>;
    }
    return <b>Updating event type {eventType.name}</b>;
  };

  const getBody = () => {
    return (
      <>
        <div>
          <FormLabel isRequired label={"Name"} />
          <Form.Control
            isInvalid={'name' in errMap}
            value={editingType?.name || ""}
            onChange={event => setValue("name", event.target.value)}
          />
          <FormErrorDisplay
            errorsMap={errMap}
            fieldName={"name"}
          />
        </div>

        <SectionDiv>
          <FormLabel isRequired label={"The points be to awarded"}/>
          <Form.Control
            isInvalid={'points_to_be_awarded' in errMap}
            value={editingType?.points_to_be_awarded || ""}
            onChange={event => setValue("points_to_be_awarded", event.target.value)}
          />
          <small>* set points to be 0, when you don't the event type to be awarded.</small>
          <FormErrorDisplay
            errorsMap={errMap}
            fieldName={"points_to_be_awarded"}
          />
        </SectionDiv>

        <SectionDiv>
          <FormLabel label={"Icon"}/>
          <div>
          <IconSelector onIconSelected={(icon) => setValue("icon", icon.name || null)} variant={'light'}>
              <IconDisplay name={editingType?.icon || ""}/>
            </IconSelector>
          </div>
          <FormErrorDisplay
            errorsMap={errMap}
            fieldName={"comments"}
          />
        </SectionDiv>

        <SectionDiv>
          <FormLabel label={"Comments"}/>
          <Form.Control
            isInvalid={'comments' in errMap}
            value={editingType?.comments || ""}
            onChange={event => setValue("comments", event.target.value)}
          />
          <FormErrorDisplay
            errorsMap={errMap}
            fieldName={"comments"}
          />
        </SectionDiv>
      </>
    );
  };

  const getFooter = () => {
    return (
      <>
        <Button variant={"link"} onClick={() => handleClose()}>
          <IconDisplay name={'X'} />{' '} Cancel
        </Button>
        <LoadingBtn
          isLoading={isSubmitting}
          variant={"primary"}
          onClick={() => handleSubmit()}
        >
          <IconDisplay name={'Send'} />{' '} {!eventType ? 'Create' : 'Update'}
        </LoadingBtn>
      </>
    );
  };

  return (
    <PopupModal
      header={getHeader()}
      show={isShowing}
      footer={getFooter()}
      handleClose={() => handleClose()}
    >
      {getBody()}
    </PopupModal>
  );
};

export default HouseAwardEventTypeAddOrEditPopup;
