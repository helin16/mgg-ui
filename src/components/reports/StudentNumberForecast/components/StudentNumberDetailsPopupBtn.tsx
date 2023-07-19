import iVStudent from "../../../../types/Synergetic/iVStudent";
import iFunnelLead from "../../../../types/Funnel/iFunnelLead";
import { Button, ButtonProps, Table as BTable } from "react-bootstrap";
import PopupModal from "../../../common/PopupModal";
import moment from "moment-timezone";
import { useState } from "react";
import Table, { iTableColumn } from "../../../common/Table";
import UtilsService from "../../../../services/UtilsService";
import styled from "styled-components";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import iSynVDebtorStudentConcession from '../../../../types/Synergetic/Finance/iSynVDebtorStudentConcession';
import MathHelper from '../../../../helper/MathHelper';

type iStudentNumberDetailsPopup = ButtonProps & {
  records: (iVStudent | iFunnelLead)[];
  showingFinanceFigures?: boolean;
  showingFuture?: boolean;
};

const TableWrapper = styled.div`
  .finance-col {
    background-color: #ececec;
    
    &.concession {
      .btn {
        padding: 0px;
        margin: 0px;
      }
    }
  }
`;

const StudentNumberDetailsPopupBtn = ({
  records,
  showingFuture = false,
  showingFinanceFigures = false,
  ...rest
}: iStudentNumberDetailsPopup) => {
  const [isShowing, setIsShowing] = useState(false);

  const handleClose = () => {
    setIsShowing(false);
  };

  const getConcessionDetails = (record: (iVStudent | iFunnelLead)) => {
    // @ts-ignore
    let totalAmount = record.currentConcessionFees || 0;
    // @ts-ignore
    let concessions = record.currentConcessions || [];
    if (showingFuture === true) {
      // @ts-ignore
      totalAmount = record.futureConcessionFees || 0;
      // @ts-ignore
      concessions = record.nextYearConcessions || [];
    }
    return (
      <Popover style={{maxWidth: '600px'}}>
        <Popover.Header as="h3">{UtilsService.formatIntoCurrency(totalAmount)}</Popover.Header>
        <Popover.Body>
          <BTable>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>From</th>
                <th>To</th>
                <th>%</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {concessions.map((concession: iSynVDebtorStudentConcession, index: number) => {
                return (
                  <tr key={index}>
                    <td>{concession.FeeCode}</td>
                    <td>{concession.FeeDescription}</td>
                    <td>{`${concession.EffectiveFromDate || ''}`.trim() === '' ? '' : moment(`${concession.EffectiveFromDate || ''}`).format('DD MMM YYYY')}</td>
                    <td>{`${concession.EffectiveToDate || ''}`.trim() === '' ? '' : moment(`${concession.EffectiveToDate || ''}`).format('DD MMM YYYY')}</td>
                    <td>{concession.DiscountPercentage}%</td>
                    <td>
                      {
                        // @ts-ignore
                        UtilsService.formatIntoCurrency(MathHelper.mul(record.tuitionFees || 0, MathHelper.div(concession.DiscountPercentage || 0, 100)))
                      }
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </BTable>
        </Popover.Body>
      </Popover>
    )
  }

  const getConcessionDiv = (record: (iVStudent | iFunnelLead)) => {
    if (showingFuture === true) {
      // @ts-ignore
      if (!("futureConcessionFees" in record) || record.futureConcessionFees <= 0) {
        return null;
      }
      return (
        <OverlayTrigger trigger="click" placement="left" overlay={getConcessionDetails(record)} rootClose>
          <Button variant="link" size={'sm'}>-{UtilsService.formatIntoCurrency(
            // @ts-ignore
            record.futureConcessionFees || 0
          )}</Button>
        </OverlayTrigger>
      )
    }

    // @ts-ignore
    if (!("currentConcessionFees" in record) || record.currentConcessionFees <= 0) {
      return null;
    }
    return (
      <OverlayTrigger trigger="click" placement="left" overlay={getConcessionDetails(record)} rootClose>
        <Button variant="link" size={'sm'}>-{UtilsService.formatIntoCurrency(
          // @ts-ignore
          record.currentConcessionFees || 0
        )}</Button>
      </OverlayTrigger>
    )

  }

  const getColumns = () => [
    {
      key: "studentID",
      header: "ID",
      cell: (col: iTableColumn, record: iVStudent | iFunnelLead) => {
        return (
          <td key={col.key}>
            {"StudentID" in record
              ? record.StudentID
              : ''}
          </td>
        );
      }
    },
    {
      key: "studentGiven1",
      header: "First Name",
      cell: (col: iTableColumn, record: iVStudent | iFunnelLead) => {
        return (
          <td key={col.key}>
            {"StudentGiven1" in record
              ? record.StudentGiven1
              : record.student_first_name}
          </td>
        );
      }
    },
    {
      key: "studentSurname",
      header: "Last Name",
      cell: (col: iTableColumn, record: iVStudent | iFunnelLead) => {
        return (
          <td key={col.key}>
            {"StudentSurname" in record
              ? record.StudentSurname
              : record.student_last_name}
          </td>
        );
      }
    },
    {
      key: "studentStatus",
      header: "Status",
      cell: (col: iTableColumn, record: iVStudent | iFunnelLead) => {
        return (
          <td key={col.key}>
            {"StudentStatusDescription" in record
              ? record.StudentStatusDescription
              : ""}
          </td>
        );
      }
    },
    {
      key: "StudentLeavingDate",
      header: "Leaving Date",
      cell: (col: iTableColumn, record: iVStudent | iFunnelLead) => {
        return (
          <td key={col.key}>
            {"StudentLeavingDate" in record
              ? `${record.StudentLeavingDate || ""}`.trim() === ""
                ? ""
                : moment(record.StudentLeavingDate).format("ll")
              : ""}
          </td>
        );
      }
    },
    {
      key: "currentYearLevel",
      header: "Current Year Level",
      cell: (col: iTableColumn, record: iVStudent | iFunnelLead) => {
        return (
          <td key={col.key}>
            {"StudentYearLevelDescription" in record
              ? record.StudentYearLevelDescription
              : ""}
          </td>
        );
      }
    },
    {
      key: "ProposingEntryYear",
      header: "Proposing Entry Year",
      cell: (col: iTableColumn, record: iVStudent | iFunnelLead) => {
        return (
          <td key={col.key}>
            {"student_starting_year" in record
              ? record.student_starting_year
              : ""}
          </td>
        );
      }
    },
    {
      key: "proposingEntryYearLevel",
      header: "Proposing Entry Year Level",
      cell: (col: iTableColumn, record: iVStudent | iFunnelLead) => {
        return (
          <td key={col.key}>
            {"student_starting_year_level" in record
              ? record.student_starting_year_level
              : ""}
          </td>
        );
      }
    },
    {
      key: "leadStage",
      header: "Lead Stage",
      cell: (col: iTableColumn, record: iVStudent | iFunnelLead) => {
        return (
          <td key={col.key}>
            {"pipeline_stage_name" in record ? record.pipeline_stage_name : ""}
          </td>
        );
      }
    },
    ...(showingFinanceFigures !== true
      ? []
      : [
          {
            key: "FeeTotal",
            header: "Fee Total",
            cell: (col: iTableColumn, record: iVStudent | iFunnelLead) => {
              return (
                <td key={col.key} className={"finance-col"}>
                  <b>
                    {showingFuture === true
                      // @ts-ignore
                      ? "futureTotalFeeAmount" in record
                        ? UtilsService.formatIntoCurrency(
                          // @ts-ignore
                          record.futureTotalFeeAmount || 0
                        )
                        : ""
                      // @ts-ignore
                      : "currentTotalFeeAmount" in record
                        ? UtilsService.formatIntoCurrency(
                          // @ts-ignore
                          record.currentTotalFeeAmount || 0
                        )
                        : ""}
                  </b>
                </td>
              );
            }
          },
          {
            key: "YearLevelTuitionFee",
            header: "Tuit. Fee",
            cell: (col: iTableColumn, record: iVStudent | iFunnelLead) => {
              return (
                <td key={col.key} className={"finance-col"}>
                  {"tuitionFees" in record
                    ? // @ts-ignore
                      UtilsService.formatIntoCurrency(record.tuitionFees || 0)
                    : ""}
                </td>
              );
            }
          },
          {
            key: "YearLevelConsolidateCharges",
            header: "Con. Charges",
            cell: (col: iTableColumn, record: iVStudent | iFunnelLead) => {
              return (
                <td key={col.key} className={"finance-col"}>
                  {"consolidateFees" in record
                    ? UtilsService.formatIntoCurrency(
                        // @ts-ignore
                        record.consolidateFees || 0
                      )
                    : ""}
                </td>
              );
            }
          },
          {
            key: "concessions",
            header: "Conessions",
            cell: (col: iTableColumn, record: iVStudent | iFunnelLead) => {
              return (
                <td key={col.key} className={"finance-col concession"}>
                  {getConcessionDiv(record)}
                </td>
              );
            }
          }
        ])
  ];

  return (
    <>
      <Button
        {...rest}
        onClick={() => setIsShowing(true)}
        className={`st-no-popup-btn ${rest.className || ""}`}
      />
      <PopupModal
        dialogClassName={"modal-80w"}
        show={isShowing}
        handleClose={handleClose}
        title={`${records.length} students:`}
      >
        <TableWrapper>
          <Table
            hover
            responsive
            columns={getColumns()}
            rows={records
              .sort((r1, r2) =>
                // @ts-ignore
                `${r1.StudentYearLevelDescription || ""}` >
                // @ts-ignore
                `${r2.StudentYearLevelDescription || ""}`
                  ? -1
                  : 1
              )
              .sort((r1, r2) =>
                // @ts-ignore
                `${r1.student_starting_year_level || ""}` >
                // @ts-ignore
                `${r2.student_starting_year_level || ""}`
                  ? 1
                  : -1
              )}
          />
        </TableWrapper>
      </PopupModal>
    </>
  );
};

export default StudentNumberDetailsPopupBtn;
