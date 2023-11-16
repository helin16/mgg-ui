import iConfirmationOfDetailsResponse from '../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse';

type ICODDetailsEditPanel = {
  response: iConfirmationOfDetailsResponse;
  isDisabled?: boolean;
  isForParent?: boolean;
  onCancel?: () => void;
  onNextStep?: () => void;
  onSaved?: (resp: iConfirmationOfDetailsResponse) => void;
}

export default ICODDetailsEditPanel;
