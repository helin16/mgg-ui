import {
  COD_TAB_COURT_ORDERS, COD_TAB_GOVERNMENT_FUNDING, COD_TAB_MEDICAL_DETAILS,
  COD_TAB_PARENT_DETAILS, COD_TAB_PERMISSIONS, COD_TAB_SIBLINGS,
  COD_TAB_STUDENT_DETAILS
} from './DetailsPanel/iCODDetailsEditPanel';
import CODStudentDetailsPanel from './DetailsPanel/CODStudentDetailsPanel';
import CODParentsDetailsPanel from './DetailsPanel/CODParentsDetailsPanel';
import CODLegalPanel from './DetailsPanel/CODLegalPanel';
import CODMedicalDetailsPanel from './DetailsPanel/CODMedicalDetailsPanel';
import CODSiblingsPanel from './DetailsPanel/CODSiblingsPanel';
import CODGovernmentFundingPanel from './DetailsPanel/CODGovernmentFundingPanel';
import CODPermissionsPanel from './DetailsPanel/CODPermissionsPanel';

const getSteps = () => {
  return [
    {key: COD_TAB_STUDENT_DETAILS, Component: CODStudentDetailsPanel, responseFieldName: 'student', isRequired: true},
    {key: COD_TAB_PARENT_DETAILS, Component: CODParentsDetailsPanel, responseFieldName: 'parents', isRequired: true},
    {key: COD_TAB_COURT_ORDERS, Component: CODLegalPanel, responseFieldName: 'courtOrder', isRequired: true},
    {key: COD_TAB_MEDICAL_DETAILS, Component: CODMedicalDetailsPanel, responseFieldName: 'medicalDetails', isRequired: true},
    {key: COD_TAB_SIBLINGS, Component: CODSiblingsPanel, responseFieldName: 'siblings'},
    {key: COD_TAB_GOVERNMENT_FUNDING, Component: CODGovernmentFundingPanel, responseFieldName: 'governmentFunding', isRequired: true},
    {key: COD_TAB_PERMISSIONS, Component: CODPermissionsPanel, responseFieldName: 'permissions', isRequired: true },
  ]
}

const CODFormHelper = {
  getSteps,
}

export default CODFormHelper;
