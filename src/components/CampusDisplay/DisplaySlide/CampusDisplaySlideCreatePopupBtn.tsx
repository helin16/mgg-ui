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
import MathHelper from "../../../helper/MathHelper";

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
  const [listingFolderId, setListingFolderId] = useState<string | null>(null);
  const [selectedFolderIds, setSelectedFolderIds] = useState<string[]>([]);

  const handleClose = () => {
    if (isCreating === true) {
      return null;
    }
    setShowingPopup(false);
    setSelectedAssetIds([]);
    setSelectedFolderIds([]);
  };

  const doCreate = () => {
    setIsCreating(true);
    Promise.all([
      ...selectedAssetIds.map(selectedAssetId => {
        return CampusDisplaySlideService.create({
          displayId: display.id,
          assetId: selectedAssetId
        });
      }),
      ...selectedFolderIds.map(selectedFolderId => {
        return CampusDisplaySlideService.createFromFolder(selectedFolderId, {
          displayId: display.id
        });
      })
    ])
      .then(resp => {
        Toaster.showToast("Slides created successfully.", TOAST_TYPE_SUCCESS);
        setSelectedAssetIds([]);
        if (closeOnSaved === true) {
          setShowingPopup(false);
        }
        const slides = resp.slice(0, selectedAssetIds.length);
        const folderSlides =
          selectedAssetIds.length <= 0
            ? resp
            : resp.slice(MathHelper.add(selectedAssetIds.length, 1));
        // @ts-ignore
        onSaved([
          ...slides,
          // @ts-ignore
          ...folderSlides.reduce(
            // @ts-ignore
            (arr: iCampusDisplaySlide[], slides: iCampusDisplaySlide[]) => {
              return [...arr, ...slides];
            },
            []
          )
        ]);
      })
      .catch(err => {
        Toaster.showApiError(err);
      })
      .finally(() => {
        setIsCreating(false);
      });
  };

  const getPopupFooter = () => {
    const totalSelected = MathHelper.add(selectedAssetIds.length, selectedFolderIds.length);
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
            variant={totalSelected <= 0 ? "secondary" : "primary"}
            onClick={() => doCreate()}
            disabled={totalSelected <= 0}
            isLoading={isCreating === true}
          >
            <Icons.Send /> Create{" "}
            {totalSelected <= 0
              ? ""
              : `slide(s)`}
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
        title={
          <FlexContainer className={"with-gap lg-gap align-items-baseline"}>
            <h5 style={{ marginBottom: "0px" }}>Create new slide(s)</h5>
            <div
              style={{ fontSize: "14px" }}
              className={"cursor-pointer"}
              onClick={() => setAllowDelete(!allowDelete)}
            >
              <small>Allow delete?</small>{" "}
              {allowDelete === true ? <Icons.Check2Square /> : <Icons.Square />}
            </div>
          </FlexContainer>
        }
        dialogClassName="modal-80w"
        handleClose={() => handleClose()}
      >
        <PopupBodyWrapper>
          <AssetListPanel
            allowCreation
            allowDeletion={allowDelete}
            assetType={ASSET_TYPE_CAMPUS_DISPLAY}
            selectedAssetIds={selectedAssetIds}
            onSelect={newIds => setSelectedAssetIds(newIds)}
            onListingFolder={folderId => setListingFolderId(folderId)}
            listingFolderId={listingFolderId}
            onFolderSelected={folderIds => {
              setSelectedFolderIds(folderIds);
            }}
            selectedFolderIds={selectedFolderIds}
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
