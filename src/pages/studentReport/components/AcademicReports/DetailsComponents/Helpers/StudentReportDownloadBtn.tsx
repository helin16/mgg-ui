import * as Icon from 'react-bootstrap-icons';
import LoadingBtn from '../../../../../../components/common/LoadingBtn';
import iVStudent from '../../../../../../types/Synergetic/Student/iVStudent';
import iStudentReportYear from '../../../../../../types/Synergetic/Student/iStudentReportYear';
import {useState} from 'react';
import StudentReportService from '../../../../../../services/Synergetic/Student/StudentReportService';
import {Button} from 'react-bootstrap';
import PopupModal from '../../../../../../components/common/PopupModal';
import * as Icons from 'react-bootstrap-icons'

type iStudentReportDownloadBtn = {
  student: iVStudent,
  studentReportYear: iStudentReportYear,
}
const StudentReportDownloadBtn = ({student, studentReportYear}: iStudentReportDownloadBtn) => {
  const [isLoading, setIsLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  const downloadReport = () => {
    setIsLoading(true);
    StudentReportService.getStudentReportDownloadPDF(student.StudentID, studentReportYear.ID || '')
      .then(res => {
        setDownloadUrl(`${res.downloadUrl || ''}`);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  const getDownloadUrlPopup = () => {
    if(`${downloadUrl}`.trim() === '') {
      return null;
    }
    return (
      <PopupModal
        dialogClassName={'sm'}
        show={`${downloadUrl}`.trim() !== ''}
        handleClose={() => setDownloadUrl('')}
        title={`Report Generated:`}
      >
        <>
          <p>
            Requested report generated. Click the below button to download it.
          </p>
          <div>
            <Button variant={'primary'} onClick={() => {
              const url = `${downloadUrl}`.trim();
              setDownloadUrl('');
              window.location.href = url;
            }}>
              <Icons.Download /> Download
            </Button>
          </div>
        </>
      </PopupModal>
    )
  }

  return (
    <>
      <LoadingBtn variant={'info'} isLoading={isLoading} onClick={() => downloadReport() }>
        <Icon.CloudArrowDown /> Download PDF Report
      </LoadingBtn>
      {getDownloadUrlPopup()}
    </>
  )
};

export default StudentReportDownloadBtn;
