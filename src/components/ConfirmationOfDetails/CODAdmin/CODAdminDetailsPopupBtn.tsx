import { Button, ButtonProps } from "react-bootstrap";
import iConfirmationOfDetailsResponse from "../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse";
import { useState } from "react";
import PopupModal from "../../common/PopupModal";
import { FlexContainer } from "../../../styles";
import moment from "moment-timezone";
import CODAdminDetailsPanel from './CODAdminDetailsPanel';

type iCODAdminDetailsPopupBtn = ButtonProps & {
  response: iConfirmationOfDetailsResponse;
  onRefreshList?: () => void;
};

const CODAdminDetailsPopupBtn = ({
  response,
  onRefreshList,
  ...rest
}: iCODAdminDetailsPopupBtn) => {
  const [showingPopup, setShowingPopup] = useState(false);

  const getSubmittedInfo = () => {
    const submittedAtString =
      `${response.submittedAt || ""}`.trim() === ""
        ? ""
        : `@ ${moment(response.submittedAt).format("lll")}`;
    const submittedByStr =
      `${response.SubmittedBy || ""}`.trim() === ""
        ? ""
        : `By ${response.SubmittedBy?.NameInternal}`;
    if (submittedAtString === "") {
      return null;
    }

    return <small>Submitted {submittedByStr} {submittedAtString}</small>;
  };

  const handleClose = (reloadList = false) => {
    setShowingPopup(false);
    if (onRefreshList && reloadList === true) {
      onRefreshList();
    }
  }

  const getPopup = () => {
    if (showingPopup !== true) {
      return null;
    }

    return (
      <PopupModal
        show={showingPopup === true}
        handleClose={() => handleClose(false)}
        dialogClassName="modal-80w"
        header={
          <FlexContainer className="justify-content-between full-width align-items-center">
            <h5 style={{margin: '0px'}}>COD: {response.Student?.StudentNameInternal || ""} [{response.StudentID}]</h5>
            {getSubmittedInfo()}
          </FlexContainer>
        }
      >
        <CODAdminDetailsPanel response={response} onCancel={() => handleClose()} onRefreshList={onRefreshList}/>
      </PopupModal>
    );
  };

  return (
    <>
      <Button {...rest} onClick={() => setShowingPopup(true)} />
      {getPopup()}
    </>
  );
};

export default CODAdminDetailsPopupBtn;
