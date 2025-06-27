import React, { useEffect, useState } from "react";
import * as _ from "lodash";
import ISynLuYearLevel from "../../../../types/Synergetic/Lookup/iSynLuYearLevel";
import Table, { iTableColumn } from "../../../common/Table";
import iVStudent from "../../../../types/Synergetic/Student/iVStudent";
import iFunnelLead from "../../../../types/Funnel/iFunnelLead";
import StudentNumberDetailsPopupBtn from "./StudentNumberDetailsPopupBtn";
import styled from "styled-components";
import { mainBlue } from "../../../../AppWrapper";
import UtilsService from "../../../../services/UtilsService";
import MathHelper from "../../../../helper/MathHelper";
import {DashSquare, PlusSquare} from 'react-bootstrap-icons';
import {FlexContainer} from '../../../../styles';

type iStudentMap = { [key: string]: iVStudent[] };
type iMap = { [key: string]: iFunnelLead[] };
type iFunnelLeadMap = {
  confirmed: iMap;
  inProgress: iMap;
  leadsAndTours: iMap;
};
type iStudentNumberForecastTable = {
  className?: string;
  showingFinanceFigures?: boolean;
  nextFileYear: number;
  selectedCampusCodes?: string[];
  yearLevelMap: { [key: string]: ISynLuYearLevel };
  feeNameMap: { [key: string]: string };
  currentStudentMap: iStudentMap;
  confirmedFutureStudentMap: iStudentMap;
  currentStudentLeaverMap: iStudentMap;
  nextYearFunnelLeadMap: iFunnelLeadMap;
  futureNextYearMap: iMap;
};
const Wrapper = styled.div`
  .st-no-popup-btn {
    padding: 0px;
    margin: 0px;
  }

  .lead-table {
    .expanded-cell,
    .expanded-cell button {
        font-size: 12px !important;
        font-style: italic;
    }
    thead {
      th {
        background: ${mainBlue};
        color: white !important;
      }
    }
    td {
        &.sub-total {
            background: #e9e9e9;
            font-weight: bold;
            :first-child {
                text-align: right;
            }
            .btn {
                font-weight: bold;
            }
        }
        &.expanded-cell {
            background-color: #f8f8f8 !important;
            &.sub-total {
                background: #e9e9e9 !important;
            }
        }
    }
    tfoot {
      font-weight: bold;
      .btn {
        font-weight: bold;
      }
    }
  }
`;
const StudentNumberForecastTable = ({
  className,
  nextFileYear,
  yearLevelMap,
  currentStudentMap,
  confirmedFutureStudentMap,
  currentStudentLeaverMap,
  nextYearFunnelLeadMap,
  futureNextYearMap,
  showingFinanceFigures,
  feeNameMap,
  selectedCampusCodes = ["S", "J", "E"]
}: iStudentNumberForecastTable) => {
  const [yLevelArr, setYLevelArr] = useState<ISynLuYearLevel[]>([]);
  const [expandedCurrent, setExpandedCurrent] = useState<boolean>(false);
  const [expandedConfirmed, setExpandedConfirmed] = useState<boolean>(false);
  const [expandedFuture, setExpandedFuture] = useState<boolean>(false);

  useEffect(() => {
    const arr = Object.values(yearLevelMap).sort((yl1, yl2) =>
      yl1.YearLevelSort > yl2.YearLevelSort ? 1 : -1
    );
    const campusCodesForE = _.intersection(selectedCampusCodes, ["E"]);
    const campusCodesForJS = _.intersection(selectedCampusCodes, ["J", "S"]);
    setYLevelArr([
      // @ts-ignore
      ...arr.filter(yl => yl.Campus === "E"),
      ...(campusCodesForE.length > 0
        ? // @ts-ignore
          [{ Code: "subTotal", campuses: campusCodesForE }]
        : []),
      // @ts-ignore
      ...arr.filter(yl => ["J", "S"].indexOf(yl.Campus) >= 0),
      // @ts-ignore
      ...(campusCodesForJS.length > 0
        ? [{ Code: "subTotal", campuses: campusCodesForJS }]
        : [])
    ]);
  }, [yearLevelMap, selectedCampusCodes]);

  const getTotalAmountForStudent = (
    record: iVStudent | iFunnelLead,
    forFuture: boolean = false,
    minusDiscounts: boolean = false
  ) => {
    // @ts-ignore
    const totalCharges  = forFuture === true ? MathHelper.add(record.futureTuitionFees || 0, record.futureConsolidateFees) : MathHelper.add(record.tuitionFees || 0, record.consolidateFees);
    if (minusDiscounts === false) {
      return totalCharges;
    }
    // @ts-ignore
    const concessionFees = forFuture === true ? record.futureConcessionFees || 0 : record.currentConcessionFees || 0;
    // @ts-ignore
    const siblingDisFees = forFuture === true ? record.nextYearSiblingDiscountFees || 0 : record.currentSiblingDiscountFees || 0;

    const totalDiscounts = MathHelper.add(concessionFees, siblingDisFees);
    return MathHelper.sub(totalCharges, totalDiscounts); //record.currentTotalFeeAmount || 0;
  };

  const StudentPopupDiv = (
    students: (iVStudent | iFunnelLead)[],
    forFuture: boolean = false,
    content?: any,
    minusDiscounts: boolean = false
  ) => {
    if (students.length <= 0) {
      return null;
    }

    return (
      <StudentNumberDetailsPopupBtn
        records={students}
        size={"sm"}
        variant={"link"}
        showingFuture={forFuture}
        showingFinanceFigures={showingFinanceFigures}
        feeNameMap={feeNameMap}
      >
        {content !== undefined
          ? content
          : showingFinanceFigures === true
          ? UtilsService.formatIntoCurrency(
              students.reduce(
                (sum, student) =>
                  MathHelper.add(
                    sum,
                    getTotalAmountForStudent(student, forFuture, minusDiscounts)
                  ),
                0
              )
            )
          : students.length}
      </StudentNumberDetailsPopupBtn>
    );
  };

  const getCell = (
    key: string,
    data: ISynLuYearLevel,
    map: any,
    forFuture: boolean = false,
    minusDiscounts: boolean = false,
    className = ''
  ) => {
    if (data.Code === "subTotal") {
      const yearLevelCodes = yLevelArr
        // @ts-ignore
        .filter(yLevel => (data.campuses || []).indexOf(yLevel.Campus) >= 0)
        .map(yLevel => yLevel.Code);
      const students = yearLevelCodes.reduce(
        (arr: iVStudent[], code) => [...arr, ...(code in map ? map[code] : [])],
        []
      );
      return (
        <td key={key} className={`sub-total ${className}`}>
          {StudentPopupDiv(students, forFuture, undefined, minusDiscounts)}
        </td>
      );
    }

    const students = data.Code in map ? map[data.Code] : [];
    return <td key={key} className={className}>{StudentPopupDiv(students, forFuture, undefined, minusDiscounts)}</td>;
  };

  const getConcessionCell = (
    key: string,
    map: any,
    data?: ISynLuYearLevel,
    forFuture: boolean = false,
    className = ''
  ) => {
    let students = [];
    if (!data) {
      // @ts-ignore
      students = map.total || [];
    } else if (data.Code === "subTotal") {
      const yearLevelCodes = yLevelArr
        // @ts-ignore
        .filter(yLevel => (data.campuses || []).indexOf(yLevel.Campus) >= 0)
        .map(yLevel => yLevel.Code);
      students = yearLevelCodes.reduce(
        (arr: iVStudent[], code) => [...arr, ...(code in map ? map[code] : [])],
        []
      );
    } else {
      students = data.Code in map ? map[data.Code] : [];
    }

    // @ts-ignore
    const studentsWithConcessions: (
      | iVStudent
      | iFunnelLead
    )[] = students.filter((record: iVStudent | iFunnelLead) => {
      if (forFuture === true) {
        return (
          // @ts-ignore
          record.futureConcessionFees &&
          // @ts-ignore
          record.futureConcessionFees > 0
        );
      }
      return (
        // @ts-ignore
        record.currentConcessionFees &&
        // @ts-ignore
        record.currentConcessionFees > 0
      );
    });

    return (
      <td key={key} className={`${data?.Code === "subTotal" ? "sub-total" : ""} ${className}`}>
        {StudentPopupDiv(
          studentsWithConcessions,
          forFuture,
          <small>
            (
            {UtilsService.formatIntoCurrency(
              studentsWithConcessions.reduce(
                (sum, student) =>
                  MathHelper.add(
                    sum,
                    forFuture === true
                      ? // @ts-ignore
                        student.futureConcessionFees
                      : // @ts-ignore
                        student.currentConcessionFees
                  ),
                0
              )
            )}
            )
          </small>
        )}
      </td>
    );
  };

  const getSiblingDiscountCell = (
    key: string,
    map: any,
    data?: ISynLuYearLevel,
    forFuture: boolean = false,
    className = ''
  ) => {
    let students = [];
    if (!data) {
      // @ts-ignore
      students = map.total || [];
    } else if (data.Code === "subTotal") {
      const yearLevelCodes = yLevelArr
        // @ts-ignore
        .filter(yLevel => (data.campuses || []).indexOf(yLevel.Campus) >= 0)
        .map(yLevel => yLevel.Code);
      students = yearLevelCodes.reduce(
        (arr: iVStudent[], code) => [...arr, ...(code in map ? map[code] : [])],
        []
      );
    } else {
      students = data.Code in map ? map[data.Code] : [];
    }

    // @ts-ignore
    const studentsWithSiblingDiscounts: (
      | iVStudent
      | iFunnelLead
      )[] = students.filter((record: iVStudent | iFunnelLead) => {
      if (forFuture === true) {
        return (
          'nextYearSiblingDiscountFees' in record &&
          // @ts-ignore
          record.nextYearSiblingDiscountFees > 0
        );
      }
      return (
        'currentSiblingDiscountFees' in record &&
        // @ts-ignore
        record.currentSiblingDiscountFees > 0
      );
    });

    return (
      <td key={key} className={`${data?.Code === "subTotal" ? "sub-total" : ""} ${className}`}>
        {StudentPopupDiv(
          studentsWithSiblingDiscounts,
          forFuture,
          <small>
            (
            {UtilsService.formatIntoCurrency(
              studentsWithSiblingDiscounts.reduce(
                (sum, student) =>
                  MathHelper.add(
                    sum,
                    forFuture === true
                      ? // @ts-ignore
                      student.nextYearSiblingDiscountFees
                      : // @ts-ignore
                      student.currentSiblingDiscountFees
                  ),
                0
              )
            )}
            )
          </small>
        )}
      </td>
    );
  };

  const getExpandableThead = <T extends {}>(col: iTableColumn<T>, title: string, expandFn: () => void) => {
    return (
      <th key={col.key}>
        <FlexContainer className={'gap-1 align-items-center'}>
          <span>{title}</span>
          {showingFinanceFigures === true && (
            <span
              className={'cursor-pointer text-center'}
              onClick={expandFn}>
                  {expandedCurrent === true ? <DashSquare /> : <PlusSquare />}
                </span>
          )}
        </FlexContainer>
      </th>
    )
  }

  const getExpandedThead = <T extends {}>(col: iTableColumn<T>, title: string) => {
    return (
      <th key={col.key} className={'expanded-cell'}>
        <small><i><u>{title}</u></i></small>
      </th>
    )
  }

  const getColumns = <T extends {}>() => [
    {
      key: "ylevelCode",
      header: "Year Level",
      cell: (col: iTableColumn<T>, data: ISynLuYearLevel) => {
        if (data.Code === "subTotal") {
          return (
            <td key={col.key} className={"text-right sub-total"}>
              <b>Sub Total</b>
            </td>
          );
        }
        return (
          <td key={col.key}>
            {Number(data.Code) > 0
              ? `Year ${data.Description}`
              : data.Description}
          </td>
        );
      },
      footer: (col: iTableColumn<T>) => {
        return (
          <td key={col.key}>
            <b>Total</b>
          </td>
        );
      }
    },
    {
      key: "currentStudent",
      header: (col: iTableColumn<T>) => {
        return getExpandableThead(col, 'Current Student', () => setExpandedCurrent(!expandedCurrent));
      },
      cell: (col: iTableColumn<T>, data: ISynLuYearLevel) => {
        return getCell(col.key, data, currentStudentMap, false, true);
      },
      footer: (col: iTableColumn<T>) => {
        const students =
          "total" in currentStudentMap ? currentStudentMap.total : [];
        return <td key={col.key}>{StudentPopupDiv(students, false, undefined, true)}</td>;
      }
    },
    ...(showingFinanceFigures === true && expandedCurrent === true
      ? [
          {
            key: "currentCharges",
            header: (col: iTableColumn<T>) => getExpandedThead(col, 'Current Charges'),
            cell: (col: iTableColumn<T>, data: ISynLuYearLevel) => {
              return getCell(col.key, data, currentStudentMap, false, false, 'expanded-cell');
            },
            footer: (col: iTableColumn<T>) => {
              const students =
                "total" in currentStudentMap ? currentStudentMap.total : [];
              return <td key={col.key} className={'expanded-cell'}>{StudentPopupDiv(students, false)}</td>;
            }
          },
          {
            key: "currentConcessions",
            header: (col: iTableColumn<T>) => getExpandedThead(col, 'Current Concessions'),
            cell: (col: iTableColumn<T>, data: ISynLuYearLevel) => {
              return getConcessionCell(col.key, currentStudentMap, data, false, 'expanded-cell');
            },
            footer: (col: iTableColumn<T>) => {
              return getConcessionCell(
                col.key,
                currentStudentMap,
                undefined,
                false,
                'expanded-cell'
              );
            }
          },
          {
            key: "currentSiblingDiscounts",
            header: (col: iTableColumn<T>) => getExpandedThead(col, 'Current Sibling Disc.'),
            cell: (col: iTableColumn<T>, data: ISynLuYearLevel) => {
              return getSiblingDiscountCell(col.key, currentStudentMap, data, false, 'expanded-cell');
            },
            footer: (col: iTableColumn<T>) => {
              return getSiblingDiscountCell(
                col.key,
                currentStudentMap,
                undefined,
                false,
                'expanded-cell'
              );
            }
          }
        ]
      : []),
    {
      key: "currentLeavers",
      header: "Current Leavers",
      cell: (col: iTableColumn<T>, data: ISynLuYearLevel) => {
        return getCell(col.key, data, currentStudentLeaverMap);
      },
      footer: (col: iTableColumn<T>) => {
        const students =
          "total" in currentStudentLeaverMap
            ? currentStudentLeaverMap.total
            : [];
        return <td key={col.key}>{StudentPopupDiv(students)}</td>;
      }
    },
    {
      key: "confirmed",
      header: (col: iTableColumn<T>) => {
        return getExpandableThead(col, 'Confirmed', () => setExpandedConfirmed(!expandedConfirmed));
      },
      cell: (col: iTableColumn<T>, data: ISynLuYearLevel) => {
        return getCell(col.key, data, confirmedFutureStudentMap, true, true);
      },
      footer: (col: iTableColumn<T>) => {
        const students =
          "total" in confirmedFutureStudentMap
            ? confirmedFutureStudentMap.total
            : [];
        return <td key={col.key}>{StudentPopupDiv(students, true, undefined, true)}</td>;
      }
    },
    ...(showingFinanceFigures === true  && expandedConfirmed === true
      ? [
        {
          key: "confirmedCharges",
          header: (col: iTableColumn<T>) => getExpandedThead(col, 'Confirmed Charges'),
          cell: (col: iTableColumn<T>, data: ISynLuYearLevel) => {
            return getCell(col.key, data, confirmedFutureStudentMap, true, false, 'expanded-cell');
          },
          footer: (col: iTableColumn<T>) => {
            const students =
              "total" in confirmedFutureStudentMap
                ? confirmedFutureStudentMap.total
                : [];
            return <td key={col.key} className={'expanded-cell'}>{StudentPopupDiv(students, true)}</td>;
          }
        },
        {
          key: "confirmedConcessions",
          header: (col: iTableColumn<T>) => getExpandedThead(col, 'Confirmed Concessions'),
          cell: (col: iTableColumn<T>, data: ISynLuYearLevel) => {
            return getConcessionCell(col.key, confirmedFutureStudentMap, data, true, 'expanded-cell');
          },
          footer: (col: iTableColumn<T>) => {
            return getConcessionCell(col.key, confirmedFutureStudentMap, undefined, true, 'expanded-cell');
          }
        },
        {
          key: "confirmedSibDisc",
          header: (col: iTableColumn<T>) => getExpandedThead(col, 'Confirmed Sibling Disc.'),
          cell: (col: iTableColumn<T>, data: ISynLuYearLevel) => {
            return getSiblingDiscountCell(col.key, confirmedFutureStudentMap, data, true, 'expanded-cell');
          },
          footer: (col: iTableColumn<T>) => {
            return getSiblingDiscountCell(col.key, confirmedFutureStudentMap, undefined, true, 'expanded-cell');
          }
        },
      ]
      : []),
    {
      key: "nextYear",
      header: (col: iTableColumn<T>) => {
        return getExpandableThead(col,  `Future ${nextFileYear}`, () => setExpandedFuture(!expandedFuture));
      },
      cell: (col: iTableColumn<T>, data: ISynLuYearLevel) => {
        return getCell(col.key, data, futureNextYearMap, true, true);
      },
      footer: (col: iTableColumn<T>) => {
        const students =
          "total" in futureNextYearMap ? futureNextYearMap.total : [];
        return <td key={col.key}>{StudentPopupDiv(students, true, undefined, true)}</td>;
      }
    },
    ...(showingFinanceFigures === true && expandedFuture === true
      ? [
          {
            key: "futureCharges",
            header: (col: iTableColumn<T>) => getExpandedThead(col, `${nextFileYear} Charges`),
            cell: (col: iTableColumn<T>, data: ISynLuYearLevel) => {
              return getCell(col.key, data, futureNextYearMap, true, false, 'expanded-cell');
            },
            footer: (col: iTableColumn<T>) => {
              const students =
                "total" in futureNextYearMap ? futureNextYearMap.total : [];
              return <td key={col.key} className={'expanded-cell'}>{StudentPopupDiv(students, true)}</td>;
            }
          },
          {
            key: "futureConcessions",
            header: (col: iTableColumn<T>) => getExpandedThead(col, `${nextFileYear} Concessions`),
            cell: (col: iTableColumn<T>, data: ISynLuYearLevel) => {
              return getConcessionCell(col.key, futureNextYearMap, data, true, 'expanded-cell');
            },
            footer: (col: iTableColumn<T>) => {
              return getConcessionCell(
                col.key,
                futureNextYearMap,
                undefined,
                true,
                'expanded-cell'
              );
            }
          },
          {
            key: "futureSibDisc",
            header: (col: iTableColumn<T>) => getExpandedThead(col, `${nextFileYear} Sibling Disc.`),
            cell: (col: iTableColumn<T>, data: ISynLuYearLevel) => {
              return getSiblingDiscountCell(col.key, futureNextYearMap, data, true, 'expanded-cell');
            },
            footer: (col: iTableColumn<T>) => {
              return getSiblingDiscountCell(col.key, futureNextYearMap, undefined, true, 'expanded-cell');
            }
          },
        ]
      : []),
  ];

  return (
    <Wrapper className={className}>
      <Table
        hover
        responsive
        className={"lead-table"}
        columns={getColumns<ISynLuYearLevel>()}
        rows={yLevelArr}
      />
    </Wrapper>
  );
};

export default StudentNumberForecastTable;
