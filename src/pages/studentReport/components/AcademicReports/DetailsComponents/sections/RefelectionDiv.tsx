import iStudentReportResult from '../../../../../../types/Synergetic/iStudentReportResult';
import SectionDiv from './SectionDiv';
import {useEffect, useState} from 'react';

const ReflectionDiv = ({results, title = 'Reflection'}: {results: iStudentReportResult[]; title?: string}) => {
  const [resultList, setResultList] = useState<iStudentReportResult[]>([]);

console.log(results);
  useEffect(() => {
    setResultList(
      results
        .filter(result => result.reflectionText !== null)
    );
  }, [results]);

  if (resultList.length <= 0) {
    return null;
  }

  return (
    <SectionDiv>
      <h3 className={'text-danger'}><i>{title}</i></h3>
      <p>{resultList[0].TopicComment}</p>
    </SectionDiv>
  )
};

export default ReflectionDiv;
