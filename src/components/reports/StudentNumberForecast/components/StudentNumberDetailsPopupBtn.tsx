import iVStudent from "../../../../types/Synergetic/iVStudent";
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
import iSynVDebtorStudentConcession from "../../../../types/Synergetic/Finance/iSynVDebtorStudentConcession";
import MathHelper from "../../../../helper/MathHelper";

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
                (concession: iSynVDebtorStudentConcession, index: number) => {
                  return (
                    <tr key={index}>
                      <td>{concession.FeeCode}</td>
                      <td>{concession.FeeDescription}</td>
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
                      <td>{concession.DiscountPercentage}%</td>
                      <td>
                        {UtilsService.formatIntoCurrency(
                          MathHelper.mul(
                            // @ts-ignore
                            record.tuitionFees || 0,
                            MathHelper.div(
                              concession.DiscountPercentage || 0,
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
            -
            {UtilsService.formatIntoCurrency(
              // @ts-ignore
              record.futureConcessionFees || 0
            )}
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
          -
          {UtilsService.formatIntoCurrency(
            // @ts-ignore
            record.currentConcessionFees || 0
          )}
        </Button>
      </OverlayTrigger>
    );
  };

  const getColumns = () => [
    {
      key: "studentID",
      header: "ID",
      cell: (col: iTableColumn, record: iVStudent | iFunnelLead) => {
        return (
          <td key={col.key}>{"StudentID" in record ? record.StudentID : ""}</td>
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
      key: "currentForm",
      header: "Form",
      cell: (col: iTableColumn, record: iVStudent | iFunnelLead) => {
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
      cell: (col: iTableColumn, record: iVStudent | iFunnelLead) => {
        return (
          <td key={col.key}>
            {"FullFeeFlag" in record && record.FullFeeFlag === true ? "Y" : ""}
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
        dialogClassName={"modal-90w"}
        show={isShowing}
        handleClose={handleClose}
        title={`${records.length} students:`}
      >
        <TableWrapper>
          <Table
            hover
            responsive
            columns={getColumns()}
            rows={[
            ...(records
                // @ts-ignore
              .filter(record => `${record.StudentID || ""}`.trim() !== "")
              .sort((r1, r2) => {
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
              })),
              ...(records
                // @ts-ignore
              .filter(record => `${record.StudentID || ""}`.trim() === "")
              .sort((r1, r2) => {
                // @ts-ignore
                const r1StartingYL = `${r1.student_starting_year_level || ''}`;
                // @ts-ignore
                const r2StartingYL = `${r2.student_starting_year_level || ''}`;
                if (r1StartingYL > r2StartingYL) {
                  return 1
                } else if (r1StartingYL < r2StartingYL) {
                  return -1
                }

                // @ts-ignore
                const r1Name = `${r1.student_first_name || ""}`;
                // @ts-ignore
                const r2Name = `${r2.student_first_name || ""}`;
                if (r1Name > r2Name) {
                  return 1;
                } else if (r1Name < r2Name) {
                  return -1;
                }
                // @ts-ignore
                const r1LName = `${r1.student_last_name || ""}`;
                // @ts-ignore
                const r2LName = `${r2.student_last_name || ""}`;
                if (r1LName > r2LName) {
                  return 1;
                } else if (r1LName < r2LName) {
                  return -1;
                }

                return 0;
              })),
            ]}
          />
        </TableWrapper>
      </PopupModal>
    </>
  );
};

export default StudentNumberDetailsPopupBtn;
