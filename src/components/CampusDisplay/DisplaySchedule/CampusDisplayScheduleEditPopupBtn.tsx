import { useEffect, useState } from "react";
import iCampusDisplaySchedule from "../../../types/CampusDisplay/iCampusDisplaySchedule";
import {
  Button,
  ButtonProps,
  Col,
  FormControl,
  FormGroup,
  Row
} from "react-bootstrap";
import PopupModal from "../../common/PopupModal";
import { FlexContainer } from "../../../styles";
import LoadingBtn from "../../common/LoadingBtn";
import * as Icons from "react-bootstrap-icons";
import FormLabel from "../../form/FormLabel";
import styled from "styled-components";
import moment from "moment-timezone";
import DateTimePicker from "../../common/DateTimePicker";
import MathHelper from "../../../helper/MathHelper";
import CampusDisplaySelector from "../Playlist/CampusDisplaySelector";
import InputGroup from "react-bootstrap/InputGroup";
import SectionDiv from "../../common/SectionDiv";
import CampusDisplayScheduleService from "../../../services/CampusDisplay/CampusDisplayScheduleService";
import FormErrorDisplay, { iErrorMap } from "../../form/FormErrorDisplay";
import CampusDisplayService from "../../../services/CampusDisplay/CampusDisplayService";
import Toaster from '../../../services/Toaster';
import UtilsService from '../../../services/UtilsService';

type iCampusDisplayScheduleEditPopupBtn = ButtonProps & {
  schedule?: iCampusDisplaySchedule;
  locationId?: string;
  onSaved?: (saved: iCampusDisplaySchedule) => void;
};

const Wrapper = styled.div`
  .checkbox {
    font-size: 20px;
  }
  .campus-display-selector-wrapper {
    width: 100%;
    .campus-display-selector {
      flex: auto;
    }
    .btn {
      width: 150px;
    }
  }
`;
const CampusDisplayScheduleEditPopupBtn = ({
  locationId,
  onSaved,
  schedule,
  ...props
}: iCampusDisplayScheduleEditPopupBtn) => {
  const [isSaving, setIsSaving] = useState(false);
  const [errorMap, setErrorMap] = useState<iErrorMap>({});
  const [showingPopup, setShowingPopup] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [
    editingSchedule,
    setEditingSchedule
  ] = useState<iCampusDisplaySchedule | null>(null);

  useEffect(() => {
    setShowingPopup(false);
    setNewDisplayName(null);
    setEditingSchedule(
      // @ts-ignore
      schedule
        ? schedule
        : {
            startDate: moment().toISOString(),
            endDate: null,
            locationId,
            displayId: null,
            mon: true,
            tue: true,
            wed: true,
            thu: true,
            fri: true,
            sat: true,
            sun: true
          }
    );
  }, [schedule, locationId, count]);

  const preSave = () => {
    const errors: iErrorMap = {};

    if (`${editingSchedule?.startDate || ""}`.trim() === "") {
      errors["startDate"] = "Start Date is required.";
    }

    if (
      newDisplayName === null &&
      `${editingSchedule?.displayId || ""}`.trim() === ""
    ) {
      errors["displayId"] = "Play List is required.";
    }

    if (newDisplayName !== null && `${newDisplayName || ""}`.trim() === "") {
      errors["displayId"] = "Play List Name is required.";
    }

    setErrorMap(errors);
    return Object.keys(errors).length === 0;
  };

  const doSave = async () => {
    const data = {
      ...(editingSchedule || {}),
      ...(`${editingSchedule?.id || ""}`.trim() === "" &&
      `${newDisplayName || ""}`.trim() !== ""
        ? {
            displayId: (
              await CampusDisplayService.create({
                name: `${newDisplayName || ""}`.trim()
              })
            ).id
          }
        : {})
    };
    return editingSchedule?.id
      ? CampusDisplayScheduleService.update(editingSchedule?.id || "", data)
      : CampusDisplayScheduleService.create(data);
  };

  const handleSubmit = () => {
    if (preSave() !== true) {
      return;
    }

    setIsSaving(true);
    doSave()
      .then(resp => {
        setCount(MathHelper.add(count, 1));
        onSaved && onSaved(resp);
      })
      .catch(err => {
        Toaster.showApiError(err);
      })
      .finally(() => setIsSaving(false))
  };

  const handleUpdateInfo = (
    fieldName: string,
    newValue: string | number | boolean | null
  ) => {
    // @ts-ignore
    setEditingSchedule({
      ...editingSchedule,
      [fieldName]: newValue
    });
  };

  const getPopupBody = () => {
    return (
      <Wrapper>
        <div>
          <FormLabel label={"Playlist:"} />
          {newDisplayName === null ? (
            <FlexContainer
              className={
                "with-gap lg-gap justify-content-start campus-display-selector-wrapper space-below"
              }
            >
              <div className={"campus-display-selector"}>
                <CampusDisplaySelector
                  placeholder={"Select a play list ..."}
                  className={`form-control ${
                    "displayId" in errorMap ? "is-invalid" : ""
                  }`}
                  values={
                    editingSchedule ? [editingSchedule?.displayId] : undefined
                  }
                  onSelect={option => {
                    handleUpdateInfo(
                      "displayId",
                      // @ts-ignore
                      option.data ? option.data.id : null
                    );
                  }}
                />
              </div>
              {`${editingSchedule?.id || ''}`.trim() === ''  ? (
                <Button
                  variant={"success"}
                  size={"sm"}
                  onClick={() => setNewDisplayName("")}
                >
                  <Icons.Plus /> New Play List
                </Button>
              ) : null}
            </FlexContainer>
          ) : (
            <InputGroup>
              <FormControl
                isInvalid={"displayId" in errorMap}
                value={`${newDisplayName || ""}`.trim()}
                placeholder={"New Display Name..."}
                onChange={event =>
                  setNewDisplayName(`${event.target.value || ""}`)
                }
              />
              <Button
                variant="outline-secondary"
                onClick={() => setNewDisplayName(null)}
              >
                <Icons.XLg />
              </Button>
            </InputGroup>
          )}

          <FormErrorDisplay errorsMap={errorMap} fieldName={"displayId"} />
        </div>
        <SectionDiv>
          <Row>
            <Col>
              <FormLabel label={"Start Date:"} isRequired />
              <DateTimePicker
                className={`form-control ${
                  "startDate" in errorMap ? "is-invalid" : ""
                }`}
                dateFormat={"DD MMM YYYY"}
                placeholder={"Pick a date..."}
                timeFormat={false}
                value={editingSchedule?.startDate || undefined}
                onChange={selected => {
                  if (typeof selected === "object") {
                    handleUpdateInfo("startDate", selected.toISOString());
                  }
                }}
              />
              <FormErrorDisplay errorsMap={errorMap} fieldName={"startDate"} />
            </Col>
            <Col>
              <FormLabel label={"End Date:"} />
              <DateTimePicker
                dateFormat={"DD MMM YYYY"}
                placeholder={"Pick a date..."}
                timeFormat={false}
                allowClear
                value={editingSchedule?.endDate || undefined}
                onChange={selected => {
                  if (selected === null) {
                    handleUpdateInfo("endDate", null);
                    return;
                  }
                  if (typeof selected === "object") {
                    handleUpdateInfo("endDate", selected.toISOString());
                  }
                }}
              />
            </Col>
          </Row>
        </SectionDiv>

        <SectionDiv>
          <Row>
            <Col>
              <FormLabel label={"Start Time:"} />
              <DateTimePicker
                allowClear
                dateFormat={""}
                timeFormat={"HH:mm:ss"}
                placeholder={"Pick a time..."}
                value={editingSchedule?.startTime || undefined}
                onChange={selected => {
                  if (selected === null) {
                    handleUpdateInfo("startTime", null);
                    return;
                  }
                  if (typeof selected === "object") {
                    handleUpdateInfo("startTime", selected.toISOString());
                  }
                }}
              />
            </Col>
            <Col>
              <FormLabel label={"End Time:"} />
              <DateTimePicker
                allowClear
                dateFormat={""}
                placeholder={"Pick a time..."}
                timeFormat={"HH:mm:ss"}
                value={editingSchedule?.endTime || undefined}
                onChange={selected => {
                  if (selected === null) {
                    handleUpdateInfo("endTime", null);
                    return;
                  }
                  if (typeof selected === "object") {
                    handleUpdateInfo("endTime", selected.toISOString());
                  }
                }}
              />
            </Col>
          </Row>
        </SectionDiv>
        <SectionDiv>
          <Row>
            {UtilsService.getWeekDaysShort().map(day => {
              return (
                <Col key={day} className={"text-center"}>
                  <FormLabel label={day.toUpperCase()} />
                  <div
                    className={"checkbox cursor-pointer"}
                    onClick={() =>
                      handleUpdateInfo(
                        day,
                        !(
                          (
                            editingSchedule !== null &&
                            day in editingSchedule &&
                            // @ts-ignore
                            editingSchedule[day] === true
                          )
                        )
                      )
                    }
                  >
                    {/*// @ts-ignore*/}
                    {editingSchedule !== null && day in editingSchedule && editingSchedule[day] === true ? (
                      <Icons.CheckSquareFill className={"text-success"} />
                    ) : (
                      <Icons.Square />
                    )}
                  </div>
                </Col>
              );
            })}
          </Row>
        </SectionDiv>
      </Wrapper>
    );
  };

  const handleClose = () => {
    setCount(MathHelper.add(count, 1));
  };

  const getPopup = () => {
    if (!showingPopup) {
      return null;
    }
    return (
      <PopupModal
        show={showingPopup === true}
        handleClose={() => handleClose()}
        size={"lg"}
        title={<h6>Choose a location to display</h6>}
        footer={
          <FlexContainer className={"justify-content-between"}>
            <div />
            <div>
              <LoadingBtn
                isLoading={isSaving === true}
                variant={"link"}
                onClick={() => handleClose()}
              >
                <Icons.X /> Cancel
              </LoadingBtn>
              <LoadingBtn
                isLoading={isSaving === true}
                variant={"primary"}
                onClick={() => handleSubmit()}
              >
                <Icons.Send /> Save
              </LoadingBtn>
            </div>
          </FlexContainer>
        }
      >
        {getPopupBody()}
      </PopupModal>
    );
  };

  return (
    <>
      <Button {...props} onClick={() => setShowingPopup(true)} />
      {getPopup()}
    </>
  );
};

export default CampusDisplayScheduleEditPopupBtn;
