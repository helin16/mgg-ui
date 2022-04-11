import React, {useEffect, useState} from 'react';
import SearchPage from './components/SearchPage';
import iVStudent from '../../types/student/iVStudent';
import StudentDetailsPage from './components/StudentDetailsPage';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/makeReduxStore';
import VStudentService from '../../services/Synergetic/VStudentService';
import {Spinner} from 'react-bootstrap';
import Page401 from '../../components/Page401';
import StudentGridForAParent from '../../components/student/StudentGridForAParent';

const StudentReport = () => {
  const {user} = useSelector((state: RootState) => state.auth);
  const [selectedStudent, setSelectedStudent] = useState<iVStudent | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    if (!user || user?.isStudent !== true) {
      return;
    }
    setIsLoading(true);
    VStudentService.getCurrentVStudent(user?.synergyId)
      .then(resp => {
        if (isCancelled) { return }
        setSelectedStudent(resp);
      })
      .finally(() => {
        setIsLoading(false);
      });
    return () => {
      isCancelled = true;
    }
  }, [user])

  if (!user) {
    return null;
  }

  if (isLoading === true) {
    return <Spinner animation={'border'} />;
  }

  const getMainPage = () => {
    if (selectedStudent) {
      return <StudentDetailsPage student={selectedStudent} onClearSelectedStudent={() => setSelectedStudent(null)}/>;
    }
    if (user?.isStaff === true) {
      return <SearchPage onSelect={(student) => setSelectedStudent(student)}/>;
    }
    if (user?.isParent === true) {
      return <StudentGridForAParent parentSynId={user?.synergyId} onSelect={(student) => setSelectedStudent(student)}/>;
    }
    return <Page401 />;
  }

  return (
    <div className={'student-report-wrapper'}>
      {getMainPage()}
    </div>
  )
};

export default StudentReport;
