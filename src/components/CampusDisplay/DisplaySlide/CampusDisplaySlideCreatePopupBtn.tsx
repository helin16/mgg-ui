import styled from "styled-components";
import { Button, ButtonProps } from "react-bootstrap";
import { useState } from "react";
import PopupModal from "../../common/PopupModal";
import { FlexContainer } from "../../../styles";
import LoadingBtn from "../../common/LoadingBtn";
import * as Icons from "react-bootstrap-icons";
import iCampusDisplaySlide from "../../../types/CampusDisplay/iCampusDisplaySlide";
import iCampusDisplay from "../../../types/CampusDisplay/iCampusDisplay";
import AssetListPanel from "../../Asset/AssetListPanel";
import { ASSET_TYPE_CAMPUS_DISPLAY } from "../../../types/asset/iAsset";
import Toaster, { TOAST_TYPE_SUCCESS } from "../../../services/Toaster";
import CampusDisplaySlideService from "../../../services/CampusDisplay/CampusDisplaySlideService";

const Wrapper = styled.div``;
const PopupBodyWrapper = styled.div`
  height: calc(100vh - 26rem);
  min-height: 40rem;

  .uploader-div {
    display: flex;
    justify-content: center;
    align-items: center;
    justify-items: center;
    height: 100% !important;
  }
`;

type iCampusDisplaySlideCreatePopupBtn = ButtonProps & {
  divClassName?: string;
  display: iCampusDisplay;
  closeOnSaved?: boolean;
  onSaved: (slides: iCampusDisplaySlide[]) => void;
};

const CampusDisplaySlideCreatePopupBtn = ({
  divClassName,
  onSaved,
  closeOnSaved = false,
  display,
  ...rest
}: iCampusDisplaySlideCreatePopupBtn) => {
  const [showingPopup, setShowingPopup] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [allowDelete, setAllowDelete] = useState(false);

  const handleClose = () => {
    if (isCreating === true) {
      return null;
    }
    setShowingPopup(false);
    setSelectedAssetIds([]);
  };

  const doCreate = () => {
    setIsCreating(true);
    Promise.all(
      selectedAssetIds.map(selectedAssetId => {
        return CampusDisplaySlideService.create({
          displayId: display.id,
          assetId: selectedAssetId
        });
      })
    )
      .then(resp => {
        Toaster.showToast("Slides created successfully.", TOAST_TYPE_SUCCESS);
        setSelectedAssetIds([]);
        if (closeOnSaved === true) {
          setShowingPopup(false);
        }
        onSaved(resp);
      })
      .catch(err => {
        Toaster.showApiError(err);
      })
      .finally(() => {
        setIsCreating(false);
      });
  };

  const getPopupFooter = () => {
    return (
      <FlexContainer className={"justify-content-between space-above"}>
        <div />
        <div>
          <LoadingBtn
            variant={"link"}
            onClick={() => handleClose()}
            isLoading={isCreating === true}
          >
            <Icons.XLg /> Cancel
          </LoadingBtn>

          <LoadingBtn
            variant={selectedAssetIds.length <= 0 ? "secondary" : "primary"}
            onClick={() => doCreate()}
            disabled={selectedAssetIds.length <= 0}
            isLoading={isCreating === true}
          >
            <Icons.Send /> Create{" "}
            {selectedAssetIds.length <= 0
              ? ""
              : `${selectedAssetIds.length} slide(s)`}
          </LoadingBtn>
        </div>
      </FlexContainer>
    );
  };

  const getPopup = () => {
    if (showingPopup !== true) {
      return null;
    }
    return (
      <PopupModal
        show={showingPopup}
        centered
        title={
          <FlexContainer className={"with-gap lg-gap align-items-baseline"}>
            <h5 style={{ marginBottom: "0px" }}>Create new slide(s)</h5>
            <div
              style={{ fontSize: "14px" }}
              className={"cursor-pointer"}
              onClick={() => setAllowDelete(!allowDelete)}
            >
              <small>Allow delete?</small>{" "}
              {allowDelete === true ? (
                <Icons.Check2Square/>
              ) : (
                <Icons.Square />
              )}
            </div>
          </FlexContainer>
        }
        dialogClassName="modal-90w"
        handleClose={() => handleClose()}
      >
        <PopupBodyWrapper>
          <AssetListPanel
            allowCreation
            allowDeletion={allowDelete}
            assetType={ASSET_TYPE_CAMPUS_DISPLAY}
            selectedAssetIds={selectedAssetIds}
            onSelect={newIds => setSelectedAssetIds(newIds)}
          />
        </PopupBodyWrapper>
        {getPopupFooter()}
      </PopupModal>
    );
  };

  return (
    <Wrapper className={divClassName}>
      <Button {...rest} onClick={() => setShowingPopup(true)} />
      {getPopup()}
    </Wrapper>
  );
};

export default CampusDisplaySlideCreatePopupBtn;
