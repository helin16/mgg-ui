import styled from 'styled-components';
import {Button, Col, Dropdown, Row, DropdownButton} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import SynStudentSearchPanel from '../../components/student/SynStudentSearchPanel';
import iVStudent from '../../types/Synergetic/iVStudent';
import {FlexContainer} from '../../styles';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import StudentAbsenceService from '../../services/StudentAbsences/StudentAbsenceService';
import {
  iRecordType,
  STUDENT_ABSENCE_RECORD_TYPE_EARLY_SIGN_OUT,
  STUDENT_ABSENCE_RECORD_TYPE_LATE_SIGN_IN
} from '../../types/StudentAbsence/iStudentAbsence';
import {MGGS_MODULE_ID_STUDENT_ABSENCES} from '../../types/modules/iModuleUser';
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/makeReduxStore';
import AuthService from '../../services/AuthService';
import Toaster from '../../services/Toaster';
import PageLoadingSpinner from '../../components/common/PageLoadingSpinner';
import StudentAbsenceEditPopupBtn from './components/StudentAbsenceEditPopupBtn';
import StudentScheduledAbsenceEditPopupBtn from './components/StudentScheduledAbsenceEditPopupBtn';

type iStudentAbsenceCreatePage = {
  onNavBack: () => void;
}

const Wrapper = styled.div`
  .search-result-item {
    .student-info {
      height: 100%;
    }
  }
`;
const StudentAbsenceCreatePage = ({onNavBack}: iStudentAbsenceCreatePage) => {
  const [canAccess, setCanAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {user} = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    let isCanceled = false;
    setIsLoading(true);
    AuthService.canAccessModule(MGGS_MODULE_ID_STUDENT_ABSENCES)
      .then(resp => {
        if (isCanceled) return;
        // @ts-ignore
        const canAccessRoles = Object.keys(resp).filter((roleId: number) => resp[roleId].canAccess === true).reduce((map, roleId) => {
          return {
            ...map,
            // @ts-ignore
            [roleId]: resp[roleId],
          }
        }, {});
        setCanAccess(Object.keys(canAccessRoles).length > 0);
      })
      .catch(err => {
        if (isCanceled) return;
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) return;
        setIsLoading(false);
      })

    return () => {
      isCanceled = true;
    }
  }, [user]);

  const getDropDown = (title: string, variant: string, student: iVStudent, isExpectedEvent = false) => {
    return (
      <DropdownButton
        as={ButtonGroup}
        size={'sm'}
        variant={variant}
        title={title}
      >
        {[
          STUDENT_ABSENCE_RECORD_TYPE_EARLY_SIGN_OUT,
          STUDENT_ABSENCE_RECORD_TYPE_LATE_SIGN_IN,
        ].map((type: string) => {
          return (
            <Dropdown.Item key={type}>
              <StudentAbsenceEditPopupBtn
                recordType={type as iRecordType}
                variant={'link'}
                student={student}
                isExpectedEvent={isExpectedEvent}
                onSaved={() => onNavBack()}
              >
              {
                // @ts-ignore
                StudentAbsenceService.getAbsenceTypeName(type)
              }
              </StudentAbsenceEditPopupBtn>
            </Dropdown.Item>
          )
        })}
      </DropdownButton>
    )
  }

  const getScheduledDropDown = (title: string, variant: string, student: iVStudent) => {
    return (
      <DropdownButton
        as={ButtonGroup}
        size={'sm'}
        variant={variant}
        title={title}
      >
        {[
          STUDENT_ABSENCE_RECORD_TYPE_EARLY_SIGN_OUT,
          STUDENT_ABSENCE_RECORD_TYPE_LATE_SIGN_IN,
        ].map((type: string) => {
          return (
            <Dropdown.Item key={type}>
              <StudentScheduledAbsenceEditPopupBtn
                recordType={type as iRecordType}
                variant={'link'}
                student={student}
                onSaved={() => onNavBack()}
              >
                {
                  // @ts-ignore
                  StudentAbsenceService.getAbsenceTypeName(type)
                }
              </StudentScheduledAbsenceEditPopupBtn>
            </Dropdown.Item>
          )
        })}
      </DropdownButton>
    )
  }

  if (isLoading) {
    return <PageLoadingSpinner />
  }

  return (
    <Wrapper>
      <h3>
        <Button variant={'link'} onClick={() => onNavBack()}>
          <Icons.ArrowLeft />
        </Button>
        {' '}
        Requesting a student absence for :
      </h3>
      <SynStudentSearchPanel
        onRowRender={(student: iVStudent) => {
          return (
            <Row className={'search-result-item padding-space bottom top hover stripe'}>
              <Col md={4}>
                <FlexContainer className={'student-info justify-content space-between align-items center'}>
                  <div>{student.StudentNameInternal}</div>
                  <div>{student.StudentForm}</div>
                </FlexContainer>
              </Col>
              <Col md={8}>
                <FlexContainer className={'btns justify-content flex-end with-gap lg-gap'}>
                  {canAccess ? getDropDown('Actual', 'danger', student) : null }
                  {canAccess ? getScheduledDropDown('Scheduled', 'success', student) : null }
                  {getDropDown('Expected', 'primary', student, true)}
                </FlexContainer>
              </Col>
            </Row>
          )
        }}
      />
    </Wrapper>
  );
}

export default StudentAbsenceCreatePage;
