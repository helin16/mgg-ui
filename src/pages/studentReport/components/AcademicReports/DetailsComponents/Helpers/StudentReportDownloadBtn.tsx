import * as Icon from 'react-bootstrap-icons';
import LoadingBtn from '../../../../../../components/common/LoadingBtn';
import iVStudent from '../../../../../../types/Synergetic/iVStudent';
import iStudentReportYear from '../../../../../../types/Synergetic/iStudentReportYear';
import {useState} from 'react';
import StudentReportService from '../../../../../../services/Synergetic/StudentReportService';

type iStudentReportDownloadBtn = {
  student: iVStudent,
  studentReportYear: iStudentReportYear,
}
const StudentReportDownloadBtn = ({student, studentReportYear}: iStudentReportDownloadBtn) => {
  const [isLoading, setIsLoading] = useState(false);

  const downloadReport = () => {
    setIsLoading(true);
    StudentReportService.getStudentReportDownloadPDF(student.StudentID, studentReportYear.ID)
      .then(res => {
        window.location.href = res.downloadUrl;
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  return (
    <LoadingBtn variant={'info'} isLoading={isLoading} onClick={() => downloadReport() }>
      <Icon.CloudArrowDown /> Download PDF Report
    </LoadingBtn>
  )
};

export default StudentReportDownloadBtn;
