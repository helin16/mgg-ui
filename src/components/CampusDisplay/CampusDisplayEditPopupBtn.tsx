import { Button, ButtonProps, FormControl } from "react-bootstrap";
import iCampusDisplay from "../../types/CampusDisplay/iCampusDisplay";
import { useEffect, useState } from "react";
import PopupModal from "../common/PopupModal";
import FormLabel from "../form/FormLabel";
import { FlexContainer } from "../../styles";
import LoadingBtn from "../common/LoadingBtn";
import * as Icons from "react-bootstrap-icons";
import FormErrorDisplay, {
  iErrorMap
} from "../form/FormErrorDisplay";
import CampusDisplayService from "../../services/CampusDisplay/CampusDisplayService";
import Toaster, {TOAST_TYPE_SUCCESS} from '../../services/Toaster';

type iCampusDisplayPopupBtn = ButtonProps & {
  campusDisplay?: iCampusDisplay;
  onSaved: (saved: iCampusDisplay) => void;
};

const CampusDisplayEditPopupBtn = ({
  campusDisplay,
  onSaved,
  ...rest
}: iCampusDisplayPopupBtn) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showingPopup, setShowingPopup] = useState(false);
  const [errors, setErrors] = useState<iErrorMap>({});
  const [editingDisplay, setEditingDisplay] = useState<iCampusDisplay | null>(
    null
  );

  useEffect(() => {
    setEditingDisplay(campusDisplay || null);
  }, [campusDisplay]);

  const setDisplayValue = (fieldName: string, newValue: any) => {
    // @ts-ignore
    setEditingDisplay({ ...(editingDisplay || {}), [fieldName]: newValue });
  };

  const preSubmit = () => {
    const errMap: iErrorMap = {};
    if (`${editingDisplay?.name || ""}`.trim() === "") {
      errMap.name = "Name is required";
    }
    setErrors(errMap);
    return Object.keys(errMap).length <= 0;
  };

  const handleSubmit = () => {
    if (preSubmit() !== true) {
      return;
    }

    const func =
      `${editingDisplay?.id || ""}`.trim() === ""
        ? CampusDisplayService.create(editingDisplay || {})
        : CampusDisplayService.update(
            editingDisplay?.id || "",
            editingDisplay || {}
          );
    setIsSaving(true);
    func.then(resp => {
        setIsSaving(false);
        Toaster.showToast('Saved successfully.', TOAST_TYPE_SUCCESS);
        onSaved(resp);
      }).catch(err => {
        setIsSaving(false);
        Toaster.showApiError(err);
      })
  };

  return (
    <>
      <Button {...rest} onClick={() => setShowingPopup(true)} />
      <PopupModal
        show={showingPopup === true}
        handleClose={() => setShowingPopup(false)}
        title={
          <h6>
            {`${editingDisplay?.id || ""}`.trim() === ""
              ? "Creating..."
              : `Updating ${editingDisplay?.name || ""} ...`}
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
          <FormLabel label={"Name"} isRequired />
          <FormControl
            isInvalid={"name" in errors}
            value={editingDisplay?.name || ""}
            onChange={event =>
              setDisplayValue("name", event.target.value || "")
            }
          />
          <FormErrorDisplay errorsMap={errors} fieldName={"name"} />
        </div>
      </PopupModal>
    </>
  );
};

export default CampusDisplayEditPopupBtn;
