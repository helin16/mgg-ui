import iConfirmationOfDetailsResponse from '../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse';
import {iErrorMap} from '../../form/FormErrorDisplay';

export const COD_TAB_STUDENT_DETAILS = "Student Details";
export const COD_TAB_PARENT_DETAILS = "Parent Details";
export const COD_TAB_COURT_ORDERS = "Court Orders";
export const COD_TAB_MEDICAL_DETAILS = "Medical Details";
export const COD_TAB_SIBLINGS = "Siblings";
export const COD_TAB_GOVERNMENT_FUNDING = "Government Funding";
export const COD_TAB_PERMISSIONS = "Permissions";


type ICODDetailsEditPanel = {
  response: iConfirmationOfDetailsResponse;
  responseFieldName: string;
  isDisabled?: boolean;
  isForParent?: boolean;
  errorMap?: iErrorMap;
  getCancelBtn?: (
    editingResponse: iConfirmationOfDetailsResponse,
    responseFieldName: string,
    isLoading?: boolean
  ) => any;
  getSubmitBtn?: (
    editingResponse: iConfirmationOfDetailsResponse,
    responseFieldName: string,
    isLoading?: boolean,
    preSubmitFn?: (data: any) => boolean
  ) => any;
}

export default ICODDetailsEditPanel;
