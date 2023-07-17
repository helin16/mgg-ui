import { useEffect, useState } from "react";
import {
  iRecordType,
  iRecordTypeMap,
  iStudentAbsence,
  STUDENT_ABSENCE_REASON_CODE_OTHER
} from "../../../types/StudentAbsence/iStudentAbsence";
import styled from "styled-components";
import { Alert, Button, Col, FormControl, Row, Spinner } from "react-bootstrap";
import StudentAbsenceService from "../../../services/StudentAbsences/StudentAbsenceService";
import iVStudent from "../../../types/Synergetic/iVStudent";
import { FlexContainer } from "../../../styles";
import FormLabel from "../../../components/form/FormLabel";
import DateTimePicker from "../../../components/common/DateTimePicker";
import SynLuAbsenceReasonSelector from "../../../components/student/SynLuAbsenceReasonSelector";
import LoadingBtn from "../../../components/common/LoadingBtn";
import * as Icons from "react-bootstrap-icons";
import Toaster, { TOAST_TYPE_SUCCESS } from "../../../services/Toaster";
import moment from "moment-timezone";
import FormErrorDisplay from "../../../components/form/FormErrorDisplay";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/makeReduxStore";
import { SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR } from "../../../types/Synergetic/iSchoolManagementTeam";
import { MGGS_MODULE_ID_STUDENT_ABSENCES } from "../../../types/modules/iModuleUser";
import AuthService from "../../../services/AuthService";
import SchoolManagementTeamService from "../../../services/Synergetic/SchoolManagementTeamService";
import SectionDiv from "../../../components/common/SectionDiv";
import StudentAbsenceSyncToSynergeticPanel from "./StudentAbsenceSyncToSynergeticPanel";

type iStudentAbsenceEditPanel = {
  recordType: iRecordType;
  studentAbsenceRecord?: iStudentAbsence;
  onSaved?: (newRecord: iStudentAbsence | null) => void;
  onIsSubmitting?: (isSubmitting: boolean) => void;
  onCancel?: (isSubmitting: boolean) => void;
  isSaving?: boolean;
  isExpectedEvent?: boolean;
  student?: iVStudent;
};

const Wrapper = styled.div``;
const StudentAbsenceEditPanel = ({
  studentAbsenceRecord,
  recordType,
  student,
  onSaved,
  onIsSubmitting,
  onCancel,
  isExpectedEvent = false,
  isSaving = false
}: iStudentAbsenceEditPanel) => {
  const [isSubmitting, setIsSubmitting] = useState(isSaving);
  const [record, setRecord] = useState<iStudentAbsence | undefined>(undefined);
  const [hasNote, setHasNote] = useState<boolean>(
    studentAbsenceRecord?.hasNote || false
  );
  const [eventDate, setEventDate] = useState(
    studentAbsenceRecord?.EventDate || moment().toISOString()
  );
  const [absenceReasonCode, setAbsenceReasonCode] = useState(
    studentAbsenceRecord?.AbsenceCode || null
  );
  const [recordComments, setRecordComments] = useState(
    studentAbsenceRecord?.Comments || ""
  );
  const [canEdit, setCanEdit] = useState(false);
  const [canAccess, setCanAccess] = useState(false);
  const [isModuleUser, setIsModuleUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMap, setErrorMap] = useState<{ [key: string]: any }>({});
  const [vStudent, setVStudent] = useState<iVStudent | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (record?.Student) {
      setVStudent(record?.Student);
    } else if (student) {
      setVStudent(student);
    } else {
      setVStudent(null);
    }
  }, [record, student]);


  useEffect(() => {
    let isCanceled = false;
    setIsLoading(true);
    Promise.all([
      AuthService.canAccessModule(MGGS_MODULE_ID_STUDENT_ABSENCES),
      SchoolManagementTeamService.getSchoolManagementTeams({
        where: JSON.stringify({
          SSTStaffID: user?.synergyId || "",
          SchoolRoleCode: SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR,
          FileYear: user?.SynCurrentFileSemester?.FileYear || moment().year(),
          FileSemester:
            user?.SynCurrentFileSemester?.FileSemester || moment().year(),
          YearLevelCode: vStudent?.StudentYearLevel
        })
      }),
      ...(`${studentAbsenceRecord?.id || ''}`.trim() === '' ? [] : [StudentAbsenceService.getAll({where: JSON.stringify({id: studentAbsenceRecord?.id || '', type: recordType}), include: `Student,AbsenceReason,CreatedBy,ApprovedBy,Expected,SyncdBy`,})])
    ])
      .then(resp => {
        if (isCanceled) return;
        const canAccessRoles = Object.keys(resp[0])
          // @ts-ignore
          .filter((roleId: number) => resp[0][roleId].canAccess === true)
          .reduce((map, roleId) => {
            return {
              ...map,
              // @ts-ignore
              [roleId]: resp[0][roleId]
            };
          }, {});
        const accessible = Object.keys(canAccessRoles).length > 0 || resp[1].length > 0;
        const recordFromDB = `${studentAbsenceRecord?.id || ''}`.trim() === '' ? undefined : (resp[2].data || []).length > 0 ? resp[2].data[0] : undefined;
        setCanEdit(accessible && `${recordFromDB?.syncd_AbsenceEventSeq || ""}`.trim() === "")
        setCanAccess(accessible);
        setIsModuleUser(Object.keys(canAccessRoles).length > 0);
        setRecord(recordFromDB);
      })
      .catch(err => {
        if (isCanceled) return;
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) return;
        setIsLoading(false);
      });

    return () => {
      isCanceled = true;
    };
  }, [user, vStudent?.StudentYearLevel, studentAbsenceRecord, recordType]);

  const preCheck = (): boolean => {
    const errors: { [key: string]: any } = {};

    const eventDateStr = `${eventDate || ""}`.trim();
    if (eventDateStr === "") {
      errors.eventDate = "Event Date is required.";
    }

    const reasonCode = `${absenceReasonCode || ""}`.trim();
    if (reasonCode === "") {
      errors.absenceReasonCode = "Reason is required.";
    }

    const commentsStr = `${recordComments || ""}`.trim();
    if (
      reasonCode === STUDENT_ABSENCE_REASON_CODE_OTHER &&
      commentsStr === ""
    ) {
      errors.recordComments = "Comments is required.";
    }

    setErrorMap(errors);
    return Object.keys(errors).length === 0;
  };

  const submit = () => {
    if (preCheck() !== true) {
      return;
    }
    const data = {
      type: recordType,
      StudentID: vStudent?.StudentID,
      AbsenceCode: absenceReasonCode,
      hasNote,
      EventDate: eventDate,
      Comments: `${recordComments || ''}`.trim(),
      ...(`${record?.id || ""}`.trim() === "" ? { isExpectedEvent } : {})
    };
    // console.log('data', data);
    // return;
    if (onIsSubmitting) {
      onIsSubmitting(true);
    } else {
      setIsSubmitting(true);
    }
    const fnc =
      `${record?.id || ""}`.trim() === ""
        ? StudentAbsenceService.create(data)
        : StudentAbsenceService.update(record?.id || "", data);
    fnc
      .then(resp => {
        Toaster.showToast(
          `${StudentAbsenceService.getAbsenceTypeName(recordType)} for ${
            vStudent?.StudentNameInternal
          } saved successfully.`,
          TOAST_TYPE_SUCCESS
        );
        if (onSaved) {
          onSaved(resp);
        }
      })
      .catch(err => {
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (onIsSubmitting) {
          onIsSubmitting(false);
        } else {
          setIsSubmitting(false);
        }
      });
  };

  const approve = () => {
    if (onIsSubmitting) {
      onIsSubmitting(true);
    } else {
      setIsSubmitting(true);
    }
    StudentAbsenceService.update(record?.id || "", {
      type: recordType,
      approved_at: moment().toISOString(),
      approved_by_id: user?.synergyId
    })
      .then(resp => {
        Toaster.showToast(
          `${StudentAbsenceService.getAbsenceTypeName(recordType)} for ${
            vStudent?.StudentNameInternal
          } approved successfully.`,
          TOAST_TYPE_SUCCESS
        );
        setRecord(resp);
        if (onSaved) {
          onSaved(resp);
        }
      })
      .catch(err => {
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (onIsSubmitting) {
          onIsSubmitting(false);
        } else {
          setIsSubmitting(false);
        }
      });
  };

  const getAccessNotice = () => {
    if (canAccess === false) {
      return (
        <Alert variant={"warning"}>
          <b>Access Denied</b>
          <div>You don't have access to this student</div>
        </Alert>
      );
    }
    return null;
  };

  const getApprovedInfoPanel = () => {
    if (`${record?.approved_at || ""}`.trim() === "") {
      return null;
    }

    return (
      <SectionDiv className={"text-center"}>
        <h5>Record Approved</h5>
        <div>
          <b>By:</b>
          {record?.ApprovedBy?.Given1} {record?.ApprovedBy?.Surname}
        </div>
        <div>
          <b>@</b>
          {moment(record?.approved_at).format("lll")}
        </div>
      </SectionDiv>
    );
  };

  const getSyncToSynergeticPanel = () => {
    if (!isModuleUser || !record) {
      return null;
    }
    return (
      <SectionDiv className={"text-center"}>
        <StudentAbsenceSyncToSynergeticPanel
          recordType={recordType}
          studentAbsenceRecord={record}
          onIsSubmitting={submitting => setIsSubmitting(submitting)}
          onSaved={onSaved}
          isSaving={isSaving || isSubmitting}
        />
      </SectionDiv>
    );
  };

  const getCheckInput = (isChecked: boolean | undefined) => {
    return isChecked === true ? (
      <Icons.CheckSquareFill className={"text-success"} />
    ) : (
      <Icons.Square />
    );
  };

  if (isLoading) {
    return <Spinner animation={"border"} />;
  }

  return (
    <Wrapper>
      <Row>
        <Col className={"text-center"} md={3}>
          {vStudent ? (
            <img src={vStudent.profileUrl} alt={vStudent.StudentGiven1} />
          ) : null}
        </Col>
        <Col md={9}>
          {getAccessNotice()}
          <Row className={"space bottom-lg"}>
            <Col md={4}>
              <b>Absence Type:</b>{" "}
              {StudentAbsenceService.getAbsenceTypeName(recordType)}
            </Col>
            <Col md={4}>
              <b>Student Name:</b> {vStudent?.StudentNameInternal} [
              {vStudent?.StudentID}]
            </Col>
            <Col md={4}>
              <b>Form:</b> {vStudent?.StudentForm}
            </Col>
          </Row>
          <Row className={"space bottom-lg"}>
            <Col xs={12}>
              <FlexContainer
                className={"cursor-pointer withGap"}
                onClick={() => canEdit && isSubmitting !== true && setHasNote(!hasNote)}
              >
                <b>Notification Received:</b> {getCheckInput(hasNote)}
              </FlexContainer>
            </Col>
          </Row>
          <Row className={"space bottom-lg"}>
            <Col xs={12}>
              <FormLabel label={"Date"} isRequired />
              <DateTimePicker
                isDisabled={canEdit !== true || isSubmitting === true}
                dateFormat={"DD MMM YYYY"}
                timeFormat={"hh:mm a"}
                className={`form-control`}
                value={eventDate}
                onChange={selected => {
                  if (typeof selected === "object") {
                    setEventDate(selected.toISOString());
                  }
                }}
              />
              <FormErrorDisplay errorsMap={errorMap} fieldName={"eventDate"} />
            </Col>
          </Row>
          <Row className={"space bottom-lg"}>
            <Col xs={12}>
              <FormLabel label={"Reason"} isRequired />
              <SynLuAbsenceReasonSelector
                isDisabled={canEdit !== true || isSubmitting === true}
                allowClear
                addOtherRegardless
                absenceTypeCodes={
                  recordType in iRecordTypeMap
                    ? [iRecordTypeMap[recordType]]
                    : []
                }
                values={absenceReasonCode ? [absenceReasonCode] : undefined}
                onSelect={options => {
                  // @ts-ignore
                  setAbsenceReasonCode(options?.value || null);
                }}
              />
              <FormErrorDisplay
                errorsMap={errorMap}
                fieldName={"absenceReasonCode"}
              />
            </Col>
          </Row>
          <Row className={"space bottom-lg"}>
            <Col xs={12}>
              <FormLabel
                label={"Comments"}
                isRequired={
                  absenceReasonCode === STUDENT_ABSENCE_REASON_CODE_OTHER
                }
              />
              <FormControl
                type='text' placeholder='Name' name='name'
                value={recordComments || ''}
                disabled={canEdit !== true || isSubmitting === true}
                onKeyDown={event => {
                  event.stopPropagation();
                }}
                onChange={event => {
                  setRecordComments(event.target.value || '')
                }}
              />
              <FormErrorDisplay errorsMap={errorMap} fieldName={"comments"} />
            </Col>
          </Row>
          {getApprovedInfoPanel()}
          {getSyncToSynergeticPanel()}
          <FlexContainer className={"justify-content-between"}>
            <div>
              {canEdit === true &&
              `${record?.id || ""}`.trim() !== "" &&
              `${record?.approved_at || ""}`.trim() === "" ? (
                <Row>
                  <Col>
                    <LoadingBtn
                      variant={"success"}
                      isLoading={isSubmitting === true}
                      onClick={() => approve()}
                    >
                      Approve
                    </LoadingBtn>
                  </Col>
                </Row>
              ) : null}
            </div>
            <div>
              <Button
                variant={"link"}
                onClick={() => onCancel && onCancel(false)}
              >
                Cancel
              </Button>
              {canEdit === true ? (
                <LoadingBtn
                  variant={"primary"}
                  isLoading={isSubmitting === true}
                  onClick={() => submit()}
                >
                  <Icons.Send />{" "}
                  {`${record?.id || ""}`.trim() === "" ? "Create" : "Update"}
                </LoadingBtn>
              ) : null}
            </div>
          </FlexContainer>
        </Col>
      </Row>
    </Wrapper>
  );
};

export default StudentAbsenceEditPanel;
