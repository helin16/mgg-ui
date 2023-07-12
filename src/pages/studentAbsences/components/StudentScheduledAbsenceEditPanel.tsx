import {useEffect, useState} from 'react';
import styled from 'styled-components';
import {Alert, Col, Form, FormControl, Row, Spinner} from 'react-bootstrap';
import iVStudent from '../../../types/Synergetic/iVStudent';
import {FlexContainer} from '../../../styles';
import FormLabel from '../../../components/form/FormLabel';
import DateTimePicker from '../../../components/common/DateTimePicker';
import SynLuAbsenceReasonSelector from '../../../components/student/SynLuAbsenceReasonSelector';
import LoadingBtn from '../../../components/common/LoadingBtn';
import * as Icons from 'react-bootstrap-icons';
import Toaster from '../../../services/Toaster';
import moment from 'moment-timezone';
import FormErrorDisplay from '../../../components/form/FormErrorDisplay';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/makeReduxStore';
import {SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR} from '../../../types/Synergetic/iSchoolManagementTeam';
import {MGGS_MODULE_ID_STUDENT_ABSENCES} from '../../../types/modules/iModuleUser';
import AuthService from '../../../services/AuthService';
import SchoolManagementTeamService from '../../../services/Synergetic/SchoolManagementTeamService';
import {
  iRecordType,
  iRecordTypeMap, iStudentAbsence,
  STUDENT_ABSENCE_REASON_CODE_OTHER
} from '../../../types/StudentAbsence/iStudentAbsence';
import iStudentAbsenceSchedule from '../../../types/StudentAbsence/iStudentAbsenceSchedule';
import StudentScheduledAbsenceService from '../../../services/StudentAbsences/StudentScheduledAbsenceService';
import StudentAbsenceService from '../../../services/StudentAbsences/StudentAbsenceService';
import TimePicker from '../../../components/common/TimePicker';

type iStudentScheduledAbsenceEditPanel = {
  recordType: iRecordType;
  scheduledAbsence?: iStudentAbsenceSchedule
  onSaved?: (newRecord: iStudentAbsenceSchedule) => void;
  onIsSubmitting?: (isSubmitting: boolean) => void;
  onCancel?: (isSubmitting: boolean) => void;
  isSaving?: boolean;
  student?: iVStudent;
}

const Wrapper = styled.div``;
const StudentScheduledAbsenceEditPanel = ({scheduledAbsence, recordType, student, onSaved, onIsSubmitting, onCancel, isSaving = false}: iStudentScheduledAbsenceEditPanel) => {
  const [isSubmitting, setIsSubmitting] = useState(isSaving);
  const [record, setRecord] = useState<iStudentAbsenceSchedule | undefined>(scheduledAbsence);
  const [recordEvent, setRecordEvent] = useState<iStudentAbsence | undefined>(undefined);
  const [canEdit, setCanEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMap, setErrorMap] = useState<{[key: string]: any}>({});
  const [vStudent, setVStudent] = useState<iVStudent | null>(null);
  const {user} = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setRecordEvent(record?.Event);
    if (record?.Event?.Student) {
      setVStudent(record?.Event?.Student);
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
        if (record?.active !== true) {
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
  }, [user, vStudent?.StudentYearLevel, record?.active]);


  const preCheck = (): boolean => {
    const errors: {[key: string]: any} = {};

    const reasonCode = `${recordEvent?.AbsenceCode || ''}`.trim();
    if (reasonCode === '') {
      errors.absenceReasonCode = 'Reason is required.';
    }

    const commentsStr = `${recordEvent?.Comments || ''}`.trim();
    if (reasonCode === STUDENT_ABSENCE_REASON_CODE_OTHER && commentsStr === '') {
      errors.comments = 'Comments is required.';
    }

    setErrorMap(errors);
    return Object.keys(errors).length === 0;
  }

  const doSubmission = async () => {
    console.log('recordEvent', recordEvent);
    console.log('record', record);
    const eventData = {
      ...(recordEvent || {}),
      type: recordType,
      StudentID: vStudent?.StudentID,
      hasNote: recordEvent?.hasNote || false,
      AbsenceCode: recordEvent?.AbsenceCode,
      EventDate: `${recordEvent?.EventDate || ''}`.trim() === '' ? moment().toISOString() : moment(`${recordEvent?.EventDate || ''}`.trim()).toISOString(),
      Comments: recordEvent?.Comments || '',
    };
    const event = await (`${record?.eventId || ''}`.trim() === '' ? StudentAbsenceService.create(eventData) : StudentAbsenceService.update(record?.eventId || '', eventData));
    console.log('event', event);

    const data = {
      ...(record || {}),
      eventType: recordType,
      eventId: event.id,
      time: record?.time || '',
      startDate: record?.startDate || '',
      endDate: record?.endDate || '',
      monday: record?.monday || false,
      tuesday: record?.tuesday || false,
      wednesday: record?.wednesday || false,
      thursday: record?.thursday || false,
      friday: record?.friday || false,
    }

    const savedRecord = await (`${record?.id || ''}`.trim() === '' ? StudentScheduledAbsenceService.create(data) : StudentScheduledAbsenceService.update(record?.id || '', data))
    onSaved && onSaved(savedRecord);
  }

  const submit = () => {
    if (preCheck() !== true) {
      return ;
    }

    if(onIsSubmitting) {
      onIsSubmitting(true);
    } else {
      setIsSubmitting(true);
    }
    doSubmission().catch(err => {
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
    if (canEdit !== true) {
      return <Alert variant={'warning'}>
        <b>Access Denied</b>
        <div>You don't have access to this student</div>
      </Alert>
    }
    return null;
  }


  const updateRecord = (fieldName: string, newValue: string | boolean) => {
    // @ts-ignore
    setRecord({
      ...(record || {}),
      [fieldName]: newValue,
    })
  }

  const updateRecordEvent = (fieldName: string, newValue: string | boolean) => {
    // @ts-ignore
    setRecordEvent({
      ...(recordEvent || {}),
      [fieldName]: newValue,
    })
  }


  if (isLoading) {
    return <Spinner animation={'border'} />
  }

  return (
    <Wrapper>
      <Row>
        <Col className={'text-center'} md={3}>
          {vStudent ? <img src={vStudent.profileUrl} alt={vStudent.StudentGiven1}/> : null}
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
              <FlexContainer className={'cursor-pointer withGap'} onClick={() => canEdit && updateRecordEvent('hasNote', (!recordEvent?.hasNote))}>
                <b>Notification Received:</b>{' '}
                <input
                  disabled={canEdit !== true}
                  type={'checkbox'}
                  checked={recordEvent?.hasNote === true}
                  onChange={(event) => updateRecordEvent('hasNote', event.target.checked)}
                />
              </FlexContainer>
            </Col>
          </Row>
          <Row className={'space bottom-lg'}>
            <Col xs={12}>
              <FormLabel label={'Scheduler'} isRequired/>
              <Row>
                <Col md={6}>
                  <FormLabel label={'Start'} isRequired/>
                  <DateTimePicker
                    isDisabled={canEdit !== true}
                    dateFormat={'DD MMM YYYY'}
                    timeFormat={false}
                    className={`form-control`}
                    value={record?.startDate}
                    onChange={(selected) => {
                      if(typeof selected === 'object') {
                        updateRecord('startDate', selected.format('YYYY-MM-DD'))
                      }
                    }}
                  />
                </Col>
                <Col md={6}>
                  <FormLabel label={'End'} isRequired/>
                  <DateTimePicker
                    isDisabled={canEdit !== true}
                    dateFormat={'DD MMM YYYY'}
                    timeFormat={false}
                    className={`form-control`}
                    value={record?.endDate}
                    onChange={(selected) => {
                      if(typeof selected === 'object') {
                        updateRecord('endDate', selected.format('YYYY-MM-DD'))
                      }
                    }}
                  />
                </Col>
              </Row>
              <Row className={'space-above'}>
                <Col md={6}>
                  <FlexContainer className={'justify-content space-between align-items center'} style={{height: '100%'}}>
                      <div>
                        <TimePicker
                          value={`${record?.time || ""}`.trim() === '' ? undefined : moment(`${record?.time || ""}`).utc().format("HH:mm")}
                          onChange={(hours, minutes) => {
                            console.log('hours', hours);
                            console.log('minutes', minutes);
                            updateRecord('time', `1970-01-01T${hours}:${minutes}:00Z`)
                          }}
                        />
                      </div>
                      <div><b>ON</b></div>
                  </FlexContainer>
                </Col>
                <Col md={6}>
                  <FlexContainer className={'justify-content space-between align-items center'} style={{height: '100%'}}>
                    <div className={'text-center'}>
                      <FormLabel label={'MON'} />
                      <Form.Check checked={record?.monday || false} onChange={(event) => updateRecord('monday', event.target.checked)}/>
                    </div>
                    <div className={'text-center'}>
                      <FormLabel label={'TUE'} />
                      <Form.Check checked={record?.tuesday || false} onChange={(event) => updateRecord('tuesday', event.target.checked)} />
                    </div>
                    <div className={'text-center'}>
                      <FormLabel label={'WED'} />
                      <Form.Check checked={record?.wednesday || false} onChange={(event) => updateRecord('wednesday', event.target.checked)} />
                    </div>
                    <div className={'text-center'}>
                      <FormLabel label={'THU'} />
                      <Form.Check checked={record?.thursday || false} onChange={(event) => updateRecord('thursday', event.target.checked)} />
                    </div>
                    <div className={'text-center'}>
                      <FormLabel label={'FRI'} />
                      <Form.Check checked={record?.friday || false} onChange={(event) => updateRecord('friday', event.target.checked)} />
                    </div>
                  </FlexContainer>
                </Col>
              </Row>

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
                values={recordEvent?.AbsenceCode ? [recordEvent?.AbsenceCode || ''] : undefined}
                onSelect={(options) => {
                  // @ts-ignore
                  updateRecordEvent('AbsenceCode', options?.value || null)
                }}
              />
              <FormErrorDisplay errorsMap={errorMap} fieldName={'absenceReasonCode'} />
            </Col>
          </Row>
          <Row className={'space bottom-lg'}>
            <Col xs={12}>
              <FormLabel label={'Comments'} isRequired={recordEvent?.AbsenceCode === STUDENT_ABSENCE_REASON_CODE_OTHER}/>
              <FormControl
                value={recordEvent?.Comments || ''}
                disabled={canEdit !== true}
                onChange={(event) => updateRecordEvent('Comments', event.target.value || '')}
              />
              <FormErrorDisplay errorsMap={errorMap} fieldName={'comments'} />
            </Col>
          </Row>
          <FlexContainer className={'justify-content-between'}>
            <div />
            <div>
              <LoadingBtn
                variant={'link'}
                onClick={() => onCancel && onCancel(false)}
                isLoading={isSubmitting === true}
              >
                Cancel
              </LoadingBtn>
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

export default StudentScheduledAbsenceEditPanel;
