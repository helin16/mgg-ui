import styled from "styled-components";
import { Button, ButtonProps } from "react-bootstrap";
import { useState } from "react";
import PopupModal from "../common/PopupModal";
import UploadFilePanel from "../Asset/UploadFilePanel";
import { FlexContainer } from "../../styles";
import LoadingBtn from "../common/LoadingBtn";
import * as Icons from "react-bootstrap-icons";
import iCampusDisplaySlide from "../../types/CampusDisplay/iCampusDisplaySlide";
import iCampusDisplay from "../../types/CampusDisplay/iCampusDisplay";
import CampusDisplaySlideService from '../../services/CampusDisplay/CampusDisplaySlideService';
import Toaster from '../../services/Toaster';
import PageLoadingSpinner from '../common/PageLoadingSpinner';

const Wrapper = styled.div``;
const PopupBodyWrapper = styled.div`
  .uploader-div {
    padding: 6rem 2rem
  }
`;

type campusDisplaySlideEditPopupBtn = ButtonProps & {
  divClassName?: string;
  display: iCampusDisplay;
  closeOnSaved?: boolean;
  onSaved: (slides: iCampusDisplaySlide[]) => void;
};
const CampusDisplaySlideEditPopupBtn = ({
  divClassName,
  onSaved,
  closeOnSaved = false,
  display,
  ...rest
}: campusDisplaySlideEditPopupBtn) => {
  const [showingPopup, setShowingPopup] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFiles = (files: File[]) => {
    setIsUploading(true);
    Promise.all(files.map(file => {
      const formData = new FormData();
      formData.append('file', file);
      return CampusDisplaySlideService.create(display.id, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    })).then(resp => {
      if (closeOnSaved === true) {
        setShowingPopup(false);
      }
      onSaved(resp);
    }).catch(err => {
      Toaster.showApiError(err);
    }).finally(() => {
      setIsUploading(false);
    })
  };

  const handleClose = () => {
    if (isUploading === true) {
      return null;
    }
    setShowingPopup(false)
  }

  const getPopupContent = () => {
    if (isUploading !== true) {
      return (
        <UploadFilePanel
          className={'uploader-div'}
          description={"Click here to upload files or drag them here"}
          uploadFn={uploadFiles}
          allowMultiple={true}
          acceptFileTypes={["image/*", 'video/*']}
        />
      )
    }
    return (
      <div className={'text-center'}>
        <PageLoadingSpinner text={<h5>Uploading...</h5>}/>
      </div>
    )
  }

  const getPopup = () => {
    if (showingPopup !== true) {
      return null;
    }
    return (
      <PopupModal
        show={showingPopup}
        title={<h5>Create new slide(s)</h5>}
        dialogClassName="modal-90w"
        handleClose={() => handleClose()}
        footer={
          <FlexContainer className={"justify-content-between"}>
            <div />
            <div>
              <LoadingBtn
                variant={"link"}
                onClick={() => handleClose()}
              >
                <Icons.XLg /> Cancel
              </LoadingBtn>
            </div>
          </FlexContainer>
        }
      >
        <PopupBodyWrapper>
          {getPopupContent()}
        </PopupBodyWrapper>
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

export default CampusDisplaySlideEditPopupBtn;
