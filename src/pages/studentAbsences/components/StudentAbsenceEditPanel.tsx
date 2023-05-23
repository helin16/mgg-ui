import {useEffect, useState} from 'react';
import {
  iRecordType, iRecordTypeMap,
  iStudentAbsence, STUDENT_ABSENCE_REASON_CODE_OTHER,
} from '../../../types/StudentAbsence/iStudentAbsence';
import styled from 'styled-components';
import {Alert, Button, Col, FormControl, Row, Spinner} from 'react-bootstrap';
import StudentAbsenceService from '../../../services/StudentAbsences/StudentAbsenceService';
import iVStudent from '../../../types/Synergetic/iVStudent';
import {FlexContainer} from '../../../styles';
import FormLabel from '../../../components/form/FormLabel';
import DateTimePicker from '../../../components/common/DateTimePicker';
import SynLuAbsenceReasonSelector from '../../../components/student/SynLuAbsenceReasonSelector';
import LoadingBtn from '../../../components/common/LoadingBtn';
import * as Icons from 'react-bootstrap-icons';
import Toaster, {TOAST_TYPE_SUCCESS} from '../../../services/Toaster';
import moment from 'moment-timezone';
import FormErrorDisplay from '../../../components/form/FormErrorDisplay';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/makeReduxStore';
import {SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR} from '../../../types/Synergetic/iSchoolManagementTeam';
import {MGGS_MODULE_ID_STUDENT_ABSENCES} from '../../../types/modules/iModuleUser';
import AuthService from '../../../services/AuthService';
import SchoolManagementTeamService from '../../../services/Synergetic/SchoolManagementTeamService';
import SectionDiv from '../../studentReport/components/AcademicReports/DetailsComponents/sections/SectionDiv';
import ModuleAccessWrapper from '../../../components/module/ModuleAccessWrapper';

type iStudentAbsenceEditPanel = {
  recordType: iRecordType;
  studentAbsenceRecord?: iStudentAbsence
  onSaved?: (newRecord: iStudentAbsence) => void;
  onIsSubmitting?: (isSubmitting: boolean) => void;
  onCancel?: (isSubmitting: boolean) => void;
  isSaving?: boolean;
  isExpectedEvent?: boolean;
  student?: iVStudent;
}

const Wrapper = styled.div``;
const StudentAbsenceEditPanel = ({studentAbsenceRecord, recordType, student, onSaved, onIsSubmitting, onCancel, isExpectedEvent = false, isSaving = false}: iStudentAbsenceEditPanel) => {
  const [isSubmitting, setIsSubmitting] = useState(isSaving);
  const [record, setRecord] = useState<iStudentAbsence | undefined>(studentAbsenceRecord);
  const [hasNote, setHasNote] = useState<boolean>(studentAbsenceRecord?.hasNote || false);
  const [eventDate, setEventDate] = useState(studentAbsenceRecord?.EventDate || moment().toISOString());
  const [absenceReasonCode, setAbsenceReasonCode] = useState(studentAbsenceRecord?.AbsenceCode || null);
  const [comments, setComments] = useState(studentAbsenceRecord?.Comments || '');
  const [canEdit, setCanEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMap, setErrorMap] = useState<{[key: string]: any}>({});
  const [vStudent, setVStudent] = useState<iVStudent | null>(null);
  const {user} = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (record?.Student) {
      setVStudent(record?.Student);
    } else if (student) {
      setVStudent(student)
    } else {
      setVStudent(null)
    }
  }, [record, student]);


  useEffect(() => {
    let isCanceled = false;
    setIsLoading(true);
    Promise.all([
      AuthService.canAccessModule(MGGS_MODULE_ID_STUDENT_ABSENCES),
      SchoolManagementTeamService.getSchoolManagementTeams({
        where: JSON.stringify({
          SSTStaffID: user?.synergyId || '',
          SchoolRoleCode: SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR,
          FileYear: user?.SynCurrentFileSemester?.FileYear || moment().year(),
          FileSemester: user?.SynCurrentFileSemester?.FileSemester || moment().year(),
          YearLevelCode: vStudent?.StudentYearLevel,
        })
      })
    ])
      .then(resp => {
        if (isCanceled) return;
        // @ts-ignore
        const canAccessRoles = Object.keys(resp[0]).filter((roleId: number) => resp[0][roleId].canAccess === true).reduce((map, roleId) => {
          return {
            ...map,
            // @ts-ignore
            [roleId]: resp[0][roleId],
          }
        }, {});
        if (`${record?.syncd_AbsenceEventSeq || ''}`.trim() !== '') {
          setCanEdit(false);
        } else {
          setCanEdit(Object.keys(canAccessRoles).length > 0 || resp[1].length > 0);
        }
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
  }, [user, vStudent?.StudentYearLevel]);


  const preCheck = (): boolean => {
    const errors: {[key: string]: any} = {};

    const eventDateStr = `${eventDate || ''}`.trim();
    if (eventDateStr === '') {
      errors.eventDate = 'Event Date is required.';
    }

    const reasonCode = `${absenceReasonCode || ''}`.trim();
    if (reasonCode === '') {
      errors.absenceReasonCode = 'Reason is required.';
    }

    const commentsStr = `${comments || ''}`.trim();
    if (reasonCode === STUDENT_ABSENCE_REASON_CODE_OTHER && commentsStr === '') {
      errors.comments = 'Comments is required.';
    }

    setErrorMap(errors);
    return Object.keys(errors).length === 0;
  }

  const submit = () => {
    if (preCheck() !== true) {
      return ;
    }
    const data = {
      type: recordType,
      StudentID: vStudent?.StudentID,
      AbsenceCode: absenceReasonCode,
      hasNote,
      EventDate: moment(eventDate).toISOString(),
      Comments: comments,
      ...(`${record?.id || ''}`.trim() === '' ? {isExpectedEvent} : {}),
    };
    if(onIsSubmitting) {
      onIsSubmitting(true);
    } else {
      setIsSubmitting(true);
    }
    const fnc = `${record?.id || ''}`.trim() === '' ? StudentAbsenceService.create(data) : StudentAbsenceService.update(record?.id || '', data)
    fnc.then((resp) => {
      Toaster.showToast(`${StudentAbsenceService.getAbsenceTypeName(recordType)} for ${vStudent?.StudentNameInternal} saved successfully.`, TOAST_TYPE_SUCCESS);
      if (onSaved) {
        onSaved(resp);
      }
    }).catch(err => {
      Toaster.showApiError(err);
    }).finally(() => {
      if(onIsSubmitting) {
        onIsSubmitting(false);
      } else {
        setIsSubmitting(false);
      }
    })
  }

  const approve = () => {
    if(onIsSubmitting) {
      onIsSubmitting(true);
    } else {
      setIsSubmitting(true);
    }
    StudentAbsenceService.update(record?.id || '', {
      type: recordType,
      approved_at: moment().toISOString(),
      approved_by_id: user?.synergyId,
    }).then((resp) => {
      Toaster.showToast(`${StudentAbsenceService.getAbsenceTypeName(recordType)} for ${vStudent?.StudentNameInternal} approved successfully.`, TOAST_TYPE_SUCCESS);
      setRecord(resp);
      if (onSaved) {
        onSaved(resp);
      }
    }).catch(err => {
      Toaster.showApiError(err);
    }).finally(() => {
      if(onIsSubmitting) {
        onIsSubmitting(false);
      } else {
        setIsSubmitting(false);
      }
    })
  }


  const getAccessNotice = () => {
    if (`${record?.syncd_AbsenceEventSeq || ''}`.trim() !== '') {
      return <Alert variant={'success'}>
        <b>Record Sync'd with Synergetic</b>
        <div>
          This record has been sync'd to Synergetic.
          <b>By:</b> {record?.SyncdBy?.Given1} {record?.SyncdBy?.Surname}
          <b>@:</b> {moment(record?.syncd_at).format('lll')}
        </div>
      </Alert>
    }
    if (canEdit !== true) {
      return <Alert variant={'warning'}>
        <b>Access Denied</b>
        <div>You don't have access to this student</div>
      </Alert>
    }
    return null;
  }


  const getApprovedInfoPanel = () => {
    if (`${record?.approved_at || ''}`.trim() === '')  {
      return null;
    }

    return (
      <SectionDiv className={'text-center'}>
        <h5>Record Approved</h5>
        <div><b>By:</b>{record?.ApprovedBy?.Given1} {record?.ApprovedBy?.Surname}</div>
        <div><b>@</b>{moment(record?.approved_at).format('lll')}</div>
      </SectionDiv>
    )
  }

  if (isLoading) {
    return <Spinner animation={'border'} />
  }

  return (
    <Wrapper>
      <Row>
        <Col className={'text-center'} md={3}>
          {vStudent ? <img src={vStudent.profileUrl}/> : null}
        </Col>
        <Col md={9}>
          {getAccessNotice()}
          <Row className={'space bottom-lg'}>
            <Col md={4}>
              <b>Absence Type:</b> {StudentAbsenceService.getAbsenceTypeName(recordType)}
            </Col>
            <Col md={4}>
              <b>Student Name:</b> {vStudent?.StudentNameInternal} [{vStudent?.StudentID}]
            </Col>
            <Col md={4}>
              <b>Form:</b> {vStudent?.StudentForm}
            </Col>
          </Row>
          <Row className={'space bottom-lg'}>
            <Col xs={12}>
              <FlexContainer className={'cursor-pointer withGap'} onClick={() => canEdit && setHasNote(!hasNote)}>
                <b>Notification Received:</b>{' '}
                <input
                  disabled={canEdit !== true}
                  type={'checkbox'}
                  checked={hasNote === true}
                  onChange={(event) => setHasNote(event.target.checked)}
                />
              </FlexContainer>
            </Col>
          </Row>
          <Row className={'space bottom-lg'}>
            <Col xs={12}>
              <FormLabel label={'Date'} isRequired/>
              <DateTimePicker
                isDisabled={canEdit !== true}
                className={`form-control`}
                value={eventDate}
                onChange={(selected) => {
                  if(typeof selected === 'object') {
                    setEventDate(selected.toISOString())
                  }
                }}
              />
              <FormErrorDisplay errorsMap={errorMap} fieldName={'eventDate'} />
            </Col>
          </Row>
          <Row className={'space bottom-lg'}>
            <Col xs={12}>
              <FormLabel label={'Reason'} isRequired/>
              <SynLuAbsenceReasonSelector
                isDisabled={canEdit !== true}
                allowClear
                addOtherRegardless
                absenceTypeCodes={recordType in iRecordTypeMap ? [iRecordTypeMap[recordType]] : []}
                values={absenceReasonCode ? [absenceReasonCode] : undefined}
                onSelect={(options) => {
                  // @ts-ignore
                  setAbsenceReasonCode(options?.value || null)
                }}
              />
              <FormErrorDisplay errorsMap={errorMap} fieldName={'absenceReasonCode'} />
            </Col>
          </Row>
          <Row className={'space bottom-lg'}>
            <Col xs={12}>
              <FormLabel label={'Comments'} isRequired={absenceReasonCode === STUDENT_ABSENCE_REASON_CODE_OTHER}/>
              <FormControl
                value={comments}
                disabled={canEdit !== true}
                onChange={(event) => setComments(event.target.value)}
              />
              <FormErrorDisplay errorsMap={errorMap} fieldName={'comments'} />
            </Col>
          </Row>
          {getApprovedInfoPanel()}
          <FlexContainer className={'justify-content-between'}>
            <div>
              {canEdit === true && `${record?.approved_at || ''}`.trim() === '' ? (
                <Row>
                  <Col>
                    <LoadingBtn variant={'success'} isLoading={isSubmitting === true} onClick={() => approve()}>
                      Approve
                    </LoadingBtn>
                  </Col>
                </Row>
              ) : null}
            </div>
            <div>
              <Button
                variant={'link'}
                onClick={() => onCancel && onCancel(false)}
              >
                Cancel
              </Button>
              {canEdit === true ? (
                <LoadingBtn variant={'primary'} isLoading={isSubmitting === true} onClick={() => submit()}>
                  <Icons.Send />{' '}
                  {`${record?.id || ''}`.trim() === '' ? 'Create' : 'Update'}
                </LoadingBtn>
              ) : null}
            </div>
          </FlexContainer>
        </Col>
      </Row>
    </Wrapper>
  )
}

export default StudentAbsenceEditPanel;
