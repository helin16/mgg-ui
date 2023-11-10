import { FlexContainer } from "../../../styles";
import React from "react";
import iConfirmationOfDetailsResponse from "../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse";
import LoadingBtn from "../../common/LoadingBtn";
import * as Icons from "react-bootstrap-icons";
import {Button} from 'react-bootstrap';
import Toaster from '../../../services/Toaster';
import moment from 'moment-timezone';

type iCODAdminDetailsSaveBtnPanel = {
  editingResponse: iConfirmationOfDetailsResponse;
  onNext: (response: iConfirmationOfDetailsResponse) => void;
  onSaved: (response: iConfirmationOfDetailsResponse) => void;
  onCancel: (response?: iConfirmationOfDetailsResponse) => void;
  syncFn: (response: iConfirmationOfDetailsResponse) => Promise<iConfirmationOfDetailsResponse>;
  syncdLabel?: string;
  isLoading?: boolean;
  onSubmitting?: (submitting: boolean) => void;
};
const CODAdminDetailsSaveBtnPanel = ({
  editingResponse,
  syncFn,
  onNext,
  onSubmitting,
  onSaved,
  onCancel,
  syncdLabel,
  isLoading = false
}: iCODAdminDetailsSaveBtnPanel) => {
  const isSyncdLabel = `${syncdLabel || ""}`.trim() !== "";

  const doSync = () => {
    if (onSubmitting) {
      onSubmitting(true);
    }
    syncFn(editingResponse)
      .then(resp => {
        onSaved(resp);
      })
      .catch(err => {
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (onSubmitting) {
          onSubmitting(false);
        }
      })
  }

  const getBtns = () => {
    if (`${editingResponse.syncToSynAt || ''}`.trim() !== '' || `${editingResponse.syncToSynById || ''}`.trim() !== '') {
      return (
        <FlexContainer className={"justify-content-end with-gap lg-gap align-items-baseline"}>
          <small className={"text-muted"}>Sync'd @ {moment(editingResponse.syncToSynAt).format('lll')} By {editingResponse.SyncToSynBy?.NameInternal || ''}</small>
          <Button variant={'light'} onClick={() => onCancel(editingResponse)}><Icons.XLg /> Close</Button>
        </FlexContainer>
      );
    }

    if (isSyncdLabel === true) {
      return (
        <FlexContainer className={"justify-content-end with-gap lg-gap align-items-baseline"}>
          <h6 className={"text-muted"}>{syncdLabel || ""}</h6>
          <Button variant={'light'} onClick={() => onNext(editingResponse)}>Skip <Icons.CaretRightFill /></Button>
        </FlexContainer>
      );
    }
    return (
      <div>
        <LoadingBtn
          isLoading={isLoading}
          variant={"link"}
          onClick={() => onCancel(editingResponse)}
        >
          <Icons.XLg /> Cancel
        </LoadingBtn>

        <LoadingBtn
          isLoading={isLoading}
          variant={"primary"}
          onClick={() => doSync()}
        >
          <Icons.Send /> Sync to Synergetic
        </LoadingBtn>
      </div>
    );
  };

  return (
    <FlexContainer
      className={"justify-content-between space-above align-items-center"}
    >
      <div />
      {getBtns()}
    </FlexContainer>
  );
};

export default CODAdminDetailsSaveBtnPanel;
