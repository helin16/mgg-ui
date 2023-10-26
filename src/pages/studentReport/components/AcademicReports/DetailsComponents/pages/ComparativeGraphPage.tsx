import { Col, Row, Spinner } from "react-bootstrap";
import { StudentAcademicReportDetailsProps } from "../../StudentAcademicReportDetails";
import React, { useEffect, useState } from "react";
import PanelTitle from "../../../../../../components/PanelTitle";
import SectionDiv from "../../../../../../components/common/SectionDiv";
import iStudentReportResult from "../../../../../../types/Synergetic/iStudentReportResult";
import styled from "styled-components";
import StudentStatusBadge from "../../StudentStatusBadge";
import { FlexContainer } from "../../../../../../styles";
import { ResultTableWrapper } from "../sections/GraphTable";
import ComparativeBarGraph from "../../../../../../components/support/ComparativeBarGraph";
import { OP_NOT } from "../../../../../../helper/ServiceHelper";
import StudentReportService from "../../../../../../services/Synergetic/Student/StudentReportService";
import Toaster from '../../../../../../services/Toaster';

const Wrapper = styled.div`
  .result-row {
    align-items: center;
    padding: 0px 1rem;
    &:hover {
      background-color: #eeeeee;
    }
  }
`;

type iResultMap = { [key: string]: iStudentReportResult[] };
const ComparativeGraphPage = ({
  student,
  studentReportYear,
  studentReportResult
}: StudentAcademicReportDetailsProps & {
  studentReportResult: iStudentReportResult | null;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStudentResultMap, setCurrentStudentResultMap] = useState<iResultMap>({});

  useEffect(() => {
    let isCancelled = false;

    const getData = async () => {
      const excludingLearningAreaCodes = `${studentReportYear.ComparativeExcludeCode ||
      ""}`
        .trim()
        .split(",")
        .map(code => `${code}`.trim())
        .filter(code => code !== "");
      const currentStudentsResults = await StudentReportService.getStudentReportResults({
        where: JSON.stringify({
          StudentID: student.StudentID,
          FileYear: studentReportYear.FileYear,
          FileSemester: studentReportYear.FileSemester,
          AssessableFlag: true,
          ActiveFlag: true,
          AssessAreaNumericFlag: true,
          AssessAreaHeading: ['OVERALL MARK'],
          ...(excludingLearningAreaCodes.length <= 0
            ? {}
            : {
              ClassLearningAreaCode: { [OP_NOT]: excludingLearningAreaCodes }
            })
        }),
        perPage: 999999,
        sort: 'ClassLearningAreaDescription:ASC',
      });
      const currentMap = (currentStudentsResults.data || []).reduce((map: iResultMap, result) => {
        return {
          ...map,
          [result.ClassCode]: [...(result.ClassCode in map ? map[result.ClassCode] : []), result],
        }
      }, {});

      setCurrentStudentResultMap(currentMap);
    }

    setIsLoading(true);
    getData().then(resp => {
      if (isCancelled === true) {
        return;
      }
    }).catch(err => {
      if (isCancelled === true) {
        return;
      }
      Toaster.showApiError(err);
    }).finally(() => {
      if (isCancelled === true) {
        return;
      }
      setIsLoading(false);
    });
    return () => {
      isCancelled = true;
    };
  }, [student, studentReportYear]);

  const getResultRow = (classCode: string, results: iStudentReportResult[]) => {
    if (results.length <= 0) {
      return null;
    }

    return (
      <SectionDiv key={classCode}>
        <ResultTableWrapper className={'responsive'}>
          <div className={"result-row"}>
            <div>
              <b>{results[0].ClassDescription}</b>
              <div>
                The comparative result for this{" "}
                {results[0].ClassDescription}. Learning Area: {results[0].ClassLearningAreaDescription}
              </div>
            </div>
            <div className={"result-table"}>
              <ComparativeBarGraph results={results} studentReportYear={studentReportYear} />
            </div>
          </div>
        </ResultTableWrapper>
      </SectionDiv>
    );
  };

  if (studentReportResult === null) {
    return null;
  }

  const getContent = () => {
    if (isLoading === true) {
      return <Spinner animation={"border"} />;
    }

    return Object.keys(currentStudentResultMap).map(classCode => {
      return getResultRow(classCode, currentStudentResultMap[classCode]);
    });
  };

  return (
    <Wrapper className={"comparative-analysis-wrapper"}>
      <Row>
        <Col>
          <h4>Comparative Analysis</h4>
        </Col>
        <Col className={"text-right"}>
          <FlexContainer
            className={"withGap justify-content flex-end align-items center"}
          >
            <StudentStatusBadge student={student} />
            <h4>
              {student.StudentGiven1} {student.StudentSurname} (
              {student.StudentID})
            </h4>
          </FlexContainer>
        </Col>
      </Row>

      <div>
        <PanelTitle>Overview</PanelTitle>
        <p>
          The information provided on this page is designed to give you an
          understanding of your daughter's performance relative to her cohort in
          the key learning areas of English, Humanities, Languages, Mathematics,
          Science and The Arts. The tables below indicate the percentage of
          students in Year {studentReportResult.StudentYearLevelDescription} who
          were awarded the various levels on our five point scale for overall
          progress in relation to standards.
        </p>
      </div>

      <SectionDiv>
        <PanelTitle>How To Use This Information</PanelTitle>
        <p>
          Your daughter's overall achievement in relation to standards in a
          subject is reported on her individual subject report. The information
          below provides the percentage distribution of the overall ratings for
          all students in all subjects comprising each key learning area. By
          comparing your daughter's overall achievement in a subject with the
          percentage distribution in that subject, you will be able to make a
          judgement about her progress in relation to her cohort in that subject
          area.
        </p>
      </SectionDiv>

      <SectionDiv>{getContent()}</SectionDiv>
    </Wrapper>
  );
};

export default ComparativeGraphPage;
