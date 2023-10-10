import { ResultTableWrapper } from "./GraphTable";
import ComparativeBarGraph from "../../../../../../components/support/ComparativeBarGraph";
import React from "react";
import SectionDiv from "../../../../../../components/common/SectionDiv";
import iStudentReportResult from "../../../../../../types/Synergetic/iStudentReportResult";
import iStudentReportYear from "../../../../../../types/Synergetic/iStudentReportYear";

type iComparativeSection = {
  results: iStudentReportResult[];
  studentReportYear: iStudentReportYear;
};
const ComparativeSection = ({
  results,
  studentReportYear,
}: iComparativeSection) => {

  const excludingLearningAreaCodes = `${studentReportYear.ComparativeExcludeCode ||
  ""}`
    .trim()
    .split(",")
    .map(code => `${code}`.trim())
    .filter(code => code !== "");
  const numberResults = results.filter((result) => result.AssessAreaNumericFlag === true && excludingLearningAreaCodes.indexOf(result.ClassLearningAreaCode) < 0);

  if (numberResults.length <= 0) {
    return null;
  }

  return (
    <SectionDiv>
      <ResultTableWrapper>
        <div className={"result-row"}>
          <div>
            <b>Comparative</b>
            <div>The comparative result for this subject</div>
          </div>
          <div className={"result-table"}>
            <ComparativeBarGraph
              results={numberResults}
              studentReportYear={studentReportYear}
            />
          </div>
        </div>
      </ResultTableWrapper>
    </SectionDiv>
  );
};

export default ComparativeSection;
