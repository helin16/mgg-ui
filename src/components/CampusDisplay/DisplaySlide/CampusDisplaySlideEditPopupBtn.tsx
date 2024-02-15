import styled from "styled-components";
import { Button, ButtonProps, Col, Row } from "react-bootstrap";
import { useState } from "react";
import PopupModal from "../../common/PopupModal";
import { FlexContainer } from "../../../styles";
import LoadingBtn from "../../common/LoadingBtn";
import * as Icons from "react-bootstrap-icons";
import iCampusDisplaySlide from "../../../types/CampusDisplay/iCampusDisplaySlide";
import iCampusDisplay from "../../../types/CampusDisplay/iCampusDisplay";
import FormLabel from "../../form/FormLabel";
import CDSlideDisplayModeSelector from "./CDSlideDisplayModeSelector";
import CampusDisplaySlideService from "../../../services/CampusDisplay/CampusDisplaySlideService";
import Toaster from "../../../services/Toaster";

const Wrapper = styled.div``;
const PopupBodyWrapper = styled.div``;

type campusDisplaySlideCreatePopupBtn = ButtonProps & {
  slides: iCampusDisplaySlide[];
  divClassName?: string;
  closeOnSaved?: boolean;
  display: iCampusDisplay;
  onSaved?: (updatedSlides: iCampusDisplaySlide[]) => void;
};
const CampusDisplaySlideEditPopupBtn = ({
  divClassName,
  slides,
  closeOnSaved = false,
  onSaved,
  display,
  ...rest
}: campusDisplaySlideCreatePopupBtn) => {
  const [showingPopup, setShowingPopup] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [changingSettings, setChangingSettings] = useState<{
    [key: string]: any;
  }>({});

  const handleClose = () => {
    setShowingPopup(false);
  };

  const doSave = () => {
    setIsSaving(true);
    Promise.all(slides.map(slide => {
      return CampusDisplaySlideService.update(slide.id, {
        settings: {
          ...(slide.settings || {}),
          ...changingSettings,
        }
      })
    })).then(resp => {
      if (closeOnSaved === true) {
        setShowingPopup(false);
      }
      if(onSaved) {
        onSaved(resp);
      }
    }).catch(err => {
      Toaster.showToast(err)
    }).finally(() => {
      setIsSaving(false);
    })
  };

  const getPopupContent = () => {
    return (
      <Row>
        <Col md={6} lg={6}>
          <FormLabel label={"Display Mode"} />
          <CDSlideDisplayModeSelector
            options={[]}
            value={changingSettings.displayMode}
            onChange={option =>
              setChangingSettings({
                ...changingSettings,
                displayMode: option.value
              })
            }
          />
        </Col>
      </Row>
    );
  };

  const getPopup = () => {
    if (showingPopup !== true) {
      return null;
    }
    return (
      <PopupModal
        show={showingPopup}
        size={'lg'}
        title={
          <h5>
            Updating {slides.length} slide{slides.length > 1 ? "s" : ""}
          </h5>
        }
        handleClose={() => handleClose()}
        footer={
          <FlexContainer className={"justify-content-between"}>
            <div />
            <div>
              <LoadingBtn
                isLoading={isSaving === true}
                variant={"link"}
                onClick={() => handleClose()}
              >
                <Icons.XLg /> Cancel
              </LoadingBtn>
            </div>

            <div>
              <LoadingBtn
                isLoading={isSaving === true}
                variant={"primary"}
                onClick={() => doSave()}
              >
                <Icons.Send /> Update
              </LoadingBtn>
            </div>
          </FlexContainer>
        }
      >
        <PopupBodyWrapper>{getPopupContent()}</PopupBodyWrapper>
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
