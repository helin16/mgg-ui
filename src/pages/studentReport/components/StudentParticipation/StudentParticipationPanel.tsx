import styled from 'styled-components';
import {Col, Row} from 'react-bootstrap';
import iVStudent from '../../../../types/Synergetic/iVStudent';
import {mainBlue, mainRed} from '../../../../AppWrapper';
import {FlexContainer} from '../../../../styles';
import SectionDiv from '../../../../components/common/SectionDiv';
import WellBeingGraphNurseVisitsPanel from '../WellBeingGraphs/components/WellBeingGraphNurseVisitsPanel';
import {useEffect, useState} from 'react';
import SynVAbsenceService from '../../../../services/Synergetic/Absence/SynVAbsenceService';
import {OP_BETWEEN, OP_OR} from '../../../../helper/ServiceHelper';
import ISynFileSemester from '../../../../types/Synergetic/iSynFileSemester';
import PageLoadingSpinner from '../../../../components/common/PageLoadingSpinner';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../redux/makeReduxStore';
import iSynVAbsence from '../../../../types/Synergetic/Absence/iSynVAbsence';
import Toaster from '../../../../services/Toaster';
import {ABSENCE_PERIOD_ALL_DAY} from '../../../../types/StudentAbsence/iStudentAbsence';
import HouseAwardScoreService from '../../../../services/HouseAwards/HouseAwardScoreService';
import iHouseAwardScore from '../../../../types/HouseAwards/iHouseAwardScore';
import {
  HOUSE_AWARD_EVENT_TYPE_ACHIEVEMENTS,
  HOUSE_AWARD_EVENT_TYPE_SERVICES
} from '../../../../types/HouseAwards/iHouseAwardEventType';
import SynFileSemesterSelector from '../../../../components/student/SynFileSemesterSelector';
import SynVStudentAwardService from '../../../../services/Synergetic/Student/SynVStudentAwardService';
import iStudentReportAward from '../../../../types/Synergetic/iStudentReportAward';
import SynVStudentCoCurricularService from '../../../../services/Synergetic/Student/SynVStudentCoCurricularService';
import iStudentReportCoCurricular from '../../../../types/Synergetic/iStudentReportCoCurricular';
import CoCurricularByTypeChartWithTable from './components/CoCurricularByTypeChartWithTable';
import LeadershipAndAwardByTypChartWithTable from './components/LeadershipAndAwardByTypChartWithTable';

const Wrapper = styled.div`
  .title-row {
    color: ${mainBlue};
  }

  .sum-div {
    text-align: center;
    border: 1px ${mainBlue} solid;
    width: 50%;
    .title {
      background-color: ${mainBlue};
      color: white;
      font-size: 16px;
      padding: 5px 0px;
    }
    .content {
      padding: 1rem 0px;
      font-size: 32px;
      color: ${mainBlue};
    }
    
    &.orange {
      border-color: #C13C02;
      .title {
        background-color: #C13C02;
      }
    }
    
    &.red {
      border-color: ${mainRed};
      .title {
        background-color: ${mainRed};
      }
    }
  }

  .nurse-visits {
    width: 50%;
    padding: 8px;
  }
`;


type iStudentParticipationPanel = {
  student: iVStudent;
}
const StudentParticipationPanel = ({student}: iStudentParticipationPanel) => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [selectedFileSemesters, setSelectedFileSemesters] = useState<ISynFileSemester[]>(currentUser?.SynCurrentFileSemester ? [currentUser?.SynCurrentFileSemester] : []);
  const [isLoading, setIsLoading] = useState(false);
  const [absences, setAbsences] = useState<iSynVAbsence[]>([]);
  const [houseScores, setHouseScores] = useState<iHouseAwardScore[]>([]);
  const [awards, setAwards] = useState<iStudentReportAward[]>([]);
  const [coCurricular, setCoCurricular] = useState<iStudentReportCoCurricular[]>([]);

  useEffect(() => {
    if (selectedFileSemesters.length <= 0) {
      setAbsences([]);
      setHouseScores([]);
      setAwards([]);
      setCoCurricular([]);
      return;
    }
    let isCanceled = false;
    setIsLoading(false);
    Promise.all([
      SynVAbsenceService.getAll({
        where: JSON.stringify({
          ID: student.StudentID,
          [OP_OR]: selectedFileSemesters.map(selectedFileSemester => {
            return {
              AbsenceDate: {
                [OP_BETWEEN]: [
                  selectedFileSemester.StartDate,
                  selectedFileSemester.EndDate,
                ]
              }
            }
          })
        }),
        include: "SynLuAbsenceType,SynLuAbsenceReason",
        perPage: 999999
      }),

      HouseAwardScoreService.getScores({
        where: JSON.stringify({
          StudentID: student.StudentID,
          awarded_at: null,
          awarded_by_id: null,
          active: true,
          [OP_OR]: selectedFileSemesters.map(selectedFileSemester => {
            return {
              created_at: {
                [OP_BETWEEN]: [
                  selectedFileSemester.StartDate,
                  selectedFileSemester.EndDate,
                ]
              }
            }
          })
        }),
        include: "event,eventType",
      }),

      SynVStudentAwardService.getAll({
        where: JSON.stringify({
          ID: student.StudentID,
          [OP_OR]: selectedFileSemesters.map(selectedFileSemester => {
            return {
              FileYear: selectedFileSemester.FileYear,
              FileSemester: selectedFileSemester.FileSemester,
            }
          })
        })
      }),

      SynVStudentCoCurricularService.getAll({
        where: JSON.stringify({
          ID: student.StudentID,
          [OP_OR]: selectedFileSemesters.map(selectedFileSemester => {
            return {
              FileYear: selectedFileSemester.FileYear,
              FileSemester: selectedFileSemester.FileSemester,
            }
          })
        })
      }),
    ]).then(resp => {
        if (isCanceled) {
          return;
        }
        setAbsences(resp[0].data || []);
        setHouseScores(resp[1] || []);
        setAwards(resp[2].data || []);
        setCoCurricular(resp[3].data || []);
      })
      .catch(err => {
        if (isCanceled) {
          return;
        }
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) {
          return;
        }
        setIsLoading(false);
      });

    return () => {
      isCanceled = true;
    };
  }, [student, selectedFileSemesters]);

  const getSumDiv = (title: string, content: string | number, className?: string) => {
    return (
      <div className={`sum-div ${className || ''}`}>
        <div className={"title"}>{title}</div>
        <div className={"content"}>{content}</div>
      </div>
    )
  }

  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  return (
    <Wrapper>
      <Row>
        <Col>
          Showing Semesters
          <SynFileSemesterSelector
            isMulti
            allowClear={false}
            values={selectedFileSemesters.map(selectedFileSemester => `${selectedFileSemester.FileSemestersSeq}`)}
            onSelect={selected => {
              if (!selected) {
                setSelectedFileSemesters(currentUser?.SynCurrentFileSemester ? [currentUser?.SynCurrentFileSemester] : []);
                return;
              }

              if (Array.isArray(selected)) {
                setSelectedFileSemesters(selected.map(option => option.data));
              }
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <SectionDiv className={'sm-top'}>
            <h6 className={'title-row'}>Co-Curricular, Leadership and Awards</h6>
            <FlexContainer className={'withGap lg-gap justify-content-between align-items-stretch'}>
              {getSumDiv('Col-Curricular', coCurricular.length, 'orange')}
              {getSumDiv('Leadership & Awards', awards.length)}
            </FlexContainer>
          </SectionDiv>

          <SectionDiv className={'sm-top'}>
            <h6 className={'title-row'}>House points since <i>last award</i> {student.StudentHouseDescription}</h6>
            <FlexContainer className={'withGap lg-gap justify-content-between align-items-stretch'}>
              {getSumDiv('Achievements', houseScores.filter(score => `${score?.eventType?.name || ''}`.trim() === HOUSE_AWARD_EVENT_TYPE_ACHIEVEMENTS).length)}
              {getSumDiv('Services', houseScores.filter(score => `${score?.eventType?.name || ''}`.trim() === HOUSE_AWARD_EVENT_TYPE_SERVICES).length)}
            </FlexContainer>
          </SectionDiv>

          <SectionDiv className={'sm-top'}>
            <h6 className={'title-row'}>Late Arrivals and Absences</h6>
            <FlexContainer className={'withGap lg-gap justify-content-between align-items-stretch'}>
              {getSumDiv('Late Arrivals', absences.filter(absence => absence.LateArrivalFlag === true).length, 'red')}
              {getSumDiv('Early Departures', absences.filter(absence => `${absence.EarlyDepartureTime || ''}`.trim() === '').length, 'red')}
            </FlexContainer>
          </SectionDiv>

          <SectionDiv className={'sm-top'}>
            <FlexContainer className={'withGap lg-gap justify-content-between align-items-stretch'}>
              <WellBeingGraphNurseVisitsPanel student={student} className={'nurse-visits'} fileSemesters={selectedFileSemesters}/>
              {getSumDiv('All Day Absence', absences.filter(absence => absence.AbsencePeriod === ABSENCE_PERIOD_ALL_DAY).length, 'red')}
            </FlexContainer>
          </SectionDiv>

        </Col>
        <Col md={5}>
          <SectionDiv className={'sm-top'}>
            <h6 className={'title-row'}>Co-Curricular Involvement</h6>
            <CoCurricularByTypeChartWithTable student={student} coCurriculars={coCurricular} />
          </SectionDiv>
        </Col>
        <Col md={4}>
          <SectionDiv className={'sm-top'}>
            <h6 className={'title-row'}>Leadership and Awards</h6>
            <LeadershipAndAwardByTypChartWithTable student={student} awards={awards} />
          </SectionDiv>
        </Col>
      </Row>
    </Wrapper>
  )
}

export default StudentParticipationPanel;
