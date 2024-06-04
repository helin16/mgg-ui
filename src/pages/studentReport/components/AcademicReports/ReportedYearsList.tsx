import iVStudent from '../../../../types/Synergetic/Student/iVStudent';
import {Image, Spinner} from 'react-bootstrap';
import React, {useEffect, useState} from 'react';
import StudentReportService from '../../../../services/Synergetic/Student/StudentReportService';
import iStudentReportYear from '../../../../types/Synergetic/Student/iStudentReportYear';
import LinkBtn from '../../../../components/common/LinkBtn';
import SectionDiv from '../../../../components/common/SectionDiv';

const ReportedYearsList = ({student, onSelect}: {student: iVStudent, onSelect: (studentReportYear: iStudentReportYear) => void}) => {
  const [reportList, setReportList] = useState<{[key: number]: iStudentReportYear[]}>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    setReportList({});
    StudentReportService.getStudentReportYearsForAStudent(`${student.ID}`)
      .then(resp => {
        if (isCancelled === true) return;
        const listMap = resp
          .sort((reportYear1, reportYear2) => {
            return reportYear1.FileYear > reportYear2.FileYear && reportYear1.FileSemester > reportYear2.FileSemester ? 1 : -1
          })
          .reduce((map, reportYear) => {
            return {
              ...map,
              // @ts-ignore
              [reportYear.FileYear]: [...(reportYear.FileYear in map ? map[reportYear.FileYear] : []), reportYear],
            }
          }, {});
        setReportList(listMap);
        setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    }
  }, [student]);

  const getStaffOnlyFlag = (studentReportYear: iStudentReportYear) => {
    if (studentReportYear.isReleasedToAll === true) {
      return null;
    }

    if (studentReportYear.isReleasedToStaff === true) {
      return <span>(staff only)</span>;
    }

    return null;
  }

  const getYearList = () => {
    if (isLoading === true) {
      return <Spinner animation={'border'} />;
    }

    if (Object.keys(reportList).length <= 0) {
      return null;
    }
    return Object.keys(reportList).reverse().map(fileYear => {
      return (
        <SectionDiv key={fileYear}>
          <h6>{fileYear}</h6>
          {/*// @ts-ignore*/}
          {reportList[fileYear].map((studentReport: iStudentReportYear) => {
            return (
              <div key={studentReport.ID}>
                <LinkBtn onClick={() => onSelect(studentReport)}>
                  {studentReport.FileYear} Semester {studentReport.FileSemester / 2} Academic Report {getStaffOnlyFlag(studentReport)}
                </LinkBtn>
              </div>
            );
          })}
        </SectionDiv>
      )
    })
  }

  return (
    <div>
      <Image
        src={student.profileUrl}
        rounded
        className={'pull-right'}
        style={{padding: '1.3rem', width: '18rem'}}
      />
      <div>
        <p>Select the academic report you want to view from the list below.</p>
        <div className={'reported-years-list'}>
          {getYearList()}
        </div>
      </div>
    </div>
  )
};

export default ReportedYearsList;
