import { FlexContainer } from "../../../styles";
import * as Icons from "react-bootstrap-icons";
import styled from "styled-components";
import PopupModal from "../../../components/common/PopupModal";
import LoadingBtn from "../../../components/common/LoadingBtn";
import iSynVDonorReceipt from "../../../types/Synergetic/Finance/iSynVDonorReceipt";
import { useEffect, useState } from "react";
import MggsModuleService from "../../../services/Module/MggsModuleService";
import { MGGS_MODULE_ID_ONLINE_DONATION } from "../../../types/modules/iModuleUser";
import Toaster from "../../../services/Toaster";
import PageLoadingSpinner from "../../../components/common/PageLoadingSpinner";
import FormLabel from "../../../components/form/FormLabel";
import SelectBox from "../../../components/common/SelectBox";
import SectionDiv from "../../../components/common/SectionDiv";

type iMap = { [key: number]: { [key: string]: iSynVDonorReceipt[] } };
type iDonorReceiptsSendingPopup = {
  handleClose?: () => void;
  show?: boolean;
  receiptMap: iMap;
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
  show = false,
  receiptMap
}: iDonorReceiptsSendingPopup) => {
  const [moduleSettings, setModuleSettings] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [donorMap, setDonorMap] = useState<{
    [key: number]: iSynVDonorReceipt;
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

        const receipt = receipts[0];
        return receipt;
      })
      .filter(item => item !== null);
    setSelectedDonor(donorArr.length > 0 ? donorArr[0] : null);
    setDonorMap(
      donorArr.reduce((map, item) => {
        return {
          ...map,
          [item?.DonorID]: item
        };
      }, {})
    );
  }, [receiptMap]);

  const doSave = () => {};

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
            options={Object.values(donorMap).map(donor => ({
              label: donor.DonorMailName,
              value: donor.DonorID
            }))}
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
                event.value in donorMap ? donorMap[event.value] : null
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

    return (
      <>
        <div className={"content-wrapper"}>{getEmailPreview()}</div>
        <FlexContainer
          className={"justify-content-end gap-2 align-items-center space-above"}
        >
          {handleClose && (
            <LoadingBtn
              variant={"link"}
              onClick={() => handleClose()}
            >
              <Icons.XLg /> Cancel
            </LoadingBtn>
          )}
          <LoadingBtn variant={"primary"} onClick={() => doSave()}>
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
      handleClose={() => handleClose && handleClose()}
      header={
        <b>
          Sending Receipts to {Object.keys(receiptMap)?.length || 0} Donor(s)
        </b>
      }
    >
      <Wrapper>{getContent()}</Wrapper>
    </PopupModal>
  );
};

export default DonorReceiptsSendingPopup;
