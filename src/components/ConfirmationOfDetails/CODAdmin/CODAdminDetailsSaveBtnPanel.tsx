import { FlexContainer } from "../../../styles";
import React from "react";
import iConfirmationOfDetailsResponse from "../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse";

type iCODAdminDetailsSaveBtnPanel = {
  editingResponse: iConfirmationOfDetailsResponse;
  responseFieldName: string;
  getCancelBtn?: (
    editingResponse: iConfirmationOfDetailsResponse,
    responseFieldName: string,
    isLoading?: boolean
  ) => any;
  getSubmitBtn?: (
    editingResponse: iConfirmationOfDetailsResponse,
    responseFieldName: string,
    isLoading?: boolean
  ) => any;
  isLoading?: boolean;
};
const CODAdminDetailsSaveBtnPanel = ({
  editingResponse,
  getCancelBtn,
  getSubmitBtn,
  isLoading,
  responseFieldName
}: iCODAdminDetailsSaveBtnPanel) => {
  // const isSyncdLabel = `${syncdLabel || ""}`.trim() !== "";

  // const doSync = () => {
  //   if (onSubmitting) {
  //     onSubmitting(true);
  //   }
  //   syncFn(editingResponse)
  //     .then(resp => {
  //       onSaved && onSaved(resp);
  //     })
  //     .catch(err => {
  //       Toaster.showApiError(err);
  //     })
  //     .finally(() => {
  //       if (onSubmitting) {
  //         onSubmitting(false);
  //       }
  //     });
  // };

  // const getBtns = () => {
  // if (
  //   `${editingResponse.syncToSynAt || ""}`.trim() !== "" ||
  //   `${editingResponse.syncToSynById || ""}`.trim() !== ""
  // ) {
  //   return (
  //     <FlexContainer
  //       className={"justify-content-end with-gap lg-gap align-items-baseline"}
  //     >
  //       <small className={"text-muted"}>
  //         Sync'd @ {moment(editingResponse.syncToSynAt).format("lll")} By{" "}
  //         {editingResponse.SyncToSynBy?.NameInternal || ""}
  //       </small>
  //       {getCancelBtn && getCancelBtn()}
  //     </FlexContainer>
  //   );
  // }

  // if (isSyncdLabel === true) {
  //   return (
  //     <FlexContainer
  //       className={"justify-content-end with-gap lg-gap align-items-baseline"}
  //     >
  //       <h6 className={"text-muted"}>{syncdLabel || ""}</h6>
  //       {onNext && (
  //         <Button variant={"light"} onClick={() => onNext()}>
  //           Skip <Icons.CaretRightFill />
  //         </Button>
  //       )}
  //     </FlexContainer>
  //   );
  // }
  // return (
  //   <div>
  //     {getCancelBtn && getCancelBtn(isLoading)}
  //     {getSubmitBtn && getSubmitBtn(editingResponse, isLoading)}
  //   </div>
  // );
  // };

  return (
    <FlexContainer
      className={
        "justify-content-between space-above align-items-center cod-submit-btns-wrapper"
      }
    >
      <div />
      <div>
        {getCancelBtn && getCancelBtn(editingResponse, responseFieldName, isLoading)}
        {getSubmitBtn &&
          getSubmitBtn(editingResponse, responseFieldName, isLoading)}
      </div>
    </FlexContainer>
  );
};

export default CODAdminDetailsSaveBtnPanel;
