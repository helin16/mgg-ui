import styled from "styled-components";
import iVStudent from "../../../../types/Synergetic/iVStudent";
import { Col, Image, Row } from "react-bootstrap";
import WellBeingGraphDetailsPanel from "./components/WellBeingGraphDetailsPanel";
import WellBeingGraphNurseVisitsPanel from "./components/WellBeingGraphNurseVisitsPanel";
import { mainBlue } from "../../../../AppWrapper";
import WellBeingAbsenceByClassChart from "./components/WellBeingAbsenceByClassChart";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/makeReduxStore";
import moment from "moment-timezone";
import WellBeingAbsenceByReasonChart from "./components/WellBeingAbsenceByReasonChart";
import { useEffect, useState } from "react";
import SynVAbsenceService from "../../../../services/Synergetic/Absence/SynVAbsenceService";
import Toaster from "../../../../services/Toaster";
import PageLoadingSpinner from "../../../../components/common/PageLoadingSpinner";
import { OP_BETWEEN } from "../../../../helper/ServiceHelper";
import iSynVAbsence from "../../../../types/Synergetic/Absence/iSynVAbsence";
import SynVAttendanceService from "../../../../services/Synergetic/Attendance/SynVAttendanceService";
import iSynVAttendance from "../../../../types/Synergetic/Attendance/iSynVAttendance";
import WellBeingAbsenceByClassTable from './components/WellBeingAbsenceByClassTable';
import {FlexContainer} from '../../../../styles';
import WellBeingStudentAlertsPanel from './components/WellBeingStudentAlertsPanel';
import SynVActivityService from '../../../../services/Synergetic/SynVActivityService';
import iSynVActivity from '../../../../types/Synergetic/iSynVActivity';
import SynUStudentGiftedSummaryService from '../../../../services/Synergetic/SynUStudentGiftedSummaryService';
import iSynUStudentGiftedSummary from '../../../../types/Synergetic/iSynUStudentGiftedSummary';
import SynTPastoralCareService from '../../../../services/Synergetic/SynTPastoralCareService';
import WellBeingPastoralCareTable from './components/WellBeingPastoralCareTable';
import iSynTPastoralCare from '../../../../types/Synergetic/iSynTPastoralCare';
import {
  ABSENCE_PERIOD_ALL_DAY,
  ABSENCE_TYPE_CODE_EARLY_SIGN_OUT,
  ABSENCE_TYPE_CODE_LATE_SIGN_IN
} from '../../../../types/StudentAbsence/iStudentAbsence';

const Wrapper = styled.div`
  .title {
    color: ${mainBlue};
  }
  .highcharts-credits {
    display: none;
  }

  .row {
    [class^="col-"] {
      padding-top: 1rem;
    }
  }

  .chart-wrapper {
    width: 80%;
    margin: auto;
  }
  
  .alerts-table {
    width: 40%;
  }
  .in-extension-comments {
    padding: 0.6rem;
  }
  
  .sum-div {
    text-align: center;
    border: 1px ${mainBlue} solid;
    margin-bottom: 1rem;
    .title {
      background-color: ${mainBlue};
      color: white;
      font-size: 23px;
      padding: 5px 0px;
    }
    .content {
      padding: 1rem 0px;
      font-size: 32px;
      color: ${mainBlue};
    }
  }
`;

type iWellBeingGraphPanel = {
  student: iVStudent;
};
const WellBeingGraphPanel = ({ student }: iWellBeingGraphPanel) => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [absences, setAbsences] = useState<iSynVAbsence[]>([]);
  const [attendances, setAttendances] = useState<iSynVAttendance[]>([]);
  const [activities, setActivities] = useState<iSynVActivity[]>([]);
  const [studentGiftedSummaries, setStudentGiftedSummaries] = useState<iSynUStudentGiftedSummary[]>([]);
  const [pastoralCares, setPastoralCares] = useState<iSynTPastoralCare[]>([]);
  const currentYear =
    currentUser?.SynCurrentFileSemester?.FileYear || moment().year();
  const currentSemester =
    currentUser?.SynCurrentFileSemester?.FileSemester || 1;

  useEffect(() => {
    let isCanceled = false;
    setIsLoading(false);
    Promise.all([
      SynVAbsenceService.getAll({
        where: JSON.stringify({
          ID: student.StudentID,
          AbsenceDate: {
            [OP_BETWEEN]: currentUser?.SynCurrentFileSemester
              ? [
                currentUser?.SynCurrentFileSemester.StartDate,
                currentUser?.SynCurrentFileSemester.EndDate,
              ]
              : [
                  `${currentYear}-01-01T00:00:00`,
                  `${currentYear}-12-31T23:59:59`
                ]
          }
        }),
        include: "SynLuAbsenceType,SynLuAbsenceReason",
        perPage: 999999
      }),
      SynVAttendanceService.getAll({
        where: JSON.stringify({
          ID: student.StudentID,
          FileYear: currentYear,
          FileSemester: currentSemester
        }),
        perPage: 999999
      }),
      SynVActivityService.getAllById(student.StudentID, {
        where: JSON.stringify({
          Activity: 'LSEAL',
        })
      }),
      SynUStudentGiftedSummaryService.getAll({
        where: JSON.stringify({
          ID: student.StudentID,
          InExtensionFlag: true,
        }),
        perPage: 999999
      }),
      SynTPastoralCareService.getAll({
        where: JSON.stringify({
          ID: student.StudentID,
        }),
        include: 'SynLuPastoralCareCategory',
        sort: 'CreatedDate:DESC',
        perPage: 999999
      })
    ])
      .then(resp => {
        if (isCanceled) {
          return;
        }
        setAbsences(resp[0].data || []);
        setAttendances(resp[1].data || []);
        setActivities(resp[2].data || []);
        setStudentGiftedSummaries(resp[3].data || []);
        setPastoralCares(resp[4].data || []);
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
  }, [student, currentUser, currentYear, currentSemester]);

  const getExtensionComments = () => {
    const comments = studentGiftedSummaries.filter(studentGiftedSummary => `${studentGiftedSummary.ExtensionComments || ''}`.trim() !== '');
    if (comments.length <= 0) {
      return null;
    }
    return (
      <div className={'in-extension-comments'}>
        {comments.map((studentGiftedSummary, index) => {
          return <div key={index}>{studentGiftedSummary.ExtensionComments}</div>;
        })}
      </div>
    )
  }

  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  return (
    <Wrapper>
      <Row>
        <Col md={2} sm={4}>
          <Image src={student.profileUrl} />
          <WellBeingGraphDetailsPanel student={student} />
          <WellBeingGraphNurseVisitsPanel student={student} />
        </Col>
        <Col md={5} sm={4}>
          <h4 className={"title"}>
            Absence By Class: {currentYear} Term {currentSemester}
          </h4>
          <WellBeingAbsenceByClassChart
            student={student}
            attendances={attendances}
          />
          <WellBeingAbsenceByClassTable
            student={student}
            attendances={attendances}
            absences={absences}
          />
          <FlexContainer className={'with-gap lg-gap'}>
            <div style={{width: '70%'}}>
              <FlexContainer className={'with-gap lg-gap'}>
                <div className={'sum-div'} style={{width: '50%'}}>
                  <div className={"title"}>Late Arrivals</div>
                  <div className={"content"}>
                    {absences.filter(absence => absence.AbsenceType === ABSENCE_TYPE_CODE_LATE_SIGN_IN).length}
                  </div>
                </div>
                <div className={'sum-div'}   style={{width: '50%'}}>
                  <div className={"title"}>All Day Absences</div>
                  <div className={"content"}>
                    {absences.filter(absence => `${absence.AbsencePeriod || ''}`.trim().toUpperCase() === ABSENCE_PERIOD_ALL_DAY).length}
                  </div>
                </div>
              </FlexContainer>
              <FlexContainer className={'with-gap lg-gap'}>
                <div className={'sum-div'} style={{width: '50%'}}>
                  <h5 className={"title"}>Early Departures</h5>
                  <div className={"content"}>
                    {absences.filter(absence => absence.AbsenceType === ABSENCE_TYPE_CODE_EARLY_SIGN_OUT).length}
                  </div>
                </div>
                <div className={'sum-div'} style={{width: '50%'}}>
                  <div className={"title"}>Roll Call Absence (%)</div>
                  <div className={"content"}>
                    {/*format(CALCULATE(count(Attendance[AttendanceDate]),Attendance[HMPeriodMissed]=1)/CALCULATE(count(Attendance[AttendanceDate]),Attendance[AttendancePeriod]=1),"Percent")*/}
                  </div>
                </div>
              </FlexContainer>
            </div>
            <div className={'text-center'}>
              <h5 className={"title text-danger"}>Day Absence Reasons</h5>
              <div className={"content"}>
                {
                  absences.filter(absence => `${absence.AbsencePeriod || ''}`.trim().toUpperCase() === ABSENCE_PERIOD_ALL_DAY)
                    .map((absence, index) => {
                      return <div key={index} ><b>{absence.SynLuAbsenceReason?.Description}</b><div><small>{absence.Description || ''}</small></div></div>
                    })
                }
              </div>
            </div>
          </FlexContainer>
        </Col>
        <Col md={5} sm={4}>
          <h4 className={"title"}>
            Class Absence Reasons: {currentYear} Term {currentSemester}
          </h4>
          <WellBeingAbsenceByReasonChart
            student={student}
            absences={absences}
          />
          <div>
            <h4 className={"title"}>
              Pastoral Care & Learning Support
            </h4>
            <FlexContainer className={'with-gap lg-gap'}>
              <WellBeingStudentAlertsPanel student={student} activities={activities} studentGiftedSummaries={studentGiftedSummaries}/>
              {getExtensionComments()}
            </FlexContainer>
          </div>
          <WellBeingPastoralCareTable pastoralCares={pastoralCares} />
        </Col>
      </Row>
    </Wrapper>
  );
};

export default WellBeingGraphPanel;
