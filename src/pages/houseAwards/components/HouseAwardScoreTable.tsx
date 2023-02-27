import iSynLuHouse from '../../../types/Synergetic/iSynLuHouse';
import iHouseAwardEventType from '../../../types/HouseAwards/iHouseAwardEventType';
import styled from 'styled-components';
import {useEffect, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import Toaster from '../../../services/Toaster';
import ReactTableWithFixedColumns from '../../../components/common/ReactTableWithFixedColumns';
import iLuYearLevel from '../../../types/Synergetic/iLuYearLevel';
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
import SynVStudentService from '../../../services/Synergetic/SynVStudentService';

type iHouseAwardScoreTable = {
  house: iSynLuHouse;
  type: iHouseAwardEventType;
  yearLevel: iLuYearLevel;
  fileYear: number;
  events: iHouseAwardEvent[];
  isDisabled?: boolean;
  isLoadingStudents?: boolean;
}
const Wrapper = styled.div`
`;
const HouseAwardScoreTable = ({
  house,
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

  useEffect(() => {
    let isCanceled = false;

    const fetchData = async () => {
      try {
        setIsLoading(false);
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
  }, [house, type, yearLevel, events, fileYear]);

  const columnLeftFix = [
    {
      Header: "ID",
      accessor: "student.StudentID",
      sticky: "left",
      width: 50,
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
      width: 30,
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
          onAddedScore={(newScore: iHouseAwardScore) => {
            setStudentScoreMap({
              ...studentScoreMap,
              [newScore.StudentID]: {
                ...studentScoreMap[newScore.StudentID],
                [newScore.event_id]: newScore,
              }
            })
            onRefreshStudentYear(cell.cell.row.original.student.StudentID);
          }}
          onDeletedScore={(deletedScore: iHouseAwardScore) => {
            if (!(deletedScore.StudentID in studentScoreMap)) {
              return;
            }
            if (!(deletedScore.event_id in studentScoreMap[deletedScore.StudentID])) {
              return;
            }
            delete studentScoreMap[deletedScore.StudentID][deletedScore.event_id];
            setStudentScoreMap({...studentScoreMap})
            onRefreshStudentYear(cell.cell.row.original.student.StudentID);
          }}
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
      width: 40,
      Cell: (cell: any) => {
        const scoreMap = (cell.cell.row.original.student.StudentID in studentScoreMap ? studentScoreMap[cell.cell.row.original.student.StudentID] : {});
        const lastTotal = cell.cell.row.original.lastYearTotal || 0;
        return <div style={{ textAlign: 'right' }}><b>{MathHelper.add(lastTotal, Object.keys(scoreMap).length)}</b></div>;
      }
    },
    {
      Header: () => {
        return <div style={{ textAlign: 'right' }}>Not Awarded Points</div>;
      },
      accessor: "currentYearTotal",
      sticky: 'right',
      width: 60,
      Cell: (cell: any) => {
        const {total} = getNotWardedScores(cell);
        return (
          <div style={{ textAlign: 'right' }}>
            {
              cell.cell.row.original.student.StudentID === loadingStudentId ?
              <Spinner animation={'border'} size={'sm'}/> :
              <b>{total}</b>
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
      width: 70,
      Cell: (cell: any) => {
        const {total, scores} = getNotWardedScores(cell);
        if (total < type.points_to_be_awarded) {
          return null;
        }
        return (
          <div style={{ textAlign: 'right' }}>
            <HouseAwardConfirmAwardPopupBtn
              scores={scores}
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

  const tableColumns = [
    ...columnLeftFix,
    ...columnEvents,
    ...columnRightFix,
  ];

  const tableData = Object.values(studentMap)
    .sort((student1, student2) => student1.StudentSurname > student2.StudentSurname ? 1 : -1)
    .map(student => {
      return {
        student,
        lastYearTotal: (student.StudentID in lastStudentYearMap ? lastStudentYearMap[student.StudentID].total_score_minus_award : 0),
      }
    });


  const getTable = () => {
    if (Object.values(studentMap).length <= 0) {
      return null;
    }
    return (
      <ReactTableWithFixedColumns
        data={tableData}
        columns={tableColumns}
      />
    )
  }

  if (isLoading || isLoadingStudents) {
    return <Spinner animation={'border'} />
  }

  return (
    <Wrapper>
      {getTable()}
    </Wrapper>
  );
}

export default HouseAwardScoreTable;
