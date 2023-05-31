import styled from 'styled-components';
import ExplanationPanel from '../../components/ExplanationPanel';
import {useState} from 'react';
import SchoolDataSubmissionsAdminPage from './SchoolDataSubmissionsAdminPage';
import ModuleAdminBtn from '../../components/module/ModuleAdminBtn';
import {MGGS_MODULE_ID_SCHOOL_DATA_SUBMISSION} from '../../types/modules/iModuleUser';
import SchoolDataSubmissionsPanel from './components/SchoolDataSubmissionsPanel';

const Wrapper = styled.div``

const SchoolDataSubmissionsPage = () => {

  const [showingAdminPage, setShowingAdminPage] = useState(false);

  if (showingAdminPage === true) {
    return <SchoolDataSubmissionsAdminPage onNavBack={() => setShowingAdminPage(false)}/>;
  }

  return (
    <Wrapper className={'school-data-submission-page'}>
      <h3>
        School Data Submission
        <ModuleAdminBtn
          onClick={() => setShowingAdminPage(true)}
          moduleId={MGGS_MODULE_ID_SCHOOL_DATA_SUBMISSION}
          className={'float-right'}
        />
      </h3>
      <SchoolDataSubmissionsPanel />
    </Wrapper>
  )
}

export default SchoolDataSubmissionsPage;
