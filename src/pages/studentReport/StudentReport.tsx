import React, {useState} from 'react';
import SearchPage from './components/SearchPage';
import iVStudent from '../../types/student/iVStudent';
import StudentDetailsPage from './components/StudentDetailsPage';

const StudentReport = () => {
  const [selectedStudent, setSelectedStudent] = useState<iVStudent | null>(null);


  return (
    <div className={'student-report-wrapper'}>
      {
        selectedStudent === null ?
          <SearchPage onSelect={(student) => setSelectedStudent(student)}/> :
          <StudentDetailsPage student={selectedStudent} onClearSelectedStudent={() => setSelectedStudent(null)}/>}
    </div>
  )
};

export default StudentReport;
