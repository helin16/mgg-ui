import Page from "../../layouts/Page";
import CampusDisplayManagementAdminPage from "./CampusDisplayManagementAdminPage";
import { MGGS_MODULE_ID_CAMPUS_DISPLAY } from "../../types/modules/iModuleUser";
import PanelTitle from "../../components/PanelTitle";
import { FlexContainer } from "../../styles";
import CampusDisplaySelector from "../../components/CampusDisplay/CampusDisplaySelector";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import iCampusDisplay from "../../types/CampusDisplay/iCampusDisplay";
import SchoolLogo from "../../components/SchoolLogo";
import CampusDisplayEditPanel from "../../components/CampusDisplay/CampusDisplayEditPanel";
import iCampusDisplaySlide from "../../types/CampusDisplay/iCampusDisplaySlide";
import * as Icons from "react-bootstrap-icons";
import CampusDisplaySlideEditPopupBtn from '../../components/CampusDisplay/CampusDisplaySlideEditPopupBtn';
import MathHelper from '../../helper/MathHelper';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DeleteConfirmPopupBtn from '../../components/common/DeleteConfirm/DeleteConfirmPopupBtn';
import {Alert} from 'react-bootstrap';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/makeReduxStore';
import CampusDisplaySlideService from '../../services/CampusDisplay/CampusDisplaySlideService';
import CampusDisplayingAtLocationPopupBtn from '../../components/CampusDisplay/CampusDisplayingAtLocationPopupBtn';

const Wrapper = styled.div`
  h6 {
    margin: 0px;
  }

  .content-wrapper {
    margin-top: 1rem;
  }

  .selecting-display {
    margin: 0px auto;
    text-align: center;
    .logo {
      width: 80%;
      max-width: 200px;
      min-width: 120px;
      margin-bottom: 1.3rem;
    }
  }

  .campus-display-selector {
    width: 200px;
    [class$="-menu"] {
      [class$="-option"] {
        color: black;
      }
    }
  }
  .showing-at-location {
    color: white !important;
  }
`;
const CampusDisplayManagementPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [showingDisplay, setShowingDisplay] = useState<iCampusDisplay | null>(
    null
  );
  const [count, setCount] = useState(0);
  const [showBulkOptions, setShowBulkOptions] = useState(false);
  const [selectedSlides, setSelectedSlides] = useState<iCampusDisplaySlide[]>(
    []
  );

  useEffect(() => {
    setShowBulkOptions(false);
    setSelectedSlides([]);
  }, [showingDisplay]);

  const getContent = () => {
    if (!showingDisplay || `${showingDisplay?.id || ""}`.trim() === "") {
      return (
        <div className={"selecting-display"}>
          <div>
            <SchoolLogo className={"logo"} />
            <h3 className={"text-center text-muted"}>
              Please select a display above to edit
            </h3>
          </div>
        </div>
      );
    }
    return (
      <CampusDisplayEditPanel
        campusDisplay={showingDisplay}
        onSetShowingBulkOptions={(showing) => setShowBulkOptions(showing)}
        onSlidesSelected={slides => setSelectedSlides(slides)}
        selectedSlides={selectedSlides}
        showingBulkOptions={showBulkOptions}
        forceReload={count}
      />
    );
  };

  const getShowBulkOptionCheck = () => {
    if (!showingDisplay || `${showingDisplay?.id || ''}`.trim() === '') {
      return null;
    }
    return (
      <FlexContainer
        className={"cursor-pointer with-gap align-items-center"}
        onClick={() => setShowBulkOptions(!showBulkOptions)}
      >
        {showBulkOptions === true ? (
          <Icons.CheckSquareFill />
        ) : (
          <Icons.Square />
        )}
        <div>Bulk Actions</div>
      </FlexContainer>
    );
  };

  const getNewSlidesBtn = () => {
    if (!showingDisplay || `${showingDisplay?.id || ''}`.trim() === '') {
      return null;
    }
    return (
      <CampusDisplaySlideEditPopupBtn
        display={showingDisplay}
        variant={"success"}
        size={'sm'}
        closeOnSaved
        onSaved={() => setCount(MathHelper.add(count, 1))}
      >
        <Icons.Plus /> New
      </CampusDisplaySlideEditPopupBtn>
    )
  }

  const getDisplayToLocationSelector = () => {
    if (!showingDisplay || `${showingDisplay?.id || ''}`.trim() === '') {
      return null;
    }
    return (
      <CampusDisplayingAtLocationPopupBtn displayId={showingDisplay?.id} variant={'link'} size={'sm'} className={'showing-at-location'}/>
    )
  }

  const doDelete = (slides: iCampusDisplaySlide[]) => {
    return Promise.all(slides.map(slide => {
      return CampusDisplaySlideService.deactivate(slide.id);
    }))
  }

  const getBulkOptions = () => {
    if (!showingDisplay || `${showingDisplay?.id || ''}`.trim() === '' || selectedSlides.length <= 0) {
      return null;
    }
    return (
      <ButtonGroup
        className={'bulk-options-btns'}
      >
        <DeleteConfirmPopupBtn
          variant={"danger"}
          deletingFn={() => doDelete(selectedSlides)}
          deletedCallbackFn={() => setCount(MathHelper.add(count, 1))}
          size={"sm"}
          description={
            <>
              <h5>You are about to permanently delete these {selectedSlides.length} slide(s)</h5>
              <Alert variant={'danger'}>
                This action can NOT be reversed.
              </Alert>
            </>
          }
          confirmString={`${user?.synergyId || 'na'}`}
        >
          <Icons.Trash /> Delete {selectedSlides.length} slide(s)
        </DeleteConfirmPopupBtn>
      </ButtonGroup>
    )
  }

  return (
    <Page
      title={<h3>Campus Display Management</h3>}
      AdminPage={CampusDisplayManagementAdminPage}
      moduleId={MGGS_MODULE_ID_CAMPUS_DISPLAY}
    >
      <Wrapper>
        <PanelTitle>
          <FlexContainer
            className={"justify-content-between align-items-center"}
          >
            <FlexContainer className={"with-gap lg-gap align-items-center"}>
              <h6>Display</h6>
              <CampusDisplaySelector
                className={"campus-display-selector"}
                values={showingDisplay ? [showingDisplay?.id] : undefined}
                onSelect={option => {
                  // @ts-ignore
                  setShowingDisplay(option.data || null);
                }}
              />
              {getNewSlidesBtn()}
              {getDisplayToLocationSelector()}
            </FlexContainer>
            <FlexContainer className={'justify-content-between align-items-center with-gap lg-gap'}>
              {getShowBulkOptionCheck()}
              {getBulkOptions()}
            </FlexContainer>
          </FlexContainer>
        </PanelTitle>

        <div className={"content-wrapper"}>{getContent()}</div>
      </Wrapper>
    </Page>
  );
};

export default CampusDisplayManagementPage;
