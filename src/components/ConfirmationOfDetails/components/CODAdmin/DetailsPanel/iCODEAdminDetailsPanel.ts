import iConfirmationOfDetailsResponse from '../../../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse';

type iCODAdminStudentDetailsPanel = {
  response: iConfirmationOfDetailsResponse;
  onSaved: (response: iConfirmationOfDetailsResponse) => void;
  onCancel: (response?: iConfirmationOfDetailsResponse) => void;
  onRefreshList?: () => void;
}

export default iCODAdminStudentDetailsPanel;
