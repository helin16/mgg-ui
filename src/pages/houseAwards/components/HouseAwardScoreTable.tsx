import iSynLuHouse from '../../../types/Synergetic/Lookup/iSynLuHouse';
import iHouseAwardEventType from '../../../types/HouseAwards/iHouseAwardEventType';
import styled from 'styled-components';
import {useEffect, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import Toaster from '../../../services/Toaster';
import ReactTableWithFixedColumns from '../../../components/common/ReactTableWithFixedColumns';
import ISynLuYearLevel from '../../../types/Synergetic/Lookup/iSynLuYearLevel';
import iHouseAwardEvent from '../../../types/HouseAwards/iHouseAwardEvent';
import iVStudent from '../../../types/Synergetic/iVStudent';
import HouseAwardStudentYearService from '../../../services/HouseAwards/HouseAwardStudentYearService';
import iHouseAwardStudentYear from '../../../types/HouseAwards/iHouseAwardStudentYear';
import iHouseAwardScore from '../../../types/HouseAwards/iHouseAwardScore';
import HouseAwardScoreService from '../../../services/HouseAwards/HouseAwardScoreService';
import MathHelper from '../../../helper/MathHelper';
import HouseAwardScoreCell from './HouseAwardScoreCell';
import HouseAwardConfirmAwardPopupBtn from './HouseAwardConfirmAwardPopupBtn';
import {OP_LTE} from '../../../helper/ServiceHelper';
import SynVStudentService from '../../../services/Synergetic/Student/SynVStudentService';
import CSVExportBtn from '../../../components/form/CSVExportBtn';
import {FlexContainer} from '../../../styles';
import HouseAwardExportHelper from './HouseAwardExportHelper';

type iHouseAwardScoreTable = {
  house: iSynLuHouse;
  type: iHouseAwardEventType;
  yearLevel: ISynLuYearLevel;
  fileYear: number;
  htmlId?: string;
  events: iHouseAwardEvent[];
  isDisabled?: boolean;
  isLoadingStudents?: boolean;
}
const Wrapper = styled.div`
`;
const HouseAwardScoreTable = ({
  house,
  htmlId,
  type,
  yearLevel,
  fileYear,
  events,
  isDisabled = false,
  isLoadingStudents = false,
}: iHouseAwardScoreTable) => {
  const [isLoading, setIsLoading] = useState(isLoadingStudents);
  const [studentMap, setStudentMap] = useState<{ [key: number]: iVStudent }>({});
  const [lastStudentYearMap, setLastStudentYearMap] = useState<{ [key: number]: iHouseAwardStudentYear }>({});
  const [studentScoreMap, setStudentScoreMap] = useState<{ [key: number]: {[key: number]: iHouseAwardScore} }>({});
  const [notAwardedScoreMap, setNotAwardedScoreMap] = useState<{ [key: number]: {[key: number]: iHouseAwardScore} }>({});
  const [loadingStudentId, setLoadingStudentId] = useState<number | null>(null);
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
            StudentYearLevel: yearLevel.Code,
          }),
          sort: 'StudentSurname:ASC,StudentPreferred:ASC',
        });
        if (isCanceled) return;
        const studMap  = students.reduce((m, student) => {
          return {
            ...m,
            [student.StudentID]: student,
          }
        }, {});
        setStudentMap(studMap);
        const[houseAwardScores, houseAwardYears] = await Promise.all([
          HouseAwardScoreService.getScores({
            where: JSON.stringify( {
              FileYear: fileYear,
              StudentID: Object.keys(studMap),
              event_type_id: type.id,
              active: 1,
            }),
            include: 'event'
          }),
          HouseAwardStudentYearService.getStudentYears({
            where: JSON.stringify({
              FileYear: MathHelper.sub(fileYear, 1),
              StudentID: Object.keys(studMap),
              event_type_id: type.id,
              active: 1,
            }),
            sort: 'updated_at:ASC',
          }),
        ]);

        if (isCanceled) return;
        setStudentScoreMap(houseAwardScores.reduce((map, score) => {
          if (!(score.StudentID in map)) {
            return {
              ...map,
              [score.StudentID]: {[score.event_id]: score}
            }
          }
          return {
            ...map,
            [score.StudentID]: {
              // @ts-ignore
              ...(map[score.StudentID] || {}),
              [score.event_id]: score,
            }
          }
        }, {}));
        setNotAwardedScoreMap(houseAwardScores.filter(score => score.awarded_id === null).reduce((map, score) => {
          if (!(score.StudentID in map)) {
            return {
              ...map,
              [score.StudentID]: {[score.event_id]: score}
            }
          }
          return {
            ...map,
            [score.StudentID]: {
              // @ts-ignore
              ...(map[score.StudentID] || {}),
              [score.event_id]: score,
            }
          }
        }, {}));
        setLastStudentYearMap(houseAwardYears.reduce((map, studentYear) => {
          return {
            ...map,
            [studentYear.StudentID]: studentYear,
          }
        }, {}));

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      isCanceled = true;
    }
  }, [house, type, yearLevel, events, fileYear, count]);

  const columnLeftFix = [
    {
      Header: "ID",
      accessor: "student.StudentID",
      sticky: "left",
    }, {
      Header: "Surname",
      accessor: "student.StudentSurname",
      sticky: "left",
    },
    {
      Header: 'Preferred Name',
      accessor: 'student.StudentPreferred',
      sticky: "left",
    },
    {
      Header: `Year ${fileYear - 1}`,
      accessor: 'lastYearTotal',
      sticky: "left",
    }];

  const onRefreshStudentYear = (studentId: number) => {
    setLoadingStudentId(studentId)
    Promise.all([
      HouseAwardScoreService.getScores({
        where: JSON.stringify( {
          StudentID: Object.keys(studentMap),
          event_type_id: type.id,
          awarded_id: null,
          active: 1,
          FileYear: { [OP_LTE] : fileYear},
        }),
      })
    ]).then(resp => {
      setNotAwardedScoreMap(resp[0].reduce((map, score) => {
        if (!(score.StudentID in map)) {
          return {
            ...map,
            [score.StudentID]: {[score.event_id]: score}
          }
        }
        return {
          ...map,
          [score.StudentID]: {
            // @ts-ignore
            ...(map[score.StudentID] || {}),
            [score.event_id]: score,
          }
        }
      }, {}))
    }).catch(err => {
      Toaster.showApiError(err);
    }).finally(() => {
      setLoadingStudentId(null);
    })
  }

  const columnEvents = events.map(event => ({
    Header: () => {
      return <div style={{ textAlign: 'center' }}>{event.name}</div>;
    },
    accessor: `${event.id}`,
    width: 70,
    Cell: (cell: any) => {
      const scoreMap = (cell.cell.row.original.student.StudentID in studentScoreMap ? studentScoreMap[cell.cell.row.original.student.StudentID] : {});
      return cell.cell.row.original.student.StudentID === loadingStudentId ?
        <Spinner animation={'border'} size={'sm'}/> : (
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
    const notAwardedScores = Object.values(cell.cell.row.original.student.StudentID in notAwardedScoreMap ? notAwardedScoreMap[cell.cell.row.original.student.StudentID] : {});
    return {
      total: notAwardedScores.reduce((sum, score) => MathHelper.add(sum, score.score), 0),
      scores: notAwardedScores
    };
  }

  const handleOnAwarded = (scores: iHouseAwardScore[], newStudentYear: iHouseAwardStudentYear) => {
    setStudentScoreMap(scores.filter(score => score.FileYear === fileYear).reduce((map, score) => {
      if (!(score.StudentID in map)) {
        return {
          ...map,
          [score.StudentID]: {[score.event_id]: score}
        }
      }
      return {
        ...map,
        [score.StudentID]: {
          // @ts-ignore
          ...(map[score.StudentID] || {}),
          [score.event_id]: score,
        }
      }
    }, studentScoreMap))
    onRefreshStudentYear(newStudentYear.StudentID);
  }

  const columnRightFix = [{
      Header: () => {
        return <div style={{ textAlign: 'right' }}>Total {fileYear}</div>;
      },
      accessor: "total",
      sticky: 'right',
      Cell: (cell: any) => {
        const scoreMap = (cell.cell.row.original.student.StudentID in studentScoreMap ? studentScoreMap[cell.cell.row.original.student.StudentID] : {});
        const lastTotal = cell.cell.row.original.lastYearTotal || 0;
        const total = MathHelper.add(lastTotal, Object.keys(scoreMap).length);
        return <div style={{ textAlign: 'right' }}><b>{total === 0 ? null : total}</b></div>;
      }
    },
    {
      Header: () => {
        return <div style={{ textAlign: 'right' }}>Not Awarded Points</div>;
      },
      accessor: "currentYearTotal",
      sticky: 'right',
      Cell: (cell: any) => {
        const {total} = getNotWardedScores(cell);
        return (
          <div style={{ textAlign: 'right' }}>
            {
              cell.cell.row.original.student.StudentID === loadingStudentId ?
              <Spinner animation={'border'} size={'sm'}/> :
              <b>{total === 0 ? null : total}</b>
            }
          </div>
        );
      }
    },
    {
      Header: () => {
        return <div style={{ textAlign: 'right' }}>Actions</div>;
      },
      accessor: "actions",
      sticky: 'right',
      Cell: (cell: any) => {
        const {total, scores} = getNotWardedScores(cell);
        if (total < type.points_to_be_awarded) {
          return null;
        }
        return (
          <div style={{ textAlign: 'right' }}>
            <HouseAwardConfirmAwardPopupBtn
              scores={scores.filter(score => score.event?.active === true)}
              type={type}
              onAwarded={handleOnAwarded}
              student={cell.cell.row.original.student}
              FileYear={fileYear}
              events={events}
              isDisabled={isDisabled}
            />
          </div>
        );
      },
    }];


  const getTable = () => {
    if ((isLoading || isLoadingStudents) && count <= 0 ) {
      return <Spinner animation={'border'} />
    }
    if (Object.values(studentMap).length <= 0) {
      return null;
    }

    const students = Object.values(studentMap)
      .sort((student1, student2) => student1.StudentSurname > student2.StudentSurname ? 1 : -1)
      .map(student => {
        return {
          student,
          lastYearTotal: (student.StudentID in lastStudentYearMap ? lastStudentYearMap[student.StudentID].total_score_minus_award : 0),
        }
      });
    return (
      <>
        <FlexContainer className={`summary-row ${house.Code.toLowerCase()} justify-content-between`}>
          <h5>
            ({students.length}) Student(s) in <u>Year {yearLevel?.Description}</u> {fileYear}:
          </h5>
          <CSVExportBtn // @ts-ignore
            fetchingFnc={() =>
              new Promise(resolve => {
                resolve(students);
              })
            }
            downloadFnc={() => HouseAwardExportHelper.genExcel(students, house, yearLevel, fileYear, events, studentScoreMap)}
            size={"sm"}
            variant={"link"}
          />
        </FlexContainer>
        <ReactTableWithFixedColumns
          htmlId={htmlId}
          className={'students-table'}
          isLoading={isLoading && count > 0}
          data={students}
          columns={[
            ...columnLeftFix,
            ...columnEvents,
            ...columnRightFix,
          ]}
        />
      </>
    )
  }

  return (
    <Wrapper>
      {getTable()}
    </Wrapper>
  );
}

export default HouseAwardScoreTable;
