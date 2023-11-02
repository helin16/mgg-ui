import {FlexContainer} from '../../../../../styles';
import React from 'react';
import iConfirmationOfDetailsResponse from '../../../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse';
import LoadingBtn from '../../../../common/LoadingBtn';
import * as Icons from 'react-bootstrap-icons';

type iCODAdminDetailsSaveBtnPanel = {
  editingResponse: iConfirmationOfDetailsResponse;
  onSaved: (response: iConfirmationOfDetailsResponse) => void;
  onCancel: (response?: iConfirmationOfDetailsResponse) => void;
  syncdLabel?: string;
  isLoading?: boolean;
}
const CODAdminDetailsSaveBtnPanel = ({editingResponse, onSaved, onCancel, syncdLabel, isLoading = false}: iCODAdminDetailsSaveBtnPanel) => {
  const isSyncdLabel = `${syncdLabel || ''}`.trim() !== '';

  const getBtns = () => {
    if (isSyncdLabel === true) {
      return <h6 className={'text-muted'}>{syncdLabel || ''}</h6>
    }
    return (
      <div>
        <LoadingBtn isLoading={isLoading} variant={'link'} onClick={() => onCancel(editingResponse)}>
          <Icons.XLg /> Cancel
        </LoadingBtn>
      </div>
    )
  }

  return (
    <FlexContainer className={'justify-content-between space-above align-items-center'}>
      <div />
      {getBtns()}
    </FlexContainer>
  )
}

export default CODAdminDetailsSaveBtnPanel;
