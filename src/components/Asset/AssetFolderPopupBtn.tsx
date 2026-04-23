import React, { useEffect, useState } from "react";
import Toaster from "../../services/Toaster";
import { Button, ButtonProps, FormControl } from "react-bootstrap";
import AssetFolderService from "../../services/Asset/AssetFolderService";
import iAssetFolder from "../../types/asset/iAssetFolder";
import FormErrorDisplay, { iErrorMap } from "../form/FormErrorDisplay";
import PopupModal from "../common/PopupModal";
import LoadingBtn from "../common/LoadingBtn";
import FormLabel from "../form/FormLabel";
import SectionDiv from "../common/SectionDiv";

type iAssetFolderPopupBtn = ButtonProps & {
  folder?: iAssetFolder | null;
  folderType?: string;
  onSaved: (saved: iAssetFolder, isCreated: boolean) => void;
  parentId?: string | null;
};

const AssetFolderPopupBtn = ({
  folder,
  parentId,
  onSaved,
  folderType,
  ...props
}: iAssetFolderPopupBtn) => {
  const [showingPopup, setShowingPopup] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingFolder, setEditingFolder] = useState<iAssetFolder | null>(null);
  const [errorMap, setErrorMap] = useState<iErrorMap>({});

  useEffect(() => {
    if (!folder) {
      setEditingFolder(null);
      return;
    }
    setEditingFolder(folder);
  }, [folder]);

  const handleClose = () => {
    setEditingFolder(null);
    setIsSaving(false);
    setErrorMap({});
    setShowingPopup(false);
  };

  const preCheck = () => {
    const errors: iErrorMap = {};
    if (`${editingFolder?.name || ""}`.trim() === "") {
      errors.name = "Folder name is required";
    }
    setErrorMap(errors);
    return Object.keys(errors).length <= 0;
  };

  const doSave = () => {
    if (!preCheck()) {
      return;
    }
    const data = {
      name: editingFolder?.name || "",
      ...(`${parentId || ""}`.trim() === "" ? {} : { parentId }),
      ...(`${folderType || ""}`.trim() === ""
        ? {}
        : { type: `${folderType || ""}`.trim() })
    };
    const saveFn = () =>
      `${folder?.id || ""}`.trim() === ""
        ? AssetFolderService.create(data)
        : AssetFolderService.update(folder?.id || "", data);
    setIsSaving(true);
    saveFn()
      .then(resp => {
        handleClose();
        onSaved(resp, `${folder?.id || ""}`.trim() === "");
      })
      .catch(err => {
        setIsSaving(false);
        Toaster.showApiError(err);
      });
  };

  const handleFolderChange = (fieldName: string, newValue: string) => {
    // @ts-ignore
    setEditingFolder({
      ...(editingFolder || {}),
      [fieldName]: newValue
    });
  };

  const getPopupModal = () => {
    if (!showingPopup) {
      return null;
    }
    return (
      <PopupModal
        title={
          `${folder?.id || ""}`.trim() === ""
            ? "Creating a folder"
            : `Updating folder: ${folder?.name}`
        }
        show={showingPopup === true}
        handleClose={() => handleClose()}
        footer={
          <>
            <LoadingBtn
              variant={"link"}
              onClick={() => setShowingPopup(false)}
              isLoading={isSaving === true}
            >
              Cancel
            </LoadingBtn>
            <LoadingBtn
              variant={"primary"}
              onClick={() => doSave()}
              isLoading={isSaving === true}
            >
              {`${folder?.id || ''}`.trim() === '' ? 'Create' : 'Update'}
            </LoadingBtn>
          </>
        }
      >
        <SectionDiv className={'no-top'}>
          <FormLabel label={"Name"} isRequired />
          <FormControl
            isInvalid={"name" in errorMap}
            value={editingFolder?.name || ""}
            placeholder={"The name of the folder"}
            onChange={event => handleFolderChange("name", event.target.value)}
          />
          <FormErrorDisplay errorsMap={errorMap} fieldName={"name"} />
        </SectionDiv>
      </PopupModal>
    );
  };

  return (
    <>
      <Button {...props} onClick={() => setShowingPopup(true)} />
      {getPopupModal()}
    </>
  );
};

export default AssetFolderPopupBtn;
