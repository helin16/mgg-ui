import Page from "../../layouts/Page";
import CampusDisplayManagementAdminPage from "./CampusDisplayManagementAdminPage";
import { MGGS_MODULE_ID_CAMPUS_DISPLAY } from "../../types/modules/iModuleUser";
import PanelTitle from "../../components/PanelTitle";
import { FlexContainer } from "../../styles";
import CampusDisplaySelector from "../../components/CampusDisplay/CampusDisplaySelector";
import styled from "styled-components";
import { useState } from "react";
import iCampusDisplay from "../../types/CampusDisplay/iCampusDisplay";
import SchoolLogo from "../../components/SchoolLogo";
import CampusDisplayEditPanel from '../../components/CampusDisplay/CampusDisplayEditPanel';

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
`;
const CampusDisplayManagementPage = () => {
  const [showingDisplay, setShowingDisplay] = useState<iCampusDisplay | null>(
    null
  );

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
    return <CampusDisplayEditPanel campusDisplay={showingDisplay} />
  };

  return (
    <Page
      title={<h3>Campus Display Management</h3>}
      AdminPage={CampusDisplayManagementAdminPage}
      moduleId={MGGS_MODULE_ID_CAMPUS_DISPLAY}
    >
      <Wrapper>
        <PanelTitle>
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
          </FlexContainer>
        </PanelTitle>

        <div className={'content-wrapper'}>{getContent()}</div>
      </Wrapper>
    </Page>
  );
};

export default CampusDisplayManagementPage;
