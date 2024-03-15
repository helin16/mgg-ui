import styled from "styled-components";
import iVStudent from "../../../../types/Synergetic/Student/iVStudent";
import { Col, Image, Row } from "react-bootstrap";
import WellBeingGraphDetailsPanel from "./components/WellBeingGraphDetailsPanel";
import WellBeingGraphNurseVisitsPanel from "./components/WellBeingGraphNurseVisitsPanel";
import { mainBlue } from "../../../../AppWrapper";
import WellBeingAbsenceByClassChart from "./components/WellBeingAbsenceByClassChart";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/makeReduxStore";
import WellBeingAbsenceByReasonChart from "./components/WellBeingAbsenceByReasonChart";
import { useEffect, useState } from "react";
import SynVAbsenceService from "../../../../services/Synergetic/Absence/SynVAbsenceService";
import Toaster from "../../../../services/Toaster";
import PageLoadingSpinner from "../../../../components/common/PageLoadingSpinner";
import { OP_BETWEEN, OP_OR } from "../../../../helper/ServiceHelper";
import iSynVAbsence from "../../../../types/Synergetic/Absence/iSynVAbsence";
import SynVAttendanceService from "../../../../services/Synergetic/Attendance/SynVAttendanceService";
import iSynVAttendance from "../../../../types/Synergetic/Attendance/iSynVAttendance";
import WellBeingAbsenceByClassTable from "./components/WellBeingAbsenceByClassTable";
import { FlexContainer } from "../../../../styles";
import WellBeingStudentAlertsPanel from "./components/WellBeingStudentAlertsPanel";
import SynVActivityService from "../../../../services/Synergetic/SynVActivityService";
import iSynVActivity from "../../../../types/Synergetic/iSynVActivity";
import SynUStudentGiftedSummaryService from "../../../../services/Synergetic/SynUStudentGiftedSummaryService";
import iSynUStudentGiftedSummary from "../../../../types/Synergetic/iSynUStudentGiftedSummary";
import SynTPastoralCareService from "../../../../services/Synergetic/SynTPastoralCareService";
import WellBeingPastoralCareTable from "./components/WellBeingPastoralCareTable";
import iSynTPastoralCare from "../../../../types/Synergetic/iSynTPastoralCare";
import {
  ABSENCE_PERIOD_ALL_DAY,
  ABSENCE_TYPE_CODE_EARLY_SIGN_OUT,
  ABSENCE_TYPE_CODE_LATE_SIGN_IN
} from "../../../../types/StudentAbsence/iStudentAbsence";
import ISynFileSemester from "../../../../types/Synergetic/iSynFileSemester";
import SynFileSemesterSelector from "../../../../components/student/SynFileSemesterSelector";
import AbsenceListPopupBtn from "../../../../components/Absence/AbsenceListPopupBtn";
import moment from "moment-timezone";
import AttendanceRatePopupBtn from "../../../../components/Attendance/AttendanceRatePopupBtn";
import AttendanceHelper from "../../../../components/Attendance/AttendanceHelper";

const Wrapper = styled.div`
  .title {
    color: ${mainBlue};
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
      font-size: 18px;
      padding: 5px 0px;
    }
    .content_a {
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
  const [studentGiftedSummaries, setStudentGiftedSummaries] = useState<
    iSynUStudentGiftedSummary[]
  >([]);
  const [pastoralCares, setPastoralCares] = useState<iSynTPastoralCare[]>([]);
  const [selectedFileSemesters, setSelectedFileSemesters] = useState<
    ISynFileSemester[]
  >(
    currentUser?.SynCurrentFileSemester
      ? [currentUser?.SynCurrentFileSemester]
      : []
  );

  useEffect(() => {
    if (selectedFileSemesters.length <= 0) {
      setAbsences([]);
      setAttendances([]);
      setActivities([]);
      setStudentGiftedSummaries([]);
      setPastoralCares([]);
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
                  selectedFileSemester.EndDate
                ]
              }
            };
          })
        }),
        include: "SynLuAbsenceType,SynLuAbsenceReason",
        perPage: 999999
      }),
      SynVAttendanceService.getAll({
        where: JSON.stringify({
          ID: student.StudentID,
          FileYear: selectedFileSemesters.map(
            (selectedFileSemester: ISynFileSemester) =>
              selectedFileSemester.FileYear
          ),
          FileSemester: selectedFileSemesters.map(
            (selectedFileSemester: ISynFileSemester) =>
              selectedFileSemester.FileSemester
          )
        }),
        include: "PossibleAbsenceType",
        perPage: 999999
      }),
      SynVActivityService.getAllById(student.StudentID, {
        where: JSON.stringify({
          Activity: "LSEAL"
        })
      }),
      SynUStudentGiftedSummaryService.getAll({
        where: JSON.stringify({
          ID: student.StudentID,
          InExtensionFlag: true
        }),
        perPage: 999999
      }),
      SynTPastoralCareService.getAll({
        where: JSON.stringify({
          ID: student.StudentID
        }),
        include: "SynLuPastoralCareCategory",
        sort: "CreatedDate:DESC",
        perPage: 999999
      })
    ])
      .then(resp => {
        if (isCanceled) {
          return;
        }

        setAbsences(
          (resp[0].data || []).filter(
            absence =>
              !absence.SynLuAbsenceType ||
              absence.SynLuAbsenceType?.CountAsAbsenceFlag === true
          )
        );
        setAttendances(
          (resp[1].data || []).filter(att => {
            const withinDates = selectedFileSemesters
              .map(fileSemester => {
                return (
                  moment(att.AttendanceDate).isSameOrAfter(
                    moment(fileSemester.StartDate)
                  ) &&
                  moment(att.AttendanceDate).isSameOrBefore(
                    moment(fileSemester.EndDate)
                  )
                );
              })
              .filter(isWithIn => isWithIn === true);
            return withinDates.length > 0;
          })
        );
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
  }, [student, selectedFileSemesters]);

  const getExtensionComments = () => {
    const comments = studentGiftedSummaries.filter(
      studentGiftedSummary =>
        `${studentGiftedSummary.ExtensionComments || ""}`.trim() !== ""
    );
    if (comments.length <= 0) {
      return null;
    }
    return (
      <div className={"in-extension-comments"}>
        {comments.map((studentGiftedSummary, index) => {
          return (
            <div key={index} className={"in-extension-comment"}>
              {studentGiftedSummary.ExtensionComments}
            </div>
          );
        })}
      </div>
    );
  };

  const getSummaryDiv = (title: string, content: any) => {
    return (
      <div className={"sum-div"} style={{ width: "50%" }}>
        <div className={"title"}>{title}</div>
        <div className={"content"}>{content}</div>
      </div>
    );
  };

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
            values={selectedFileSemesters.map(
              selectedFileSemester => `${selectedFileSemester.FileSemestersSeq}`
            )}
            onSelect={selected => {
              if (!selected) {
                setSelectedFileSemesters(
                  currentUser?.SynCurrentFileSemester
                    ? [currentUser?.SynCurrentFileSemester]
                    : []
                );
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
        <Col lg={2} md={12} sm={12}>
          <Row>
            <Col>
              <Image src={student.profileUrl} />
            </Col>
            <Col>
              <WellBeingGraphDetailsPanel student={student} />
            </Col>
            <Col>
              <WellBeingGraphNurseVisitsPanel
                student={student}
                fileSemesters={selectedFileSemesters}
              />
            </Col>
          </Row>
        </Col>
        <Col md={5} sm={12}>
          <h4 className={"title"}>Absence By Class:</h4>
          <WellBeingAbsenceByClassChart
            student={student}
            attendances={attendances}
          />
          <WellBeingAbsenceByClassTable
            student={student}
            attendances={attendances}
            absences={absences}
          />
          <FlexContainer className={"with-gap lg-gap"}>
            <div style={{ width: "70%" }}>
              <FlexContainer className={"with-gap lg-gap"}>
                {getSummaryDiv(
                  "Late Arrivals",
                  <AbsenceListPopupBtn
                    popupTitle={
                      <>
                        Late arrivals for <u>{student.StudentNameExternal}</u>
                      </>
                    }
                    absences={absences.filter(
                      absence =>
                        absence.AbsenceType === ABSENCE_TYPE_CODE_LATE_SIGN_IN
                    )}
                    className={"content_a"}
                    variant={"link"}
                  >
                    {
                      absences.filter(
                        absence =>
                          absence.AbsenceType === ABSENCE_TYPE_CODE_LATE_SIGN_IN
                      ).length
                    }
                  </AbsenceListPopupBtn>
                )}

                {getSummaryDiv(
                  "All Day Absences",
                  <AbsenceListPopupBtn
                    popupTitle={
                      <>
                        All day absences for{" "}
                        <u>{student.StudentNameExternal}</u>
                      </>
                    }
                    absences={absences.filter(
                      absence =>
                        `${absence.AbsencePeriod || ""}`
                          .trim()
                          .toUpperCase() === ABSENCE_PERIOD_ALL_DAY
                    )}
                    className={"content_a"}
                    variant={"link"}
                  >
                    {
                      absences.filter(
                        absence =>
                          `${absence.AbsencePeriod || ""}`
                            .trim()
                            .toUpperCase() === ABSENCE_PERIOD_ALL_DAY
                      ).length
                    }
                  </AbsenceListPopupBtn>
                )}
              </FlexContainer>
              <FlexContainer className={"with-gap lg-gap"}>
                {getSummaryDiv(
                  "Early Departures",
                  <AbsenceListPopupBtn
                    popupTitle={
                      <>
                        Early Departures for{" "}
                        <u>{student.StudentNameExternal}</u>
                      </>
                    }
                    absences={absences.filter(
                      absence =>
                        `${absence.AbsencePeriod || ""}`
                          .trim()
                          .toUpperCase() === ABSENCE_TYPE_CODE_EARLY_SIGN_OUT
                    )}
                    className={"content_a"}
                    variant={"link"}
                  >
                    {
                      absences.filter(
                        absence =>
                          absence.AbsenceType ===
                          ABSENCE_TYPE_CODE_EARLY_SIGN_OUT
                      ).length
                    }
                  </AbsenceListPopupBtn>
                )}
                {getSummaryDiv(
                  "Attendance (%)",
                  <AttendanceRatePopupBtn
                    attendances={attendances}
                    popupTitle={
                      <>
                        Attendance Rate details for{" "}
                        <u>{student.StudentNameExternal}</u>
                      </>
                    }
                    className={"content_a"}
                    variant={"link"}
                  >
                    {AttendanceHelper.calculateAttendanceRate(attendances)}
                  </AttendanceRatePopupBtn>
                )}
              </FlexContainer>
            </div>
            <div className={"text-center"}>
              <h5 className={"title text-danger"}>Day Absence Reasons</h5>
              <div className={"content"}>
                {Object.values(
                  absences
                    .filter(
                      absence =>
                        `${absence.AbsencePeriod || ""}`
                          .trim()
                          .toUpperCase() === ABSENCE_PERIOD_ALL_DAY
                    )
                    .reduce((map, absence) => {
                      const key = `${absence.SynLuAbsenceReason?.Code ||
                        ""} - ${absence.Description || ""}`.trim();
                      return {
                        ...map,
                        [key]: {
                          reason: absence.SynLuAbsenceReason?.Description || "",
                          description: absence.Description || ""
                        }
                      };
                    }, {})
                ).map((absence, index) => {
                  return (
                    <div key={index}>
                      <b>
                        {
                          // @ts-ignore
                          absence.reason
                        }
                      </b>
                      <div>
                        <small>
                          {
                            // @ts-ignore
                            absence.description
                          }
                        </small>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </FlexContainer>
        </Col>
        <Col md={5} sm={12}>
          <h4 className={"title"}>Class Absence Reasons:</h4>
          <WellBeingAbsenceByReasonChart
            student={student}
            absences={absences}
          />
          <div>
            <h4 className={"title"}>Pastoral Care & Learning Support</h4>
            <FlexContainer className={"with-gap lg-gap"}>
              <WellBeingStudentAlertsPanel
                student={student}
                activities={activities}
                studentGiftedSummaries={studentGiftedSummaries}
              />
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
