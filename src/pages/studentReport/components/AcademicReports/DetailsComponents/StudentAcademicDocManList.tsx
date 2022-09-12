import iVStudent from '../../../../../types/Synergetic/iVStudent';
import iStudentReportYear from '../../../../../types/Synergetic/iStudentReportYear';
import {useEffect, useState} from 'react';
import iSynVDocument, {openDocument} from '../../../../../types/Synergetic/iSynVDocument';
import SynFileSemesterService from '../../../../../services/Synergetic/SynFileSemesterService';
import SynVDocumentService from '../../../../../services/Synergetic/SynVDocumentService';
import {Spinner} from 'react-bootstrap';
import styled from 'styled-components';

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
        const documents = await SynVDocumentService.getVDocuments({
          where: JSON.stringify({
            ID: student.StudentID,
            ClassificationCode: ['REPORT']
          }),
          perPage: '1000',
        });
        if (isCanceled ) return;
        setDocumentList(documents.data
          .filter((doc) => {
            if (`${studentReportYear.ReleaseToAllDate || ''}`.trim() === '') {
              return `${doc.SourceDate}` >= fileSemester.StartDate;
            }
            return `${doc.SourceDate}` >= fileSemester.StartDate && `${doc.SourceDate}` <= `${studentReportYear.ReleaseToAllDate || ''}`
          })
        );
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
