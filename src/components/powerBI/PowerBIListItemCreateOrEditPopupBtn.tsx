import { Alert, Button, ButtonProps, Image } from "react-bootstrap";
import iPowerBIReport from "../../types/PowerBI/iPowerBIReport";
import React, { useState } from "react";
import PopupModal from "../common/PopupModal";
import { ModalProps } from "react-bootstrap/Modal";
import UtilsService from "../../services/UtilsService";
import { FlexContainer } from "../../styles";
import PowerBIListItemEditPanel from "./PowerBIListItemEditPanel";
import * as Icons from "react-bootstrap-icons";
import { URL_POWER_BI_DISPLAY } from "../../Url";

type iPowerBIListItemCreatePopupBtn = ButtonProps & {
  report?: iPowerBIReport;
  popModalProps?: ModalProps;
  onSaved?: (report: iPowerBIReport) => void;
};

const PowerBIListItemCreateOrEditPopupBtn = ({
  report,
  onSaved,
  popModalProps,
  ...rest
}: iPowerBIListItemCreatePopupBtn) => {
  const [showingPopup, setShowingPopup] = useState(false);
  const [isConfirming, setIsConfirming] = useState(
    `${report?.id || ""}`.trim() === ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    if (isSubmitting === true) {
      return;
    }
    setShowingPopup(false);
    setIsConfirming(true);
    return;
  };

  const getPopupHeader = () => {
    if (report && `${report.id || ""}`.trim() !== "") {
      return (
        <FlexContainer className={"with-gap lg-gap align-items-center"}>
          <h6>Editing Report</h6>
          <Button
            variant={"secondary"}
            size={"sm"}
            target={"__BLANK"}
            href={UtilsService.getModuleUrl(
              URL_POWER_BI_DISPLAY.replace(":reportId", report.id),
              process.env.REACT_APP_URL || ""
            )}
          >
            <Icons.Link45deg /> View Report
          </Button>
        </FlexContainer>
      );
    }
    return <h6>Integrating a new Power BI into mConnect</h6>;
  };

  const getPopupContent = () => {
    if (isConfirming === true) {
      return (
        <>
          <Alert variant={"warning"}>
            <b>Step 1: Need to publish your Power BI report</b>, please make
            sure your new / existing report published onto cloud.
          </Alert>
          <p>
            Please make sure your new / existing report published onto cloud
            from your Power BI Desktop program.
            <Image
              src={UtilsService.getFullUrl(
                "images/powerBI/PowerBIReportPublish.png"
              )}
              style={{ width: "100%", height: "auto" }}
            />
          </p>
          <Alert variant={"warning"}>
            <b>Step 2: Share your published report with System User</b>
          </Alert>
          <p>
            Open a browser and navigate to{" "}
            <a href={"https://app.powerbi.com/"} target={"__BLANK"}>
              Power BI online
            </a>
            , and share with the user (studentprofilebi@mentonegirls.vic.edu.au)
            <Image
              src={UtilsService.getFullUrl(
                "images/powerBI/PowerBIReportSharing.png"
              )}
              style={{ width: "100%", height: "auto" }}
            />
          </p>
          <FlexContainer className={"justify-content-between"}>
            <div>
              <Button variant={"link"} onClick={() => setIsConfirming(false)}>
                Skip
              </Button>
            </div>
            <div>
              <Button variant={"link"} onClick={() => handleClose()}>
                Cancel
              </Button>
              <Button
                variant={"primary"}
                onClick={() => setIsConfirming(false)}
              >
                OK, done above steps
              </Button>
            </div>
          </FlexContainer>
        </>
      );
    }

    return (
      <>
        <PowerBIListItemEditPanel
          report={report}
          onSubmitting={() => {
            setIsSubmitting(true);
          }}
          isSubmitting={isSubmitting}
          onCancel={() => handleClose()}
          onSaved={report => {
            if (onSaved) {
              onSaved(report);
            }
          }}
        />
      </>
    );
  };

  const getPopupModal = () => {
    if (showingPopup !== true) {
      return null;
    }
    return (
      <PopupModal
        dialogClassName="modal-80w"
        {...popModalProps}
        show={showingPopup}
        header={getPopupHeader()}
        handleClose={handleClose}
      >
        {getPopupContent()}
      </PopupModal>
    );
  };

  return (
    <>
      <Button
        {...rest}
        onClick={() => {
          setShowingPopup(true);
          setIsConfirming(`${report?.id || ""}`.trim() === "");
        }}
      />
      {getPopupModal()}
    </>
  );
};

export default PowerBIListItemCreateOrEditPopupBtn;
