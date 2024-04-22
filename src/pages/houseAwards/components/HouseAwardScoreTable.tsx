import iSynLuHouse from "../../../types/Synergetic/Lookup/iSynLuHouse";
import iHouseAwardEventType from "../../../types/HouseAwards/iHouseAwardEventType";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import ReactTableWithFixedColumns from "../../../components/common/ReactTableWithFixedColumns";
import ISynLuYearLevel from "../../../types/Synergetic/Lookup/iSynLuYearLevel";
import iHouseAwardEvent from "../../../types/HouseAwards/iHouseAwardEvent";
import iVStudent from "../../../types/Synergetic/Student/iVStudent";
import iHouseAwardScore from "../../../types/HouseAwards/iHouseAwardScore";
import HouseAwardScoreService from "../../../services/HouseAwards/HouseAwardScoreService";
import MathHelper from "../../../helper/MathHelper";
import HouseAwardScoreCell from "./HouseAwardScoreCell";
import HouseAwardConfirmAwardPopupBtn from "./HouseAwardConfirmAwardPopupBtn";
import { OP_LTE } from "../../../helper/ServiceHelper";
import SynVStudentService from "../../../services/Synergetic/Student/SynVStudentService";
import CSVExportBtn from "../../../components/form/CSVExportBtn";
import { FlexContainer } from "../../../styles";
import HouseAwardExportHelper from "./HouseAwardExportHelper";
import HouseAwardScoreBulkCheckBox from "./HouseAwardScoreBulkCheckBox";

type iHouseAwardScoreTable = {
  house: iSynLuHouse;
  type: iHouseAwardEventType;
  yearLevel: ISynLuYearLevel;
  fileYear: number;
  htmlId?: string;
  events: iHouseAwardEvent[];
  isDisabled?: boolean;
  isAwardable?: boolean;
  isLoadingStudents?: boolean;
};
const Wrapper = styled.div`
  .table {
    background-color: white !important;

    tbody {
      tr:hover td {
        background-color: #efefef !important;
      }
    }
  }
`;

type iScoreArrMap = { [key: number]: iHouseAwardScore[] };
type iStudentEventScoreMap = {
  [key: number]: { [key: number]: iHouseAwardScore };
};
const HouseAwardScoreTable = ({
  house,
  htmlId,
  type,
  yearLevel,
  fileYear,
  events,
  isDisabled = false,
  isAwardable = true,
  isLoadingStudents = false
}: iHouseAwardScoreTable) => {
  const [isLoading, setIsLoading] = useState(isLoadingStudents);
  const [studentMap, setStudentMap] = useState<{ [key: number]: iVStudent }>(
    {}
  );
  const [studentScoreMap, setStudentScoreMap] = useState<iScoreArrMap>({});
  const [studentEventScoreMap, setStudentEventScoreMap] = useState<
    iStudentEventScoreMap
  >({});
  const [studentNotAwardedMap, setStudentNotAwardedMap] = useState<
    iScoreArrMap
  >({});
  const [count, setCount] = useState(0);

  useEffect(() => {
    let isCanceled = false;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const students = await SynVStudentService.getCurrentVStudents({
          where: JSON.stringify({
            StudentHouse: house.Code,
            FileYear: fileYear,
            StudentYearLevel: yearLevel.Code
          }),
          sort: "StudentSurname:ASC,StudentPreferred:ASC"
        });
        if (isCanceled) return;
        const studMap = students.reduce((m, student) => {
          return {
            ...m,
            [student.StudentID]: student
          };
        }, {});
        setStudentMap(studMap);
        const houseAwardScores = await HouseAwardScoreService.getScores({
          where: JSON.stringify({
            FileYear: { [OP_LTE]: fileYear },
            StudentID: Object.keys(studMap),
            event_type_id: type.id,
            active: 1
          }),
          include: "event"
        });
        const sEventScoreMap: iStudentEventScoreMap = {};
        const sScoreMap: iScoreArrMap = {};
        const notAwardedSMap: iScoreArrMap = {};
        houseAwardScores.forEach(score => {
          const studentId = score.StudentID;
          const eventId = score.event_id;

          sScoreMap[studentId] = [
            ...(studentId in sScoreMap ? sScoreMap[studentId] : []),
            score
          ];

          if (score.FileYear === fileYear) {
            sEventScoreMap[studentId] = {
              ...(studentId in sEventScoreMap ? sEventScoreMap[studentId] : {}),
              [eventId]: score
            };
          }

          if (score.awarded_at === null) {
            notAwardedSMap[studentId] = [
              ...(studentId in notAwardedSMap ? notAwardedSMap[studentId] : []),
              score
            ];
          }
        });

        setStudentEventScoreMap(sEventScoreMap);
        setStudentScoreMap(sScoreMap);
        setStudentNotAwardedMap(notAwardedSMap);

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isCanceled = true;
    };
  }, [house, type, yearLevel, events, fileYear, count]);

  const getSumOfScores = (scores: iHouseAwardScore[]) => {
    return scores.reduce((sum, score) => MathHelper.add(sum, score.score), 0);
  };

  const columnLeftFix = [
    {
      Header: "ID",
      accessor: "student.StudentID",
      width: 70,
      sticky: "left"
    },
    {
      Header: "Surname",
      accessor: "student.StudentSurname",
      width: 70,
      sticky: "left"
    },
    {
      Header: "Preferred Name",
      accessor: "student.StudentPreferred",
      width: 70,
      sticky: "left"
    },
    ...(isAwardable === true
      ? [
          {
            Header: `Year ${fileYear - 1}`,
            accessor: "lastYearTotal",
            width: 60,
            sticky: "left"
          }
        ]
      : [])
  ];

  const columnEvents = events.map(event => ({
    Header: () => {
      return (
        <div style={{ textAlign: "center" }}>
          <div>{event.name}</div>
          {isAwardable === true ? null : (
            <HouseAwardScoreBulkCheckBox
              fileYear={fileYear}
              eventType={type}
              event={event}
              studentEventScoreMap={studentEventScoreMap}
              studentIds={Object.keys(studentMap).map(id => Number(id))}
              onAddedScores={() => setCount(MathHelper.add(count, 1))}
              onDeletedScores={() => setCount(MathHelper.add(count, 1))}
              forceReload={count}
            />
          )}
        </div>
      );
    },
    accessor: `${event.id}`,
    width: 70,
    Cell: (cell: any) => {
      const scoreMap =
        cell.cell.row.original.student.StudentID in studentEventScoreMap
          ? studentEventScoreMap[cell.cell.row.original.student.StudentID]
          : {};
      return (
        <HouseAwardScoreCell
          event={event}
          scoreMap={scoreMap}
          isDisabled={isDisabled}
          eventType={type}
          studentId={cell.cell.row.original.student.StudentID}
          fileYear={fileYear}
          onAddedScore={() => setCount(MathHelper.add(count, 1))}
          onDeletedScore={() => setCount(MathHelper.add(count, 1))}
        />
      );
    }
  }));

  const getNotWardedScores = (cell: any) => {
    const notAwardedScores = Object.values(
      cell.cell.row.original.student.StudentID in studentNotAwardedMap
        ? studentNotAwardedMap[cell.cell.row.original.student.StudentID]
        : {}
    );
    return {
      total: getSumOfScores(notAwardedScores),
      scores: notAwardedScores
    };
  };

  const columnRightFix = [
    {
      Header: () => {
        return <div style={{ textAlign: "right" }}>Total {fileYear}</div>;
      },
      accessor: "total",
      width: 60,
      sticky: "right",
      Cell: (cell: any) => {
        const scoreMap =
          cell.cell.row.original.student.StudentID in studentEventScoreMap
            ? studentEventScoreMap[cell.cell.row.original.student.StudentID]
            : {};
        const lastTotal = cell.cell.row.original.lastYearTotal || 0;
        const total = MathHelper.add(lastTotal, Object.keys(scoreMap).length);
        return (
          <div style={{ textAlign: "right" }}>
            <b>{total === 0 ? null : total}</b>
          </div>
        );
      }
    },
    ...(isAwardable === true
      ? [
          {
            Header: () => {
              return (
                <div style={{ textAlign: "right" }}>Not Awarded Points</div>
              );
            },
            accessor: "currentYearTotal",
            width: 60,
            sticky: "right",
            Cell: (cell: any) => {
              const { total, scores } = getNotWardedScores(cell);
              return (
                <div className={"text-right"}>
                  {total === 0 ? null : (
                    <HouseAwardConfirmAwardPopupBtn
                      viewOnly={true}
                      variant={"link"}
                      scores={scores.filter(
                        score => score.event?.active === true
                      )}
                      eventType={type}
                      onAwarded={() => setCount(MathHelper.add(count, 1))}
                      student={cell.cell.row.original.student}
                      FileYear={fileYear}
                      events={events}
                      isDisabled={isDisabled}
                    >
                      {total}
                    </HouseAwardConfirmAwardPopupBtn>
                  )}
                </div>
              );
            }
          },
          ...(isDisabled === true
            ? []
            : [
                {
                  Header: () => {
                    return <div className={"text-right"}>Actions</div>;
                  },
                  accessor: "actions",
                  width: 70,
                  sticky: "right",
                  Cell: (cell: any) => {
                    const { total, scores } = getNotWardedScores(cell);
                    if (total < type.points_to_be_awarded) {
                      return null;
                    }
                    return (
                      <div className={"text-right"}>
                        <HouseAwardConfirmAwardPopupBtn
                          scores={scores.filter(
                            score => score.event?.active === true
                          )}
                          eventType={type}
                          onAwarded={() => setCount(MathHelper.add(count, 1))}
                          student={cell.cell.row.original.student}
                          FileYear={fileYear}
                          events={events}
                          isDisabled={isDisabled}
                        >
                          Award
                        </HouseAwardConfirmAwardPopupBtn>
                      </div>
                    );
                  }
                }
              ])
        ]
      : [])
  ];

  const getTable = () => {
    if ((isLoading || isLoadingStudents) && count <= 0) {
      return <Spinner animation={"border"} />;
    }
    if (Object.values(studentMap).length <= 0) {
      return null;
    }

    const students = Object.values(studentMap)
      .sort((student1, student2) =>
        student1.StudentSurname > student2.StudentSurname ? 1 : -1
      )
      .map(student => {
        return {
          student,
          lastYearTotal:
            isAwardable !== true
              ? 0
              : student.StudentID in studentScoreMap
              ? getSumOfScores(
                  studentScoreMap[student.StudentID].filter(score => {
                    if (score.FileYear >= fileYear) {
                      return false;
                    }
                    if (score.awarded_at !== null) {
                      return false;
                    }

                    // if (moment(score.awarded_at).year() < fileYear) {
                    //   return false;
                    // }
                    return true;
                  })
                )
              : 0
        };
      });
    return (
      <>
        <FlexContainer
          className={`summary-row ${house.Code.toLowerCase()} justify-content-between`}
        >
          <h5>
            ({students.length}) Student(s) in{" "}
            <u>Year {yearLevel?.Description}</u> {fileYear}:
          </h5>
          <CSVExportBtn // @ts-ignore
            fetchingFnc={() =>
              new Promise(resolve => {
                resolve(students);
              })
            }
            downloadFnc={() =>
              HouseAwardExportHelper.genExcel(
                students,
                house,
                yearLevel,
                fileYear,
                events,
                studentEventScoreMap,
                studentNotAwardedMap
              )
            }
            size={"sm"}
            variant={"link"}
          />
        </FlexContainer>
        <ReactTableWithFixedColumns
          htmlId={htmlId}
          className={"students-table"}
          isLoading={isLoading && count > 0}
          data={students}
          columns={[...columnLeftFix, ...columnEvents, ...columnRightFix]}
        />
      </>
    );
  };

  return <Wrapper>{getTable()}</Wrapper>;
};

export default HouseAwardScoreTable;
