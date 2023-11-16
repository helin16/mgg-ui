import * as Icons from 'react-bootstrap-icons';
import iVStudent from '../../../../types/Synergetic/Student/iVStudent';
import iSynVStudentClass from '../../../../types/Synergetic/Student/iSynVStudentClass';
import {Button} from 'react-bootstrap';
import * as XLSX from 'sheetjs-style';
import moment from 'moment-timezone';

type iStudentListExportBtn = {
  className?: string;
  students: iVStudent[];
  studentClassCodeMap: { [key: number]: iSynVStudentClass[] };
}
const StudentListExportBtn  = ({className, students, studentClassCodeMap}: iStudentListExportBtn) => {

  const exportToExcel = () => {
    const data = students.map(student => {
      return {
        StudentID: student.StudentID,
        Surname: student.StudentSurname,
        Given1: student.StudentGiven1,
        DOB: moment(student.StudentBirthDate).format('DD/MM/YYYY'),
        Form: student.StudentForm,
        YearLevel: student.StudentYearLevel,
        HouseCode: student.StudentHouse,
        House: student.StudentHouseDescription,
        Email: student.StudentOccupEmail,
        ClassCodes: (student.StudentID in studentClassCodeMap) ? studentClassCodeMap[student.StudentID]
          .map(studentClass => studentClass.ClassCode)
          .join('|') : '',
      }
    });
    const ws = XLSX.utils.json_to_sheet(data);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${moment().format('DD-MMM-YYYY_HH_mm_ss')}`);
    XLSX.writeFile(wb, `My_students_${moment().format('YYYY_MM_DD_HH_mm_ss')}.xlsx`);
  }

  if (students.length <= 0) {
    return null;
  }
  return (
    <Button variant={'primary'} className={className} size={'sm'} onClick={() => exportToExcel()}>
      <Icons.FileEarmarkExcel /> Export
    </Button>
  )
}

export default StudentListExportBtn;
