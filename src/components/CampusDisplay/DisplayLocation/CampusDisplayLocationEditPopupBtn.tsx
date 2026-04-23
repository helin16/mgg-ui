import { Button, ButtonProps, FormControl } from "react-bootstrap";
import iCampusDisplayLocation from "../../../types/CampusDisplay/iCampusDisplayLocation";
import { useEffect, useState } from "react";
import PopupModal from "../../common/PopupModal";
import FormLabel from "../../form/FormLabel";
import { FlexContainer } from "../../../styles";
import LoadingBtn from "../../common/LoadingBtn";
import * as Icons from "react-bootstrap-icons";
import FormErrorDisplay, { iErrorMap } from "../../form/FormErrorDisplay";
import Toaster, { TOAST_TYPE_SUCCESS } from "../../../services/Toaster";
import CampusDisplayLocationService from "../../../services/CampusDisplay/CampusDisplayLocationService";
import SectionDiv from "../../common/SectionDiv";
import CampusDisplaySelector from "../Playlist/CampusDisplaySelector";
import moment from 'moment-timezone';

type iCampusDisplayLocationPopupBtn = ButtonProps & {
  campusDisplayLocation?: iCampusDisplayLocation;
  onSaved: (saved: iCampusDisplayLocation) => void;
};

const CampusDisplayLocationEditPopupBtn = ({
  campusDisplayLocation,
  onSaved,
  ...rest
}: iCampusDisplayLocationPopupBtn) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showingPopup, setShowingPopup] = useState(false);
  const [forceReload, setForceReload] = useState(false);
  const [errors, setErrors] = useState<iErrorMap>({});
  const [
    editingDisplayLocation,
    setEditingDisplayLocation
  ] = useState<iCampusDisplayLocation | null>(null);

  useEffect(() => {
    setEditingDisplayLocation(campusDisplayLocation || null);
  }, [campusDisplayLocation]);

  const setDisplayValue = (fieldName: string, newValue: any) => {
    // @ts-ignore
    setEditingDisplayLocation({
      ...(editingDisplayLocation || {}),
      [fieldName]: newValue
    });
  };

  const preSubmit = () => {
    const errMap: iErrorMap = {};
    if (`${editingDisplayLocation?.name || ""}`.trim() === "") {
      errMap.name = "Name is required";
    }
    setErrors(errMap);
    return Object.keys(errMap).length <= 0;
  };

  const handleSubmit = () => {
    if (preSubmit() !== true) {
      return;
    }

    const editing = editingDisplayLocation || {settings: {}};
    const data = {
      ...editing,
      settings: {
        ...(editing?.settings || {}),
        ...(forceReload === true ? {forceReload: moment().unix()} : {}),
      }
    }
    const func =
      `${editingDisplayLocation?.id || ""}`.trim() === ""
        ? CampusDisplayLocationService.create(data)
        : CampusDisplayLocationService.update(
            editingDisplayLocation?.id || "",
            data
          );
    setIsSaving(true);
    func
      .then(resp => {
        setIsSaving(false);
        Toaster.showToast("Saved successfully.", TOAST_TYPE_SUCCESS);
        onSaved(resp);
      })
      .catch(err => {
        setIsSaving(false);
        Toaster.showApiError(err);
      });
  };

  return (
    <>
      <Button {...rest} onClick={() => setShowingPopup(true)} />
      <PopupModal
        show={showingPopup === true}
        handleClose={() => setShowingPopup(false)}
        title={
          <h6>
            {`${editingDisplayLocation?.id || ""}`.trim() === ""
              ? "Creating Location..."
              : `Updating ${editingDisplayLocation?.name || ""} ...`}
          </h6>
        }
        footer={
          <FlexContainer className={"justify-content-between"}>
            <div />
            <div>
              <LoadingBtn
                isLoading={isSaving === true}
                variant={"link"}
                onClick={() => setShowingPopup(false)}
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
        <div>
          <div>
            <FormLabel label={"Location Name"} isRequired />
            <FormControl
              isInvalid={"name" in errors}
              value={editingDisplayLocation?.name || ""}
              onChange={event =>
                setDisplayValue("name", event.target.value || "")
              }
            />
            <FormErrorDisplay errorsMap={errors} fieldName={"name"} />
          </div>
          <SectionDiv>
            <FormLabel label={"Default Play List:"} />
            <CampusDisplaySelector
              values={
                editingDisplayLocation?.displayId
                  ? [editingDisplayLocation?.displayId]
                  : undefined
              }
              onSelect={option => {
                // @ts-ignore
                setDisplayValue("displayId", option.value || "");
              }}
            />
          </SectionDiv>
          <SectionDiv>
            <FormLabel label={"Force Reload?"} />
            <h5
              className={"cursor-pointer"}
              onClick={() => setForceReload(!forceReload)}
            >
              {forceReload === true ? (
                <Icons.Check2Square className={"text-danger"} />
              ) : (
                <Icons.Square />
              )}
            </h5>
          </SectionDiv>
        </div>
      </PopupModal>
    </>
  );
};

export default CampusDisplayLocationEditPopupBtn;
