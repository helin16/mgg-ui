import { FlexContainer } from "../../../styles";
import * as Icons from "react-bootstrap-icons";
import styled from "styled-components";
import PopupModal from "../../../components/common/PopupModal";
import LoadingBtn from "../../../components/common/LoadingBtn";
import iSynVDonorReceipt from "../../../types/Synergetic/Finance/iSynVDonorReceipt";
import { useEffect, useState } from "react";
import MggsModuleService from "../../../services/Module/MggsModuleService";
import { MGGS_MODULE_ID_ONLINE_DONATION } from "../../../types/modules/iModuleUser";
import Toaster, {TOAST_TYPE_ERROR, TOAST_TYPE_SUCCESS} from "../../../services/Toaster";
import PageLoadingSpinner from "../../../components/common/PageLoadingSpinner";
import FormLabel from "../../../components/form/FormLabel";
import SelectBox from "../../../components/common/SelectBox";
import SectionDiv from "../../../components/common/SectionDiv";
import { Alert, FormControl } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/makeReduxStore";
import UtilsService from "../../../services/UtilsService";
import SynDonorReceiptService from "../../../services/Synergetic/Finance/SynDonorReceiptService";
import moment from "moment-timezone";
import * as _ from "lodash";

type iMap = { [key: number]: { [key: string]: iSynVDonorReceipt[] } };
type iDonorReceiptsSendingPopup = {
  handleClose?: () => void;
  show?: boolean;
  receiptMap: iMap;
  fromDate: string;
  toDate: string;
};

const Wrapper = styled.div`
  .email-preview-body {
    overflow: auto;
    max-height: 500px;
    background-color: #efefef;
  }
  .email-preview-subject {
    background-color: #efefef;
    color: #999;
  }
`;

const DonorReceiptsSendingPopup = ({
  handleClose,
  fromDate,
  toDate,
  show = false,
  receiptMap
}: iDonorReceiptsSendingPopup) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [moduleSettings, setModuleSettings] = useState<any | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testingEmail, setTestingEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [donorMap, setDonorMap] = useState<{
    [key: number]: iSynVDonorReceipt[];
  }>({});
  const [selectedDonor, setSelectedDonor] = useState<iSynVDonorReceipt | null>(
    null
  );

  useEffect(() => {
    let isCanceled = false;

    setIsLoading(true);
    MggsModuleService.getModule(MGGS_MODULE_ID_ONLINE_DONATION)
      .then(res => {
        if (isCanceled) return;
        setModuleSettings(res.settings || {});
      })
      .catch(err => {
        if (isCanceled) return;
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) return;
        setIsLoading(false);
      });

    return () => {
      isCanceled = true;
    };
  }, []);

  useEffect(() => {
    const donorArr = Object.keys(receiptMap)
      .map(key => {
        // @ts-ignore
        const map = key in receiptMap ? receiptMap[key] : {};

        const fundCodes = Object.keys(map);
        if (fundCodes.length <= 0) {
          return null;
        }

        const fundCode = fundCodes[0];
        const receipts = fundCode in map ? map[fundCode] : [];
        if (receipts.length <= 0) {
          return null;
        }

        const receipt = {
          ...receipts[0],
          ...(fundCodes.length > 1
            ? { ReceiptFundDescription: `Multiple funds` }
            : {})
        };
        return receipt;
      })
      .filter(item => item !== null);
    setSelectedDonor(donorArr.length > 0 ? donorArr[0] : null);
    setDonorMap(
      donorArr.reduce((map, item) => {
        const key = item?.DonorID;
        return {
          ...map,
          [key]: _.uniqBy(
            [...(key in map ? map[key] : []), item],
            i => i.ReceiptSeq
          )
        };
      }, {})
    );
  }, [receiptMap]);

  const doClosePopup = () => {
    if (isSubmitting === true) {
      return;
    }
    setIsTesting(false);
    setTestingEmail("");
    handleClose && handleClose();
  };

  const doSave = () => {
    if (isTesting === true) {
      const emailString = `${testingEmail || ""}`.trim();
      if (emailString === "") {
        Toaster.showToast("Testing email needed.", TOAST_TYPE_ERROR);
        return;
      }
      if (!UtilsService.validateEmail(emailString)) {
        Toaster.showToast("Invalid testing email address.", TOAST_TYPE_ERROR);
        return;
      }
    }
    setIsSubmitting(true);
    Promise.all(
      Object.keys(donorMap).map(donorId => {
        const receipts: iSynVDonorReceipt[] =
          // @ts-ignore
          donorId in donorMap ? donorMap[donorId] : [];
        return SynDonorReceiptService.sendEmail({
          to:
            `${testingEmail || ""}`.trim() !== ""
              ? `${testingEmail || ""}`.trim()
              : receipts[0].DonorDefaultEmail || '',
          donorId,
          fromDate: moment(fromDate).format("YYYY-MM-DD"),
          toDate: moment(toDate).format("YYYY-MM-DD"),
          // receiptNumbers: receipts.map(receipt => receipt.ReceiptNo)
          receiptNumbers: [],
        })
      })
    ).then(() => {
      Toaster.showToast(`${Object.keys(donorMap).length} Email(s) has been queued.`, TOAST_TYPE_SUCCESS);
      setIsSubmitting(false);
      doClosePopup();
    })
      .catch(err => {
        setIsSubmitting(false);
        Toaster.showApiError(err);
      });
  };

  const getEmailPreview = () => {
    const donorMailNameHolder = "{{DONOR_MAIL_NAME}}";
    const fundNameHolder = "{{DONATION_RECEIPT_FUND_NAME}}";
    const emailSubject = `${moduleSettings?.donationReceipts?.emailSubject ||
      ""}`.trim();
    const emailBody = `${moduleSettings?.donationReceipts?.emailBody?.html ||
      ""}`
      .trim()
      .replace(
        donorMailNameHolder,
        selectedDonor?.DonorMailName || donorMailNameHolder
      )
      .replace(
        fundNameHolder,
        selectedDonor?.ReceiptFundDescription || fundNameHolder
      );

    return (
      <div className={"email-preview"}>
        <div>
          <FormLabel label={"Select a donor"} />
          <SelectBox
            options={Object.values(donorMap).map(receipts => {
              return {
                label: receipts.length > 0 ? receipts[0].DonorMailName : "",
                value: receipts.length > 0 ? receipts[0].DonorID : ""
              };
            })}
            value={
              selectedDonor === null
                ? null
                : {
                    label: selectedDonor.DonorMailName,
                    value: selectedDonor.DonorID
                  }
            }
            onChange={event => {
              setSelectedDonor(
                event.value in donorMap &&
                  donorMap[event.value] &&
                  donorMap[event.value].length > 0
                  ? donorMap[event.value][0]
                  : null
              );
            }}
          />
        </div>
        <SectionDiv>
          <FormLabel label={"Previewing Email Subject"} />
          <div
            className={"email-preview-subject form-control"}
            dangerouslySetInnerHTML={{ __html: emailSubject }}
          />
        </SectionDiv>
        <SectionDiv>
          <FormLabel label={"Previewing Email Body"} />
          <div
            className={"email-preview-body form-control"}
            dangerouslySetInnerHTML={{ __html: emailBody }}
          />
        </SectionDiv>
      </div>
    );
  };

  const getContent = () => {
    if (isLoading) {
      return <PageLoadingSpinner />;
    }

    if (isSubmitting === true) {
      return (
        <Alert variant={"danger"}>
          <h5>DO NOT CLOSE THIS WINDOW.</h5>
          <div>Please don't close this window, until this is done.</div>
        </Alert>
      );
    }

    return (
      <>
        <div className={"content-wrapper"}>{getEmailPreview()}</div>
        <FlexContainer
          className={"justify-content-end gap-2 align-items-center space-above"}
        >
          {handleClose && (
            <LoadingBtn
              variant={"link"}
              onClick={doClosePopup}
              isLoading={isSubmitting}
            >
              <Icons.XLg /> Cancel
            </LoadingBtn>
          )}
          <LoadingBtn
            variant={"primary"}
            onClick={() => doSave()}
            isLoading={isSubmitting}
          >
            <Icons.Send /> Send to {Object.keys(receiptMap)?.length || 0}{" "}
            donor(s)
          </LoadingBtn>
        </FlexContainer>
      </>
    );
  };

  return (
    <PopupModal
      show={show}
      dialogClassName={"modal-80w"}
      handleClose={doClosePopup}
      header={
        <FlexContainer className={"gap-2 align-items-center"}>
          <b>
            Sending Receipts to {Object.keys(receiptMap)?.length || 0} Donor(s)
          </b>
          <FlexContainer
            className={"gap-1 align-items-center cursor-pointer"}
            onClick={() => {
              if (isTesting === false) {
                setIsTesting(true);
                setTestingEmail(user?.SynCommunity?.OccupEmail || "");
                return;
              }
              setIsTesting(false);
              setTestingEmail("");
            }}
          >
            {isTesting === true ? (
              <Icons.CheckSquareFill className={"text-success"} />
            ) : (
              <Icons.Square />
            )}
            <span>is testing email</span>
          </FlexContainer>
          {isTesting === true ? (
            <FormControl
              value={testingEmail}
              placeholder={"Please type in recipient for the testing email"}
              style={{ width: "200px" }}
              onChange={event => setTestingEmail(event.target.value || "")}
            />
          ) : null}
        </FlexContainer>
      }
    >
      <Wrapper>{getContent()}</Wrapper>
    </PopupModal>
  );
};

export default DonorReceiptsSendingPopup;
