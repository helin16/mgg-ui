import styled from "styled-components";
import { Col, Row } from "react-bootstrap";
import iVStudent from "../../../../types/Synergetic/iVStudent";
import { mainRed } from "../../../../AppWrapper";
import { FlexContainer } from "../../../../styles";
import SectionDiv from "../../../../components/common/SectionDiv";
import WellBeingGraphNurseVisitsPanel from "../WellBeingGraphs/components/WellBeingGraphNurseVisitsPanel";
import { useEffect, useState } from "react";
import SynVAbsenceService from "../../../../services/Synergetic/Absence/SynVAbsenceService";
import { OP_BETWEEN, OP_OR } from "../../../../helper/ServiceHelper";
import ISynFileSemester from "../../../../types/Synergetic/iSynFileSemester";
import PageLoadingSpinner from "../../../../components/common/PageLoadingSpinner";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/makeReduxStore";
import iSynVAbsence from "../../../../types/Synergetic/Absence/iSynVAbsence";
import Toaster from "../../../../services/Toaster";
import { ABSENCE_PERIOD_ALL_DAY } from "../../../../types/StudentAbsence/iStudentAbsence";
import HouseAwardScoreService from "../../../../services/HouseAwards/HouseAwardScoreService";
import iHouseAwardScore from "../../../../types/HouseAwards/iHouseAwardScore";
import {
  HOUSE_AWARD_EVENT_TYPE_ACHIEVEMENTS,
  HOUSE_AWARD_EVENT_TYPE_SERVICES
} from "../../../../types/HouseAwards/iHouseAwardEventType";
import SynFileSemesterSelector from "../../../../components/student/SynFileSemesterSelector";
import SynVStudentAwardService from "../../../../services/Synergetic/Student/SynVStudentAwardService";
import iStudentReportAward from "../../../../types/Synergetic/iStudentReportAward";
import SynVStudentCoCurricularService from "../../../../services/Synergetic/Student/SynVStudentCoCurricularService";
import iStudentReportCoCurricular from "../../../../types/Synergetic/iStudentReportCoCurricular";
import CoCurricularByTypeChartWithTable from "./components/CoCurricularByTypeChartWithTable";
import LeadershipAndAwardByTypChartWithTable from "./components/LeadershipAndAwardByTypChartWithTable";

const blue = "#1E5693";
const orange = "#c13c01";
const Wrapper = styled.div`
  //font-family: "Segoe UI", wf_segoe-ui, helvetica, arial, sans-serif !important;
  .title-row {
    color: ${blue};
    font-weight: bold;
    font-size: 20px;
    padding: 1rem 0 0 0;
    
    &.orange {
      background-color: ${orange};
      color: white;
      padding: 0.8rem 0.6rem;
      font-weight: normal;
      font-size: 22px;
    }

    &.blue {
      background-color: ${blue};
      color: white;
      padding: 0.8rem 0.6rem;
      font-weight: normal;
      font-size: 22px;
    }
  }

  .sum-div {
    text-align: center;
    border: 1px ${blue} solid;
    width: 50%;

    .title {
      background-color: ${blue};
      color: white;
      font-size: 19px;
      padding: 3px 0px;
    }

    .content {
      padding: 0.4rem 0px;
      font-size: 43px;
      color: rgba(102, 102, 102);
    }

    &.reverse {
      .title {
        background-color: white;
        color: ${blue};
        font-weight: bold;
      }

      .content {
        padding: 1.1rem 0px 2.5rem 0px;
        background: ${blue} url("data:image/png;base64,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") center center no-repeat;
        color: rgb(2 53, 108);
        background-size: 80% 80%;
      }
    }

    &.orange {
      border-color: ${orange};

      .title {
        background-color: ${orange};
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
};
const StudentParticipationPanel = ({ student }: iStudentParticipationPanel) => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [selectedFileSemesters, setSelectedFileSemesters] = useState<
    ISynFileSemester[]
  >(
    currentUser?.SynCurrentFileSemester
      ? [currentUser?.SynCurrentFileSemester]
      : []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [absences, setAbsences] = useState<iSynVAbsence[]>([]);
  const [houseScores, setHouseScores] = useState<iHouseAwardScore[]>([]);
  const [awards, setAwards] = useState<iStudentReportAward[]>([]);
  const [coCurricular, setCoCurricular] = useState<
    iStudentReportCoCurricular[]
  >([]);

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
                  selectedFileSemester.EndDate
                ]
              }
            };
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
                  selectedFileSemester.EndDate
                ]
              }
            };
          })
        }),
        include: "event,eventType"
      }),

      SynVStudentAwardService.getAll({
        where: JSON.stringify({
          ID: student.StudentID,
          [OP_OR]: selectedFileSemesters.map(selectedFileSemester => {
            return {
              FileYear: selectedFileSemester.FileYear,
              FileSemester: selectedFileSemester.FileSemester
            };
          })
        })
      }),

      SynVStudentCoCurricularService.getAll({
        where: JSON.stringify({
          ID: student.StudentID,
          [OP_OR]: selectedFileSemesters.map(selectedFileSemester => {
            return {
              FileYear: selectedFileSemester.FileYear,
              FileSemester: selectedFileSemester.FileSemester
            };
          })
        })
      })
    ])
      .then(resp => {
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

  const getSumDiv = (
    title: string,
    content: string | number,
    className?: string,
    contentBg?: any
  ) => {
    return (
      <div className={`sum-div ${className || ""}`}>
        <div className={"title"}>{title}</div>
        <div className={"content"}>
          {content}
          {contentBg}
        </div>
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
        <Col md={3}>
          <SectionDiv className={"sm-top"}>
            <h6 className={"title-row"}>
              Co-Curricular, Leadership and Awards
            </h6>
            <FlexContainer
              className={
                "withGap lg-gap justify-content-between align-items-stretch"
              }
            >
              {getSumDiv("Col-Curricular", coCurricular.length, "orange")}
              {getSumDiv("Leadership & Awards", awards.length)}
            </FlexContainer>
          </SectionDiv>

          <SectionDiv className={"sm-top"}>
            <h6 className={"title-row"}>
              House points since <i>last award</i>{" "}
              {student.StudentHouseDescription}
            </h6>
            <FlexContainer
              className={
                "withGap lg-gap justify-content-between align-items-stretch"
              }
            >
              {getSumDiv(
                "Achievements",
                houseScores.filter(
                  score =>
                    `${score?.eventType?.name || ""}`.trim() ===
                    HOUSE_AWARD_EVENT_TYPE_ACHIEVEMENTS
                ).length,
                "reverse"
              )}
              {getSumDiv(
                "Services",
                houseScores.filter(
                  score =>
                    `${score?.eventType?.name || ""}`.trim() ===
                    HOUSE_AWARD_EVENT_TYPE_SERVICES
                ).length,
                "reverse"
              )}
            </FlexContainer>
          </SectionDiv>

          <SectionDiv className={"sm-top"}>
            <h6 className={"title-row"}>Late Arrivals and Absences</h6>
            <FlexContainer
              className={
                "withGap lg-gap justify-content-between align-items-stretch"
              }
            >
              {getSumDiv(
                "Late Arrivals",
                absences.filter(absence => absence.LateArrivalFlag === true)
                  .length,
                "red"
              )}
              {getSumDiv(
                "Early Departures",
                absences.filter(
                  absence => `${absence.EarlyDepartureTime || ""}`.trim() === ""
                ).length,
                "red"
              )}
            </FlexContainer>
          </SectionDiv>

          <SectionDiv className={"sm-top"}>
            <FlexContainer
              className={
                "withGap lg-gap justify-content-between align-items-stretch"
              }
            >
              <WellBeingGraphNurseVisitsPanel
                student={student}
                className={"nurse-visits"}
                fileSemesters={selectedFileSemesters}
              />
              {getSumDiv(
                "All Day Absence",
                absences.filter(
                  absence => absence.AbsencePeriod === ABSENCE_PERIOD_ALL_DAY
                ).length,
                "red"
              )}
            </FlexContainer>
          </SectionDiv>
        </Col>
        <Col md={5}>
          <SectionDiv className={"sm-top"}>
            <h6 className={"title-row orange"}>Co-Curricular Involvement</h6>
            <CoCurricularByTypeChartWithTable
              student={student}
              coCurriculars={coCurricular}
            />
          </SectionDiv>
        </Col>
        <Col md={4}>
          <SectionDiv className={"sm-top"}>
            <h6 className={"title-row blue"}>Leadership and Awards</h6>
            <LeadershipAndAwardByTypChartWithTable
              student={student}
              awards={awards}
            />
          </SectionDiv>
        </Col>
      </Row>
    </Wrapper>
  );
};

export default StudentParticipationPanel;
