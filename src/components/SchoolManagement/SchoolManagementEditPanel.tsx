import iSchoolManagementTeam, {SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR} from '../../types/Synergetic/iSchoolManagementTeam';
import styled from 'styled-components';
import {Button, Col, FormControl, Row} from 'react-bootstrap';
import FormLabel from '../form/FormLabel';
import FileYearSelector from '../student/FileYearSelector';
import {useEffect, useState} from 'react';
import FileSemesterSelector from '../student/FileSemesterSelector';
import LoadingBtn from '../common/LoadingBtn';
import * as Icons from 'react-bootstrap-icons';
import SchoolManagementRoleSelector from './SchoolManagementRoleSelector';
import YearLevelSelector from '../student/YearLevelSelector';
import {CAMPUS_CODE_SENIOR} from '../../types/Synergetic/Lookup/iSynLuCampus';
import StaffAutoComplete from '../staff/StaffAutoComplete';
import SectionDiv from '../common/SectionDiv';
import moment from 'moment-timezone';
import FormErrorDisplay from '../form/FormErrorDisplay';
import Toaster, {TOAST_TYPE_ERROR, TOAST_TYPE_SUCCESS} from '../../services/Toaster';
import SchoolManagementTeamService from '../../services/Synergetic/SchoolManagementTeamService';
import ExplanationPanel from '../ExplanationPanel';

type iSchoolManagementEditPanel = {
  title?: any;
  schoolManagementTeam?: iSchoolManagementTeam;
  isSaving?: boolean;
  onSaved?: (team: iSchoolManagementTeam) => void;
  onIsSubmitting?: (isSubmitting: boolean) => void;
  onCancel?: () => void;
}

const Wrapper = styled.div`
  .submit-row {
    margin-top: 1rem;
  }
`;
const SchoolManagementEditPanel = ({onIsSubmitting, onCancel, schoolManagementTeam, onSaved, title, isSaving = false} : iSchoolManagementEditPanel) => {
  const [isSubmitting, setIsSubmitting] = useState(isSaving);
  const [fileYear, setFileYear] = useState(schoolManagementTeam?.FileYear || null);
  const [fileSemester, setFileSemester] = useState(schoolManagementTeam?.FileSemester || null);
  const [roleCode, setRoleCode] = useState(schoolManagementTeam?.SchoolRoleCode || '');
  const [yearLevelCode, setYearLevelCode] = useState(schoolManagementTeam?.YearLevelCode || '');
  const [staffId, setStaffId] = useState(schoolManagementTeam?.SSTStaffID || null);
  const [actingStaffID1, setActingStaffID1] = useState(schoolManagementTeam?.ActingStaffID1 || null);
  const [actingStaffID2, setActingStaffID2] = useState(schoolManagementTeam?.ActingStaffID2 || null);
  const [comments, setComments] = useState(schoolManagementTeam?.Comments || '');
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  useEffect(() => {
    setYearLevelCode(roleCode === SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR ? yearLevelCode : '');
  }, [roleCode, yearLevelCode])

  const getTheYearLevelSelector = () => {
    if (roleCode !== SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR) {
      return null;
    }
    return (
      <Col md={3}>
        <FormLabel label={'Year Level'} isRequired/>
        <YearLevelSelector
          isDisabled={isSubmitting}
          campusCodes={[CAMPUS_CODE_SENIOR]}
          classname={'yearLevel-selector'}
          values={yearLevelCode ? [`${yearLevelCode}`] : []}
          onSelect={(options) => {
            // @ts-ignore
            setYearLevelCode(options?.data.Code || '')
          }}
        />
        <FormErrorDisplay errorsMap={errors} fieldName={'YearLevelCode'} />
      </Col>
    )
  }

  const preSubmitCheck = () => {
    const checkingErrors: {[key: string]: string} = {};

    const fileYearString = `${fileYear || ''}`.trim();
    if (fileYearString === '') {
      checkingErrors.fileYear = `File Year is required.`;
    }

    const fileSemesterString = `${fileSemester || ''}`.trim();
    if (fileSemesterString === '') {
      checkingErrors.fileSemester = `File Semester is required.`;
    }

    const roleCodeString = `${roleCode || ''}`.trim();
    if (roleCodeString === '') {
      checkingErrors.SchoolRoleCode = `Role is required.`;
    }

    const yearLevelCodeString = `${yearLevelCode || ''}`.trim();
    if (yearLevelCodeString === '' && roleCodeString === SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR) {
      checkingErrors.YearLevelCode = `YearLevel is required.`;
    }

    const staffIdString = `${staffId || ''}`.trim();
    if (staffIdString === '') {
      checkingErrors.SSTStaffID = `Staff is required.`;
    }

    setErrors(checkingErrors);
    if(Object.keys(checkingErrors).length > 0) {
      return false
    }
    return true;
  }

  const submit = () => {
    if (preSubmitCheck() === false) {
      Toaster.showToast('Error in your provided data', TOAST_TYPE_ERROR);
      return;
    }

    setIsSubmitting(true);
    if (onIsSubmitting) {
      onIsSubmitting(true);
    }
    const id = `${schoolManagementTeam?.SchoolSeniorTeamID || ''}`.trim();
    const data = {
      FileYear: fileYear,
      FileSemester: fileSemester,
      SchoolRoleCode: roleCode,
      YearLevelCode: `${yearLevelCode}`.trim() === '' ? null : yearLevelCode,
      SSTStaffID: staffId,
      ActingStaffID1: `${actingStaffID1}`.trim() === '' ? null : actingStaffID1,
      ActingStaffID2: `${actingStaffID2}`.trim() === '' ? null : actingStaffID2,
      Comments: `${comments}`.trim(),
    }
    const savingFn = id === '' ? SchoolManagementTeamService.create(data) : SchoolManagementTeamService.update(id, data);
    savingFn
      .then((resp) => {
        Toaster.showToast((id === '' ? 'Created Successfully' : 'Update Successfully'), TOAST_TYPE_SUCCESS);
        onSaved && onSaved(resp);
      })
      .catch(err => {
        Toaster.showApiError(err);
      })
      .finally(() => {
        setIsSubmitting(false);
        if (onIsSubmitting) {
          onIsSubmitting(false);
        }
      })
  }

  return (
    <Wrapper>
      {title}
      <div className={'editing-panel'}>
        <SectionDiv>
          <Row>
            <Col md={3}>
              <FormLabel label={'File Year'} isRequired/>
              <FileYearSelector
                isDisabled={isSubmitting}
                value={fileYear} onSelect={(year) => setFileYear(year || moment().year())}
              />
              <FormErrorDisplay errorsMap={errors} fieldName={'fileYear'} />
            </Col>
            <Col md={3}>
              <FormLabel label={'Term'} isRequired />
              <FileSemesterSelector
                isDisabled={isSubmitting}
                value={fileSemester || undefined}
                onSelect={(semester) => setFileSemester(semester || 1)}
                semesters={[1, 2, 3, 4]}
              />
              <FormErrorDisplay errorsMap={errors} fieldName={'fileSemester'} />
            </Col>
            <Col md={roleCode !== SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR ? 6 : 3}>
              <FormLabel label={'Role'} isRequired/>
              <SchoolManagementRoleSelector
                isDisabled={isSubmitting}
                values={[roleCode]}
                onSelect={(values) => {
                  // @ts-ignore
                  setRoleCode(values === null ? '' : ((Array.isArray(values) && values.length > 0) ? `${values[0].value}` : `${values.value || ''}`))
                }}
              />
              <FormErrorDisplay errorsMap={errors} fieldName={'SchoolRoleCode'} />
            </Col>
            {getTheYearLevelSelector()}
          </Row>
        </SectionDiv>
        <SectionDiv>
          <Row>
            <Col md={3}>
              <FormLabel label={'Staff'} isRequired/>
              <StaffAutoComplete
                isDisabled={isSubmitting}
                allowClear
                value={ staffId === null  ? null : {ID: staffId}}
                onSelect={(option) => setStaffId(option !== null ? Number(option?.value) : null)}
              />
              <FormErrorDisplay errorsMap={errors} fieldName={'SSTStaffID'} />
            </Col>
            <Col md={3}>
              <FormLabel label={'Acting Staff 1'} />
              <StaffAutoComplete
                isDisabled={isSubmitting}
                allowClear
                value={ actingStaffID1 === null  ? null : {ID: actingStaffID1}}
                onSelect={(option) => setActingStaffID1(option !== null ? Number(option?.value) : null)}
              />
              <FormErrorDisplay errorsMap={errors} fieldName={'ActingStaffID1'} />
            </Col>
            <Col md={3}>
              <FormLabel label={'Acting Staff 2'} />
              <StaffAutoComplete
                isDisabled={isSubmitting}
                allowClear
                value={ actingStaffID2 === null  ? null : {ID: actingStaffID2}}
                onSelect={(option) => setActingStaffID2(option !== null ? Number(option?.value) : null)}
              />
              <FormErrorDisplay errorsMap={errors} fieldName={'ActingStaffID2'} />
            </Col>
          </Row>
        </SectionDiv>
        <SectionDiv>
          <Row>
            <Col md={12}>
              <FormLabel label={'Comments'} />
              <FormControl
                disabled={isSubmitting}
                value={comments}
                onChange={(event) => setComments(event.target.value || '')}
              />
              <SectionDiv>
                <ExplanationPanel text={
                  <>
                    Please use the keyword <b>Acting</b> for acting roles, like Acting Head of Senior School
                  </>
                } />
              </SectionDiv>
            </Col>
          </Row>
        </SectionDiv>
        <SectionDiv>
          <Row>
            <Col sm={12} className={'text-right submit-row'}>
              {onCancel && (<Button variant={'link'} onClick={() => onCancel()} disabled={isSubmitting}>Cancel</Button> )}
              <LoadingBtn isLoading={isSubmitting} variant={'primary'} onClick={() => submit()}>
                <Icons.Send /> {' '}
                <span>Save</span>
              </LoadingBtn>
            </Col>
          </Row>
        </SectionDiv>
      </div>
    </Wrapper>
  )
}

export default SchoolManagementEditPanel;
