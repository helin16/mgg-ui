import { useSelector } from "react-redux";
import { RootState } from "../../redux/makeReduxStore";
import Page401 from "../Page401";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {Alert, Button, Col, FormControl, Row, Spinner} from "react-bootstrap";
import FormLabel from "../form/FormLabel";
import CommunityService from "../../services/Synergetic/CommunityService";
import {OP_OR} from "../../helper/ServiceHelper";
import StudentContactService from "../../services/Synergetic/StudentContactService";
import {
  STUDENT_CONTACT_TYPE_SC1,
  STUDENT_CONTACT_TYPE_SC2,
  STUDENT_CONTACT_TYPE_SC3
} from "../../types/Synergetic/iStudentContact";
import SynVStudentService from "../../services/Synergetic/SynVStudentService";
import * as _ from "lodash";
import iVStudent from "../../types/Synergetic/iVStudent";
import Toaster from "../../services/Toaster";
import SelectBox from "../common/SelectBox";
import SectionDiv from '../../pages/studentReport/components/AcademicReports/DetailsComponents/sections/SectionDiv';
import LoadingBtn from '../common/LoadingBtn';
import * as Icons from 'react-bootstrap-icons';
import {FlexContainer} from '../../styles';
import DateTimePicker from '../common/DateTimePicker';
import moment from 'moment-timezone';
import FormErrorDisplay from '../form/FormErrorDisplay';
import StudentAbsenceService from '../../services/StudentAbsences/StudentAbsenceService';

const Wrapper = styled.div``;

const reasons = [
  'Late arrival',
  'Positive COVID Case',
  'COVID House Hold Contact',
  'Medical / Illness',
  'Medical Appointment',
  'Refusal to attend school',
  'Parent Choice',
  'Religious / Cultural',
]
const StudentAbsenceParentSubmissionForm = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [students, setStudents] = useState<iVStudent[]>([]);
  const [selectedReason, setSelectedReason] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<iVStudent[]>([]);
  const [absenceDateFrom, setAbsenceDateFrom] = useState<string>(moment().format('YYYY-MM-DD'));
  const [absenceDateTo, setAbsenceDateTo] = useState<string>(moment().format('YYYY-MM-DD'));
  const [absenceDateIsToday, setAbsenceDateIsToday] = useState(true);
  const [errorMap, setErrorMap] = useState<{[key: string]: string}>({});
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);
  const [parentContactNumber, setParentContactNumber] = useState(
    user?.SynCommunity?.MobilePhone || ""
  );
  const [comments, setComments] = useState('');
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

  useEffect(() => {
    if (!user?.isParent) {
      return;
    }
    let isCanceled = false;

    const getChildren = async () => {
      const communityProfiles = await CommunityService.getCommunityProfiles({
        where: JSON.stringify({
          [OP_OR]: [{ SpouseID: user.synergyId }, { ID: user.synergyId }]
        })
      });
      const parentIds: number[] = [];
      (communityProfiles.data || []).map(community => {
        // @ts-ignore
        parentIds.push(Number(community.ID));
        parentIds.push(Number(community.SpouseID));
        return null;
      });

      if (isCanceled) {
        return;
      }
      const studentContacts = await StudentContactService.getStudentContacts({
        where: JSON.stringify({
          LinkedID: _.uniq(parentIds),
          ContactType: [
            STUDENT_CONTACT_TYPE_SC1,
            STUDENT_CONTACT_TYPE_SC2,
            STUDENT_CONTACT_TYPE_SC3
          ]
        })
      });

      if (isCanceled) {
        return;
      }
      const studentIds: number[] = (studentContacts.data || []).map(
        studentContact => {
          return Number(studentContact.ID);
        }
      );

      const students = await SynVStudentService.getCurrentVStudents({
        where: JSON.stringify({
          ID: _.uniq(studentIds)
        }),
        perPage: 99999
      });

      if (isCanceled) {
        return;
      }
      setStudents(students);
      setSelectedStudents(students);
      return students;
    };

    setIsLoadingStudents(true);
      getChildren()
      .catch(err => {
        if (isCanceled) {
          return;
        }
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) {
          return;
        }
        setIsLoadingStudents(false);
      });

    return () => {
      isCanceled = true;
    };
  }, [user?.isParent, user?.synergyId]);

  const getStudentDropDownList = () => {
    if (isLoadingStudents === true) {
      return <Spinner animation={"border"} />;
    }
    return (
      <>
        <SelectBox
          isMulti
          value={selectedStudents.map(student => ({
            value: student.StudentID,
            label: `${student.StudentGiven1} ${student.StudentSurname}`,
            data: student
          }))}
          options={students.map(student => ({
            value: student.StudentID,
            label: `${student.StudentGiven1} ${student.StudentSurname}`,
            data: student
          }))}
          onChange={options =>
            setSelectedStudents(
              options === null ? [] : options.map((option: any) => option.data)
            )
          }
        />
        <FormErrorDisplay errorsMap={errorMap} fieldName={'students'} />
      </>
    );
  };

  const getReasonDropdownList = () => {
    if (isLoadingStudents === true) {
      return <Spinner animation={"border"} />;
    }
    return (
      <>
        <SelectBox
          isClearable
          value={selectedReason ? {
            value: selectedReason,
            label: `${selectedReason}`
          } : null}
          options={reasons.map(reason => ({
            value: reason,
            label: `${reason}`
          }))}
          onChange={option =>
            setSelectedReason(
              option === null ? null : option.value
            )
          }
        />
        <FormErrorDisplay errorsMap={errorMap} fieldName={'absenceReason'} />
      </>
    );
  };

  const getAbsenceDateDiv = () => {
    return (
      <FlexContainer className={'with-gap lg-gap align-items center'}>
        <div className={'text-success'}>
          {
            absenceDateIsToday === true ?
              <Icons.CheckSquareFill style={{fontSize: '24px'}} className={'cursor-pointer'} onClick={() => setAbsenceDateIsToday(!absenceDateIsToday)}/>
              :
              <Icons.Square style={{fontSize: '24px'}} className={'cursor-pointer'} onClick={() => setAbsenceDateIsToday(!absenceDateIsToday)}/>
          }
        </div>
        {absenceDateIsToday === true ? null: (
          <FlexContainer className={'with-gap lg-gap'}>
            <DateTimePicker
              isValidDate={(cDate, sDate) => {
                return moment(sDate).format('YYYY-MM-DD') < moment(cDate).format('YYYY-MM-DD');
              }}
              dateFormat={'DD / MMM / YYYY'}
              timeFormat={''}
              // @ts-ignore
              value={`${absenceDateFrom || ''}`.trim() === '' ? undefined : absenceDateFrom}
              onChange={(selected) => {
                if(typeof selected === 'object') {
                  setAbsenceDateFrom(selected.format('YYYY-MM-DD'))
                }
              }}
            />
            <div> to </div>
            <DateTimePicker
              isValidDate={(cDate, sDate) => {
                return moment(sDate).format('YYYY-MM-DD') < moment(cDate).format('YYYY-MM-DD');
              }}
              dateFormat={'DD / MMM / YYYY'}
              timeFormat={''}
              // @ts-ignore
              value={`${absenceDateTo || ''}`.trim() === '' ? undefined : absenceDateTo}
              onChange={(selected) => {
                if(typeof selected === 'object') {
                  setAbsenceDateTo(selected.format('YYYY-MM-DD'))
                }
              }}
            />
          </FlexContainer>
        )}
      </FlexContainer>
    );
  };

  const preCheck = () => {
    const error: {[key: string]: string} = {};
    if (selectedStudents.length === 0) {
      error.students = `Need select at least a daughter of yours.`;
    }

    if (`${parentContactNumber}`.trim() === '') {
      error.parentContactNumber = `Your contact number is required.`;
    }

    if (absenceDateIsToday !== true && `${absenceDateFrom}`.trim() === '' && `${absenceDateTo}`.trim() === '') {
      error.absenceDate = `Absence date is required.`;
    }

    if (`${selectedReason}`.trim() === '') {
      error.absenceReason = `Absence reason is required.`;
    }
    setErrorMap(error);
    return Object.keys(error).length === 0;
  }

  const submit = () => {
    if (preCheck() !== true) {
      return;
    }
    // setIsSubmitting(true);
    const data = {
      students: selectedStudents.map(student => ({ID: student.StudentID, Surname: student.StudentSurname, Given1: student.StudentGiven1})),
      reason: selectedReason,
      parentContact: parentContactNumber,
      absenceDateFrom: absenceDateFrom,
      absenceDateTo: absenceDateTo,
      comments: comments,
    };

    setIsSubmitting(true);
    StudentAbsenceService.submitByParent(data)
      .then(resp => {
        console.log('resp', resp);
        setSubmittedSuccessfully(true);
      })
      .catch(err => {
        Toaster.showApiError(err);
      })
      .finally(() => {
        setIsSubmitting(false);
      })
  }

  if (!user || !user.isParent) {
    return (
      <Page401
        title={"Access to parents only"}
        description={<h4>Please contact IT or Module Admins for assistant</h4>}
      />
    );
  }

  if (submittedSuccessfully === true) {
    return (
      <Alert variant={'success'}>
        <h4>Submitted Successfully</h4>
        <p>
          Your request has been submitted successfully.
        </p>
        <Button
          variant={'primary'}
          onClick={() => {window.location.reload();}}>
          Create another one
        </Button>
      </Alert>
    )
  }

  return (
    <Wrapper>
      <div
        className={"text-center text-muted"}
        style={{ marginBottom: "1rem" }}
      >
        Is your child absent? Please let us know.
      </div>
      <Row>
        <Col md={4}>
          <FormLabel label={"Student(s)"} isRequired />
          {getStudentDropDownList()}
        </Col>
        <Col md={2}>
          <FormLabel label={"Parent Contact"} isRequired />
          <FormControl
            value={parentContactNumber}
            onChange={event => setParentContactNumber(event.target.value)}
          />
          <FormErrorDisplay errorsMap={errorMap} fieldName={'parentContactNumber'} />
        </Col>
        <Col md={6}>
          <FormLabel label={"Today?"} isRequired />
          {getAbsenceDateDiv()}
        </Col>
      </Row>
      <SectionDiv>
        <Row>
          <Col md={6}>
            <FormLabel label={"Reason"} isRequired />
            {getReasonDropdownList()}
          </Col>
        </Row>
      </SectionDiv>
      <SectionDiv>
        <Row>
          <Col>
            <FormLabel label={"Comments"} />
            <FormControl
              as={'textarea'}
              value={comments}
              onChange={event => setComments(event.target.value)}
              style={{ height: '100px' }}
            />
          </Col>
        </Row>
      </SectionDiv>
      <SectionDiv>
        <Row>
          <Col>
            <LoadingBtn isLoading={isSubmitting} variant={'primary'} onClick={() => submit()}>
              <Icons.Send /> {' '}
              Submit
            </LoadingBtn>
          </Col>
        </Row>
      </SectionDiv>
    </Wrapper>
  );
};

export default StudentAbsenceParentSubmissionForm;
