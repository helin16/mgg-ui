import React from 'react';
import SearchBox from './components/SearchBox';

const StudentReport = () => {
  return (
    <div className={'student-report-wrapper'}>
      <h1>Student Report</h1>
      <p>Welcome to the student academic report viewer. Type the homeroom or name of the student you want to locate below.</p>
      <SearchBox />
    </div>
  )
};

export default StudentReport;
