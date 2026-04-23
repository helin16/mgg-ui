import { Button, ButtonProps, FormControl } from "react-bootstrap";
import React, { useState } from "react";
import PopupModal from "../common/PopupModal";
import styled from "styled-components";
import LoadingBtn from "../common/LoadingBtn";
import iAsset, { ASSET_TYPE_TEMP } from "../../types/asset/iAsset";
import SectionDiv from "../common/SectionDiv";
import FormLabel from "../form/FormLabel";
import AssetService from "../../services/Asset/AssetService";
import Toaster from "../../services/Toaster";
import FormErrorDisplay, { iErrorMap } from "../form/FormErrorDisplay";

type iAssetUrlEditPopupBtn = ButtonProps & {
  onSaved?: (saved: iAsset) => void;
  assetType?: string;
  mimeType?: string;
};

const Wrapper = styled.div``;
const AssetUrlEditPopupBtn = ({
  assetType,
  mimeType,
  onSaved,
  ...props
}: iAssetUrlEditPopupBtn) => {
  const [showingPopup, setShowingPopup] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingAsset, setEditingAsset] = useState<iAsset | null>(null);
  const [errorMap, setErrorMap] = useState<iErrorMap>({});

  const handleAssetChange = (fieldName: string, newValue: any) => {
    // @ts-ignore
    setEditingAsset({
      ...(editingAsset || {}),
      [fieldName]: newValue
    });
  };

  const preSave = () => {
    const errors: iErrorMap = {};
    const url = `${editingAsset?.url || ""}`.trim();
    if (url === "") {
      errors["url"] = "Url is required.";
    }

    setErrorMap(errors);
    return Object.keys(errors).length === 0;
  };

  const doSave = () => {
    if (preSave() !== true) {
      return;
    }
    setIsSaving(true);
    const data = editingAsset || {};
    AssetService.create({
      ...data,
      type: `${assetType || ""}`.trim() === "" ? ASSET_TYPE_TEMP : assetType,
      mimeType: `${mimeType || ""}`.trim() === "" ? null : mimeType
    })
      .then(resp => {
        handleClose();
        onSaved && onSaved(resp);
      })
      .catch(err => {
        Toaster.showApiError(err);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const handleClose = () => {
    setErrorMap({});
    setShowingPopup(false);
  };

  const getPopupContent = () => {
    return (
      <Wrapper>
        <SectionDiv>
          <FormLabel label={"Url"} isRequired />
          <FormControl
            isInvalid={"url" in errorMap}
            value={editingAsset?.url || ""}
            placeholder={'Youtube / Vimeo / External link'}
            onChange={event => handleAssetChange("url", event.target.value)}
          />
          <FormErrorDisplay errorsMap={errorMap} fieldName={"url"} />
        </SectionDiv>
      </Wrapper>
    );
  };

  const getPopupModal = () => {
    if (showingPopup !== true) {
      return null;
    }

    return (
      <PopupModal
        title={"Creating a asset from url.."}
        size={"lg"}
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
              Create
            </LoadingBtn>
          </>
        }
      >
        {getPopupContent()}
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

export default AssetUrlEditPopupBtn;
