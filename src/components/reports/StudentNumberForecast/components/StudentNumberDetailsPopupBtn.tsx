import iVStudent, {
  SYN_STUDENT_STATUS_ID_FINALISED
} from "../../../../types/Synergetic/Student/iVStudent";
import iFunnelLead from "../../../../types/Funnel/iFunnelLead";
import { Button, ButtonProps, Table as BTable } from "react-bootstrap";
import PopupModal from "../../../common/PopupModal";
import moment from "moment-timezone";
import { useState } from "react";
import Table, { iTableColumn } from "../../../common/Table";
import UtilsService from "../../../../services/UtilsService";
import styled from "styled-components";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import MathHelper from "../../../../helper/MathHelper";
import { FlexContainer } from "../../../../styles";
import CSVExportBtn from "../../../form/CSVExportBtn";
import StudentNumberForecastExportHelper from "./StudentNumberForecastExportHelper";
import iSynDebtorStudentConcession from '../../../../types/Synergetic/Finance/iSynDebtorStudentConcession';
import iSynVDebtorFee from '../../../../types/Synergetic/Finance/iSynVDebtorFee';

type iStudentNumberDetailsPopup = ButtonProps & {
  records: (iVStudent | iFunnelLead)[];
  feeNameMap?: { [key: string]: string };
  showingFinanceFigures?: boolean;
  showingFuture?: boolean;
};

const TableWrapper = styled.div`
  .finance-col {
    background-color: #ececec;

    &.sibling-disc,
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
  feeNameMap = {},
  showingFuture = false,
  showingFinanceFigures = false,
  ...rest
}: iStudentNumberDetailsPopup) => {
  const [isShowing, setIsShowing] = useState(false);
  const handleClose = () => {
    setIsShowing(false);
  };

  const getConcessionDetails = (record: iVStudent | iFunnelLead) => {
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
      <Popover style={{ maxWidth: "600px" }}>
        <Popover.Header as="h3">
          {UtilsService.formatIntoCurrency(totalAmount)}
        </Popover.Header>
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
              {concessions.map(
                (concession: iSynDebtorStudentConcession, index: number) => {
                  return (
                    <tr key={index}>
                      <td>{concession.FeeCode}</td>
                      <td>{concession.FeeCode in feeNameMap ? feeNameMap[concession.FeeCode]  : ''}</td>
                      <td>
                        {`${concession.EffectiveFromDate || ""}`.trim() === ""
                          ? ""
                          : moment(
                              `${concession.EffectiveFromDate || ""}`
                            ).format("DD MMM YYYY")}
                      </td>
                      <td>
                        {`${concession.EffectiveToDate || ""}`.trim() === ""
                          ? ""
                          : moment(
                              `${concession.EffectiveToDate || ""}`
                            ).format("DD MMM YYYY")}
                      </td>
                      <td>{concession.OverridePercentage}%</td>
                      <td>
                        {UtilsService.formatIntoCurrency(
                          MathHelper.mul(
                            showingFuture === true
                              ? // @ts-ignore
                                record.futureTuitionFees || 0
                              : // @ts-ignore
                                record.tuitionFees || 0,
                            MathHelper.div(
                              concession.OverridePercentage || 0,
                              100
                            )
                          )
                        )}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </BTable>
        </Popover.Body>
      </Popover>
    );
  };

  const getSiblingDiscountDetails = (record: iVStudent | iFunnelLead) => {
    // @ts-ignore
    let totalAmount = record.currentSiblingDiscountFees || 0;
    // @ts-ignore
    let discounts = record.currentSiblingDiscounts || [];
    if (showingFuture === true) {
      // @ts-ignore
      totalAmount = record.nextYearSiblingDiscountFees || 0;
      // @ts-ignore
      discounts = record.nextYearSiblingDiscounts || [];
    }
    return (
      <Popover style={{ maxWidth: "600px" }}>
        <Popover.Header as="h3">
          {UtilsService.formatIntoCurrency(totalAmount)}
        </Popover.Header>
        <Popover.Body>
          <BTable>
            <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>%</th>
              <th>Amount</th>
            </tr>
            </thead>
            <tbody>
            {discounts.map(
              (discount: iSynVDebtorFee, index: number) => {
                return (
                  <tr key={index}>
                    <td>{discount.FeeCode}</td>
                    <td>{discount.FeeCode in feeNameMap ? feeNameMap[discount.FeeCode]  : ''}</td>
                    <td>{discount.DiscountPercentage}%</td>
                    <td>
                      {UtilsService.formatIntoCurrency(
                        MathHelper.mul(
                          showingFuture === true
                            ? // @ts-ignore
                            record.futureTuitionFees || 0
                            : // @ts-ignore
                            record.tuitionFees || 0,
                          MathHelper.div(
                            discount.DiscountPercentage || 0,
                            100
                          )
                        )
                      )}
                    </td>
                  </tr>
                );
              }
            )}
            </tbody>
          </BTable>
        </Popover.Body>
      </Popover>
    );
  };

  const getConcessionDiv = (record: iVStudent | iFunnelLead) => {
    if (showingFuture === true) {
      if (
        !("futureConcessionFees" in record) ||
        // @ts-ignore
        record.futureConcessionFees <= 0
      ) {
        return null;
      }
      return (
        <OverlayTrigger
          trigger="click"
          placement="left"
          overlay={getConcessionDetails(record)}
          rootClose
        >
          <Button variant="link" size={"sm"}>
            (
            {UtilsService.formatIntoCurrency(
              // @ts-ignore
              record.futureConcessionFees || 0
            )}
            )
          </Button>
        </OverlayTrigger>
      );
    }

    if (
      !("currentConcessionFees" in record) ||
      // @ts-ignore
      record.currentConcessionFees <= 0
    ) {
      return null;
    }
    return (
      <OverlayTrigger
        trigger="click"
        placement="left"
        overlay={getConcessionDetails(record)}
        rootClose
      >
        <Button variant="link" size={"sm"}>
          (
          {UtilsService.formatIntoCurrency(
            // @ts-ignore
            record.currentConcessionFees || 0
          )}
          )
        </Button>
      </OverlayTrigger>
    );
  };

  const getSiblingDiscountDiv = (record: iVStudent | iFunnelLead) => {
    if (showingFuture === true) {
      if (
        !("nextYearSiblingDiscountFees" in record) ||
        // @ts-ignore
        record.nextYearSiblingDiscountFees <= 0
      ) {
        return null;
      }
      return (
        <OverlayTrigger
          trigger="click"
          placement="left"
          overlay={getSiblingDiscountDetails(record)}
          rootClose
        >
          <Button variant="link" size={"sm"}>
            (
            {UtilsService.formatIntoCurrency(
              // @ts-ignore
              record.nextYearSiblingDiscountFees || 0
            )}
            )
          </Button>
        </OverlayTrigger>
      );
    }

    if (
      !("currentSiblingDiscountFees" in record) ||
      // @ts-ignore
      record.currentSiblingDiscountFees <= 0
    ) {
      return null;
    }
    return (
      <OverlayTrigger
        trigger="click"
        placement="left"
        overlay={getSiblingDiscountDetails(record)}
        rootClose
      >
        <Button variant="link" size={"sm"}>
          (
          {UtilsService.formatIntoCurrency(
            // @ts-ignore
            record.currentSiblingDiscountFees || 0
          )}
          )
        </Button>
      </OverlayTrigger>
    );
  };

  const getColumns = <T extends {}>() => [
    {
      key: "studentID",
      header: "ID",
      cell: (col: iTableColumn<T>, record: iVStudent | iFunnelLead) => {
        return (
          <td key={col.key}>{"StudentID" in record ? record.StudentID : ""}</td>
        );
      }
    },
    {
      key: "studentGiven1",
      header: "First Name",
      cell: (col: iTableColumn<T>, record: iVStudent | iFunnelLead) => {
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
      cell: (col: iTableColumn<T>, record: iVStudent | iFunnelLead) => {
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
      cell: (col: iTableColumn<T>, record: iVStudent | iFunnelLead) => {
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
      cell: (col: iTableColumn<T>, record: iVStudent | iFunnelLead) => {
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
      cell: (col: iTableColumn<T>, record: iVStudent | iFunnelLead) => {
        if (
          // @ts-ignore
          `${record.StudentStatus || ""}`.trim() ===
          SYN_STUDENT_STATUS_ID_FINALISED
        ) {
          return <td key={col.key}></td>;
        }
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
      key: "currentForm",
      header: "Form",
      cell: (col: iTableColumn<T>, record: iVStudent | iFunnelLead) => {
        return (
          <td key={col.key}>
            {"StudentForm" in record ? record.StudentForm : ""}
          </td>
        );
      }
    },
    {
      key: "fullFee",
      header: "FullFee?",
      cell: (col: iTableColumn<T>, record: iVStudent | iFunnelLead) => {
        return (
          <td key={col.key}>
            {"FullFeeFlag" in record && record.FullFeeFlag === true ? "Y" : ""}
          </td>
        );
      }
    },
    {
      key: "ProposingEntryYear",
      header: "Entry Date",
      cell: (col: iTableColumn<T>, record: iVStudent | iFunnelLead) => {
        return (
          <td key={col.key}>
            {// @ts-ignore
              `${record.StudentEntryDate || ""}`.trim() === ""
                ? ""
                : // @ts-ignore
                moment(record.StudentEntryDate).format('ll')}
          </td>
        );
      }
    },
    {
      key: "proposingEntryYearLevel",
      header: "Entry Year Level",
      cell: (col: iTableColumn<T>, record: iVStudent | iFunnelLead) => {
        return (
          <td key={col.key}>
            {
              // @ts-ignore
              record.StudentEntryYearLevel
            }
          </td>
        )
      }
    },
    ...(showingFinanceFigures !== true
      ? []
      : [
          {
            key: "FeeTotal",
            header: "Fee Total",
            cell: (col: iTableColumn<T>, record: iVStudent | iFunnelLead) => {
              return (
                <td key={col.key} className={"finance-col"}>
                  <b>
                    {showingFuture === true
                      ? // @ts-ignore
                        "futureTotalFeeAmount" in record
                        ? UtilsService.formatIntoCurrency(
                            // @ts-ignore
                            record.futureTotalFeeAmount || 0
                          )
                        : ""
                      : // @ts-ignore
                      "currentTotalFeeAmount" in record
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
            cell: (col: iTableColumn<T>, record: iVStudent | iFunnelLead) => {
              return (
                <td key={col.key} className={"finance-col"}>
                  {"tuitionFees" in record
                    ? UtilsService.formatIntoCurrency(
                        showingFuture === true
                          ? // @ts-ignore
                            record.futureTuitionFees || 0
                          : // @ts-ignore
                            record.tuitionFees || 0
                      )
                    : ""}
                </td>
              );
            }
          },
          {
            key: "YearLevelConsolidateCharges",
            header: "Con. Charges",
            cell: (col: iTableColumn<T>, record: iVStudent | iFunnelLead) => {
              return (
                <td key={col.key} className={"finance-col"}>
                  {"consolidateFees" in record
                    ? UtilsService.formatIntoCurrency(
                        showingFuture === true
                          ? // @ts-ignore
                            record.futureConsolidateFees || 0
                          : // @ts-ignore
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
            cell: (col: iTableColumn<T>, record: iVStudent | iFunnelLead) => {
              return (
                <td key={col.key} className={"finance-col concession"}>
                  {getConcessionDiv(record)}
                </td>
              );
            }
          },
          {
            key: "siblingDiscounts",
            header: "Sibling Dis.",
            cell: (col: iTableColumn<T>, record: iVStudent | iFunnelLead) => {
              return (
                <td key={col.key} className={"finance-col sibling-disc"}>
                  {getSiblingDiscountDiv(record)}
                </td>
              );
            }
          }
        ])
  ];

  const sortStudents = (
    r1: iVStudent | iFunnelLead,
    r2: iVStudent | iFunnelLead
  ) => {
    // @ts-ignore
    const r1YLSort = Number(r1.StudentYearLevelSort || 0);
    // @ts-ignore
    const r2YLSort = Number(r2.StudentYearLevelSort || 0);
    if (r1YLSort > r2YLSort) {
      return 1;
    } else if (r1YLSort < r2YLSort) {
      return -1;
    }

    // @ts-ignore
    const r1YL = Number(r1.StudentYearLevel || 0);
    // @ts-ignore
    const r2YL = Number(r2.StudentYearLevel || 0);
    if (r1YL > r2YL) {
      return 1;
    } else if (r1YL < r2YL) {
      return -1;
    }

    // @ts-ignore
    const r1Form = `${r1.StudentForm || ""}`;
    // @ts-ignore
    const r2Form = `${r2.StudentForm || ""}`;
    if (r1Form > r2Form) {
      return 1;
    } else if (r1Form < r2Form) {
      return -1;
    }

    // @ts-ignore
    const r1Name = `${r1.StudentNameExternal || ""}`;
    // @ts-ignore
    const r2Name = `${r2.StudentNameExternal || ""}`;
    if (r1Name > r2Name) {
      return 1;
    } else if (r1Name < r2Name) {
      return -1;
    }

    return 0;
  };

  return (
    <>
      <Button
        {...rest}
        onClick={() => setIsShowing(true)}
        className={`st-no-popup-btn ${rest.className || ""}`}
      />
      <PopupModal
        dialogClassName={"modal-90w"}
        show={isShowing}
        handleClose={handleClose}
        title={
          <FlexContainer className={"with-gap lg-gap"}>
            <div>{records.length} students:</div>
            <CSVExportBtn // @ts-ignore
              fetchingFnc={() =>
                new Promise(resolve => {
                  resolve(records);
                })
              }
              downloadFnc={() =>
                StudentNumberForecastExportHelper.downloadHeadCounts(
                  records || [],
                  showingFinanceFigures,
                  showingFuture,
                  feeNameMap
                )
              }
              size={"sm"}
              btnTxt={"Export"}
            />
          </FlexContainer>
        }
      >
        <TableWrapper>
          <Table
            hover
            responsive
            columns={getColumns<iVStudent | iFunnelLead>()}
            rows={[
              ...records
                .filter(
                  record =>
                    // @ts-ignore
                    `${record.StudentID || ""}`.trim() !== ""
                )
                .sort(sortStudents),
            ]}
          />
        </TableWrapper>
      </PopupModal>
    </>
  );
};

export default StudentNumberDetailsPopupBtn;
