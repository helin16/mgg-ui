import iConfirmationOfDetailsResponse from '../../../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse';

type iCODAdminStudentDetailsPanel = {
  response: iConfirmationOfDetailsResponse;
  onNext: (response: iConfirmationOfDetailsResponse) => void;
  onSaved: (response: iConfirmationOfDetailsResponse) => void;
  onCancel: (response?: iConfirmationOfDetailsResponse) => void;
  onRefreshList?: () => void;
}

export default iCODAdminStudentDetailsPanel;
