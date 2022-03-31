import iStudentReportResult, {
  STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_KNOWLEDGE_AND_SKILLS
} from '../../../../../../types/student/iStudentReportResult';
import {useEffect, useState} from 'react';
import GraphTable from './GraphTable';

const resultTranslateMap = {
  '1': {name: 'Well Below', width: 8},
  '2': {name: 'Below', width: 29},
  '3': {name: 'At Standard', width: 50},
  '4': {name: 'Above', width: 72},
  '5': {name: 'Well Above', width: 100},
}

const KnowledgeAndSkillsDiv = ({results}: {results: iStudentReportResult[]}) => {
  const [resultList, setResultList] = useState<iStudentReportResult[]>([]);

  useEffect(() => {
    setResultList(
      results
        .filter(result => result.AssessAreaResultType === STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_KNOWLEDGE_AND_SKILLS)
    )
  }, [results]);

  return <GraphTable
    results={resultList}
    title={'Knowledge & Skills'}
    resultTranslateMap={resultTranslateMap}
  />;
};

export default KnowledgeAndSkillsDiv;
