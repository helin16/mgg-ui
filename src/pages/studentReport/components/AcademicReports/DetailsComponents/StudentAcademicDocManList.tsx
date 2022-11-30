import iVStudent from '../../../../../types/Synergetic/iVStudent';
import iStudentReportYear from '../../../../../types/Synergetic/iStudentReportYear';
import {useEffect, useState} from 'react';
import iSynVDocument from '../../../../../types/Synergetic/iSynVDocument';
import SynFileSemesterService from '../../../../../services/Synergetic/SynFileSemesterService';
import SynVDocumentService, {openDocument} from '../../../../../services/Synergetic/SynVDocumentService';
import {Spinner} from 'react-bootstrap';
import styled from 'styled-components';
import {OP_BETWEEN, OP_GTE} from '../../../../../helper/ServiceHelper';

type iStudentAcademicDocManList = {
  student: iVStudent,
  studentReportYear: iStudentReportYear,
}
const Wrapper = styled.div`
  .link {
    cursor: pointer;
    color: #0066b0;
    :hover {
      text-decoration: underline;
    }
  }
`;
const StudentAcademicDocManList = ({student, studentReportYear}: iStudentAcademicDocManList) => {

  const [isLoading, setIsLoading] = useState(false);
  const [documentList, setDocumentList] = useState<iSynVDocument[]>([]);

  useEffect(() => {
    let isCanceled = false;
    const getData = async () => {
      try {

        setIsLoading(true);
        const fileSemesters = await SynFileSemesterService.getFileSemesters({
          where: JSON.stringify({
            FileYear: studentReportYear.FileYear,
            FileSemester: studentReportYear.FileSemester,
          }),
        });
        if (!fileSemesters || fileSemesters.length <= 0) {
          return;
        }
        const fileSemester = fileSemesters[0];
        const extraWhere = (`${studentReportYear.ReleaseToAllDate || ''}`.trim() === '') ? {SourceDate: {[OP_GTE]: fileSemester.StartDate}} : {
          SourceDate: {[OP_BETWEEN]: [fileSemester.StartDate, `${studentReportYear.ReleaseToAllDate || ''}`]}
        }
        const documents = await SynVDocumentService.getVDocuments({
          where: JSON.stringify({
            ID: student.StudentID,
            ClassificationCode: ['REPORT', 'ARCHIVEDRPTS', 'ONLINESCHRPT'],
            ...extraWhere,
          }),
          perPage: '100',
        });
        if (isCanceled ) return;
        setDocumentList(documents.data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    }

    getData();
    return () => {
      isCanceled = true;
    }
  }, [student, studentReportYear]);

  const downloadFile = (document: iSynVDocument) => {
    openDocument(document);
  }

  if (isLoading) {
    return <Spinner animation={'border'} />
  }

  return (
    <Wrapper>
      <ul>
        {documentList.map(document => {
          return (
            <li key={document.tDocumentsSeq}>
              <div className={'link'} onClick={() => downloadFile(document)}>{document.Description}</div>
            </li>
          )
        })}
      </ul>
    </Wrapper>
  )
}

export default StudentAcademicDocManList;
