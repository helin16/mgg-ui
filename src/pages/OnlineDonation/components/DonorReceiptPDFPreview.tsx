import styled from "styled-components";
import { FlexContainer } from "../../../styles";
import * as _ from "lodash";
import MathHelper from '../../../helper/MathHelper';
import UtilsService from '../../../services/UtilsService';

type iDonorReceiptPDFPreview = {
  header?: string;
  footer?: string;
  className?: string;
};

const Wrapper = styled.div`
  background-color: white;
  height: 100%;
  padding: 3rem 2rem;
    
  .amt {
      text-align: right;
      width: 20% !important;
  }
  .preview-row {
      width: 100%;
      &.tbl-header {
          font-weight: bold;
          margin-bottom: 0.4rem;
      }
      .receiptNo,
      .date {
          width: 20% !important;
      }
      .appeal {
          width: 40% !important;
      }
  }
    
  .summary {
      margin: 0.4rem 0px;
      padding: 0.4rem 0px;
      border-top: 1px solid #000;
      border-bottom: 1px solid #000;
      font-weight: bold;
  }
`;
const DonorReceiptPDFPreview = ({
  header,
  footer,
  className
}: iDonorReceiptPDFPreview) => {
  const testingFundName = "Testing Fund Name";
  const currentYear = new Date().getFullYear();

  const getHTML = (html?: string) => {
    return `${html || ""}`
      .trim()
      .replace("{{DONATION_RECEIPT_FUND_NAME}}", testingFundName);
  };

  const getTableRow = (
    item: { date: string; receiptNo: string; appeal: string; amt: number | string },
    className?: string
  ) => {
    return (
      <FlexContainer className={`preview-row ${className || ""}`}>
        <div className={'date'}>{item.date}</div>
        <div className={'receiptNo'}>{item.receiptNo}</div>
        <div className={'appeal'}>{item.appeal}</div>
        <div className={'amt'}>{UtilsService.isNumeric(`${item.amt}`) ? `$${item.amt}.00` : item.amt}</div>
      </FlexContainer>
    );
  };

  const items = _.range(1, 9).map(index => ({
    date: `0${index}/07/${currentYear}`,
    receiptNo: `${_.random(99999999)}`,
    appeal: 'Voluntary Building Fund Donation',
    amt: index,
  }))

  return (
    <Wrapper className={className}>
      <div
        dangerouslySetInnerHTML={{ __html: getHTML(header) }}
        className={"preview-header"}
      />
      <div>
        <b>From:</b> Mr Anderson
      </div>
      <div className={"receipts-table"}>
        {getTableRow(
          {
            date: "Receipt Date",
            appeal: "Appeal",
            amt: "Receipt Amount",
            receiptNo: "Receipt Number"
          },
          "tbl-header"
        )}
        {items.map(item => getTableRow(item))}
      </div>
      <FlexContainer className={"summary full-width justify-content-between"}>
        <div>Total receipts to {testingFundName} 1/07/{currentYear - 1} to 30/06/{currentYear}</div>
        <div className={"amt"}>${items.reduce((sum, item) => MathHelper.add(sum, item.amt), 0)}.00</div>
      </FlexContainer>
      <div
        dangerouslySetInnerHTML={{ __html: getHTML(footer) }}
        className={"preview-footer"}
      />
    </Wrapper>
  );
};

export default DonorReceiptPDFPreview;
