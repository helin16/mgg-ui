import React, {useState} from 'react';
import StudentListResultPanel from './components/StudentListResultPanel';
import ExplanationPanel from '../../../components/ExplanationPanel';
import StudentListSearchPanel, {iSearchCriteria} from './components/StudentListSearchPanel';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/makeReduxStore';
import SynVStudentClassService from '../../../services/Synergetic/Student/SynVStudentClassService';
import moment from 'moment-timezone';
import Toaster from '../../../services/Toaster';
import iVStudent from '../../../types/Synergetic/Student/iVStudent';
import SynVStudentService from '../../../services/Synergetic/Student/SynVStudentService';
import {HEADER_NAME_SELECTING_FIELDS} from '../../../services/AppService';
import {OP_LIKE, OP_OR} from '../../../helper/ServiceHelper';
import {FlexContainer} from '../../../styles';
import iSynVStudentClass from '../../../types/Synergetic/Student/iSynVStudentClass';
import TimeTableImportPopupBtn from '../../../components/timeTable/TimeTableImportPopupBtn';
import styled from 'styled-components';
import UtilsService from '../../../services/UtilsService';

const Wrapper = styled.div`
  .float-right {
    float: right;
  }
`
const MyClassListPage = () => {
  const {user} = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<iVStudent[]>([]);
  const [studentIdClassCodeMap, setStudentIdClassCodeMap] = useState<{[key: string]: iSynVStudentClass[]}>({});

  const onSearch = (criteria: iSearchCriteria) => {
    setIsLoading(true);
    Promise.all([
      SynVStudentService.getCurrentVStudents({
        where: JSON.stringify({
          FileYear: (user?.SynCurrentFileSemester?.FileYear || moment().year()),
          FileSemester: (user?.SynCurrentFileSemester?.FileSemester || 1),
          ...(`${criteria.searchText || ''}`.trim() !== '' ? {
            [OP_OR]: [
              {StudentForm: {[OP_LIKE]: `%${`${criteria.searchText || ''}`.trim()}%`}},
              {StudentNameInternal: {[OP_LIKE]: `%${`${criteria.searchText || ''}`.trim()}%`}},
              {StudentNameExternal: {[OP_LIKE]: `%${`${criteria.searchText || ''}`.trim()}%`}},
              {StudentOccupEmail: {[OP_LIKE]: `%${`${criteria.searchText || ''}`.trim()}%`}},
              ...(UtilsService.isNumeric(criteria.searchText || '') === true ? [{StudentID: `${criteria.searchText || ''}`.trim()}] : []),
            ],
          } : {}),
        }),
        sort: 'StudentForm:ASC,StudentNameInternal:ASC',
        perPage: '9999',
      },),
      SynVStudentClassService.getAll({
        where: JSON.stringify({
          ...(criteria.classCodes.length > 0 ? {ClassCode: criteria.classCodes} : {}),
          FileYear: (user?.SynCurrentFileSemester?.FileYear || moment().year()),
          FileSemester: (user?.SynCurrentFileSemester?.FileSemester || 1),
        }),
        perPage: '9999'
      }, {
        headers: {[HEADER_NAME_SELECTING_FIELDS]: JSON.stringify(['StudentID', 'ClassCode'])}
      })
    ]).then(resp => {
      const studentIdsFromClassCodes = (resp[1].data || []).map(result => result.StudentID);
      setStudents((resp[0] || []).filter(student => studentIdsFromClassCodes.indexOf(student.StudentID) >= 0))
      setStudentIdClassCodeMap(((resp[1].data || [])).reduce((map, studentClass) => {
        const studentId = studentClass.StudentID;
        if (!(studentId in map)) {
          return {
            ...map,
            [studentId]: [studentClass],
          }
        }
        return {
          ...map,
          // @ts-ignore
          [studentId]: [...map[studentId], ...[studentClass]],
        }
      }, {}))
    }).catch((err: any) => {
      Toaster.showApiError(err);
    }).finally(() => {
      setIsLoading(false);
    })
  }

  return (
    <Wrapper>
      <h3>
        My Class List
        <TimeTableImportPopupBtn className={'float-right'} btnPros={{size: 'sm'}} />
      </h3>
      <ExplanationPanel text={'This page is designed for teachers export student list, in order to import them into external tools like: Education Perfect. Data is pulled from Synergetic directly.'} />
      <StudentListSearchPanel isLoading={isLoading} onSearch={onSearch} />
      <FlexContainer className={'space-below'} />
      <StudentListResultPanel isLoading={isLoading} students={students} studentClassCodeMap={studentIdClassCodeMap} />
    </Wrapper>
  )
}

export default MyClassListPage;
