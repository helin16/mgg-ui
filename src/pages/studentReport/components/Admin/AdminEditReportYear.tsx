import React, {useEffect, useState} from 'react';
import iStudentReportYear, {getDataForClone} from '../../../../types/Synergetic/iStudentReportYear';
import {Button, Col, Form, Row } from 'react-bootstrap';
import FileYearSelector from '../../../../components/student/FileYearSelector';
import CampusSelector from '../../../../components/student/CampusSelector';
import YearLevelSelector from '../../../../components/student/YearLevelSelector';
import ReportStyleSelector from './ReportStyleSelector';
import styled from 'styled-components';
import ExplanationTooltip from '../../../../components/common/ExplanationTooltip';
import ToggleBtn from '../../../../components/common/ToggleBtn';
import LearningAreaSelector from '../../../../components/student/LearningAreaSelector';
import {SYN_LEARNING_AREA_FILE_TYPE_A} from '../../../../types/Synergetic/iSynLearningArea';
import RichTextEditor from '../../../../components/common/RichTextEditor/RichTextEditor';
import DateTimePicker from '../../../../components/common/DateTimePicker';
import FileSemesterSelector from '../../../../components/student/FileSemesterSelector';
import LoadingBtn from '../../../../components/common/LoadingBtn';
import EmptyState from '../../../../components/common/EmptyState';
import StudentReportService from '../../../../services/Synergetic/StudentReportService';
import * as Icons from 'react-bootstrap-icons';

const Wrapper = styled.div`
  .form-control.is-invalid {
    border-color: #dc3545;
  }
  .form-field {
    margin-bottom: 0.5rem;
  }
  .form-label {
    margin-bottom: 2px;
  }
  [id$='-listbox'][id^='react-select-'] {
    z-index: 99999;
  }
  
`
type iAdminEditReportYear = {
  reportYear: iStudentReportYear | null,
  onCancel?: () => void,
  onSaved?: (newReportYear: iStudentReportYear) => void;
}
type iAdminEditReportYearError = {
  Name?: string;
  styleCode?: string;
  FileYear?: string;
  FileSemester?: string;
  CampusCode?: string;
  ReleaseToStaffDate?: string;
}
const AdminEditReportYear = ({reportYear, onCancel, onSaved}: iAdminEditReportYear) => {

  const [isSaving, setIsSaving] = useState(false);
  const [editingReportYear, setEditingReportYear] = useState<any>(null);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const [errorMap, setErrorMap] = useState<iAdminEditReportYearError>({});

  useEffect(() => {
    if (reportYear === null) { return }
    setEditingReportYear({
      ...reportYear
    });
  }, [reportYear])


  const getTitle = () => {
    if (editingReportYear === null || `${editingReportYear?.ID || ''}`.trim() === '') {
      return `Creating`
    }
    return (
      <>
        Editing {editingReportYear?.Name} {' '}
        <Button
          variant={'secondary'}
          title={'clone'}
          size={'sm'}
          className={'flexbox-inline flexbox-align-items-center'}
          onClick={() => {
            setEditingReportYear(getDataForClone(editingReportYear))
          }}>
          <Icons.Files />
          <span> Clone</span>
        </Button>
      </>
    )
  }

  const changeField = (fieldName: string, value: string | number | boolean | null) => {
    const newReportYear = {
      ...(editingReportYear !== null ? editingReportYear : {}),
      [fieldName]: value,
    }
    preSaveCheck(newReportYear);
    setEditingReportYear(newReportYear);
  }

  const preSaveCheck = (repYear: iStudentReportYear | null) => {
    const errors: iAdminEditReportYearError = {}
    if (`${repYear?.Name || ''}`.trim() === '') {
      errors.Name = 'Name is required';
    }
    if (`${repYear?.styleCode || ''}`.trim() === '') {
      errors.styleCode = 'Style is required';
    }
    if (`${repYear?.FileYear || ''}`.trim() === '') {
      errors.FileYear = 'Year is required';
    }
    if (`${repYear?.FileSemester || ''}`.trim() === '') {
      errors.FileSemester = 'Semester is required';
    }
    if (`${repYear?.CampusCode || ''}`.trim() === '') {
      errors.CampusCode = 'Campus is required';
    }
    if (`${repYear?.ReleaseToStaffDate || ''}`.trim() === '') {
      errors.ReleaseToStaffDate = 'ReleaseToStaffDate is required';
    }
    setErrorMap(errors);
    return Object.keys(errors).length <= 0;
  }

  const saveReport = () => {
    if (preSaveCheck(editingReportYear) !== true) { return }
    setIsSaving(true);
    const fn = `${editingReportYear.ID || ''}`.trim() === '' ?
      StudentReportService.createStudentReportYear(editingReportYear)
      : StudentReportService.updateStudentReportYear(editingReportYear.ID, editingReportYear);
    fn.then(resp => {
        setEditingReportYear(resp);
        setSavedSuccessfully(true);
        if (onSaved) {
          onSaved(resp);
        }
      })
      .finally(() => {
        setIsSaving(false);
      })
  }

  const getBtns = (showCancelBtn = true) => {
    return <>
      {
        showCancelBtn && onCancel ?
        <Button variant={'link'} onClick={onCancel}>
          Cancel
        </Button>
        : null
      }
      <LoadingBtn variant={'primary'} onClick={() => saveReport()} isLoading={isSaving}>
        Save
      </LoadingBtn>
    </>
  }

  const getErrorMsg = (fieldName: string) => {
    if (!(fieldName in errorMap)) {
      return null;
    }
    return (
      // @ts-ignore
      <Form.Control.Feedback className={'invalid-feedback'}>{errorMap[fieldName]}</Form.Control.Feedback>
    )
  }

  const getErrorClassName = (fieldName: string) => {
    if (!(fieldName in errorMap)) {
      return '';
    }
    return 'is-invalid';
  }

  if (savedSuccessfully === true) {
    return <EmptyState
      title={'Saved Successfully'}
      description={<>Report <b>{editingReportYear.Name}</b> has been saved successfully.</>}
      mainBtn={
        <Button variant={'primary'} onClick={() => setSavedSuccessfully(false)}>View Details</Button>
      }
      secondaryBtn={
        onCancel ?
        <Button variant={'link'} onClick={onCancel}>Back to list</Button>
        : null
      }
    />
  }

  return (
    <Wrapper>
      <h3>
        {getTitle()}
        <div className={'pull-right'}>
          {getBtns()}
        </div>
      </h3>
      <div className={'editing-body-wrapper'}>
        <Form>
          <Row>
            <Form.Group as={Col} md={4} className={'form-field'}>
              <Form.Label>Name <small className={'text-danger'}>*</small></Form.Label>
              <Form.Control
                className={getErrorClassName('Name')}
                placeholder={'The name of the report'}
                value={editingReportYear?.Name || ''}
                onChange={(event) => changeField('Name', event.target.value)}
              />
              {getErrorMsg('Name')}
            </Form.Group>

            <Form.Group as={Col} md={2} xs={5} className={'form-field'}>
              <Form.Label>Style <small className={'text-danger'}>*</small></Form.Label>
              <ReportStyleSelector
                className={`form-control ${getErrorClassName('styleCode')}`}
                showIndicator={false}
                value={editingReportYear?.styleCode || undefined}
                onSelect={(styleCode) => changeField('styleCode', styleCode)}
              />
              {getErrorMsg('styleCode')}
            </Form.Group>

            <Form.Group as={Col} md={1} xs={4} className={'form-field'}>
              <Form.Label>Year <small className={'text-danger'}>*</small></Form.Label>
              <FileYearSelector
                className={`form-control ${getErrorClassName('FileYear')}`}
                showIndicator={false}
                value={editingReportYear?.FileYear}
                onSelect={(year) => changeField('FileYear', year)}
              />
              {getErrorMsg('FileYear')}
            </Form.Group>

            <Form.Group as={Col} md={1} xs={3} className={'form-field'}>
              <Form.Label>Sem.: <small className={'text-danger'}>*</small></Form.Label>
              <FileSemesterSelector
                className={`form-control ${getErrorClassName('FileSemester')}`}
                showIndicator={false}
                value={editingReportYear?.FileSemester}
                onSelect={(semester) => changeField('FileSemester', semester)}
              />
              {getErrorMsg('FileSemester')}
            </Form.Group>

            <Form.Group as={Col} md={2} xs={6} className={'form-field'}>
              <Form.Label>Campus <small className={'text-danger'}>*</small></Form.Label>
              <CampusSelector
                className={`form-control ${getErrorClassName('CampusCode')}`}
                showIndicator={false}
                values={editingReportYear ? [editingReportYear?.CampusCode] : undefined}
                onSelect={(option) => changeField('CampusCode', option?.value || null)}
              />
              {getErrorMsg('CampusCode')}
            </Form.Group>

            <Form.Group as={Col} md={2} xs={6} className={'form-field'}>
              <Form.Label>YearLevel</Form.Label>
              <YearLevelSelector
                showIndicator={false}
                allowClear={true}
                values={editingReportYear ? [editingReportYear?.YearLevelCode] : undefined}
                onSelect={(option) => changeField('YearLevelCode', option?.value || null)}
              />
            </Form.Group>
          </Row>

          <Row>
            <Form.Group as={Col} md={2} sm={6} className={'form-field'}>
              <Form.Label>Release to Staff Date <small className={'text-danger'}>*</small></Form.Label>
              <DateTimePicker
                className={`form-control ${getErrorClassName('ReleaseToStaffDate')}`}
                value={editingReportYear?.ReleaseToStaffDate}
                onChange={(selected) => {
                  if(typeof selected === 'object') {
                    changeField('ReleaseToStaffDate', selected.toISOString())
                  }
                }}
              />
              {getErrorMsg('ReleaseToStaffDate')}
            </Form.Group>

            <Form.Group as={Col} md={2} sm={6} className={'form-field'}>
              <Form.Label>Release to All Date</Form.Label>
              <DateTimePicker
                value={editingReportYear?.ReleaseToAllDate}
                allowClear={true}
                onChange={(selected) => {
                  if(selected === null) {
                    changeField('ReleaseToAllDate', null);
                    return;
                  }
                  if(typeof selected === 'object') {
                    changeField('ReleaseToAllDate', selected.toISOString());
                    return;
                  }
                }}
              />
            </Form.Group>

            <Form.Group as={Col} md={1} sm={2} xs={4} className={'form-field'}>
              <Form.Label>
                <span>Show HG:</span>{' '}<ExplanationTooltip placement={'top'} description={<div>Show Home Group Page in Report</div>} />
              </Form.Label>
              <div>
                <ToggleBtn
                  on={'Yes'}
                  off={'No'}
                  size={'sm'}
                  checked={editingReportYear?.IncludeHomeGroup === true}
                  onChange={(checked) => changeField('IncludeHomeGroup', checked)}
                />
              </div>
            </Form.Group>

            <Form.Group as={Col} md={1} sm={2} xs={4} className={'form-field'}>
              <Form.Label>
                <span>Incl. LoE:</span>{' '}<ExplanationTooltip placement={'top'} description={<div>Include Letter of Explanation in the PDF</div>} />
              </Form.Label>
              <div>
                <ToggleBtn
                  on={'Yes'}
                  off={'No'}
                  size={'sm'}
                  checked={editingReportYear?.IncludeLetterOfExplanation === true}
                  onChange={(checked) => changeField('IncludeLetterOfExplanation', checked)}
                />
              </div>
            </Form.Group>

            <Form.Group as={Col} md={1} sm={2} xs={4} className={'form-field'}>
              <Form.Label>
                <span>Show Com.:</span>{' '}<ExplanationTooltip placement={'top'} description={<div>Show Comparative Page in Report</div>} />
              </Form.Label>
              <div>
                <ToggleBtn
                  on={'Yes'}
                  off={'No'}
                  size={'sm'}
                  checked={editingReportYear?.IncludeComparative === true}
                  onChange={(checked) => changeField('IncludeComparative', checked)}
                />
              </div>
            </Form.Group>

            <Form.Group as={Col} md={5} className={'form-field'}>
              <Form.Label>
                <span>Exclude area codes in comparative:</span>
              </Form.Label>
              <div>
                <LearningAreaSelector
                  showIndicator={false}
                  fileTypes={[ SYN_LEARNING_AREA_FILE_TYPE_A ]}
                  values={editingReportYear?.ComparativeExcludeCode?.split(',')}
                  allowClear={true}
                  isMulti={true}
                  onSelect={(options) => {
                    // @ts-ignore
                    changeField('ComparativeExcludeCode', Array.isArray(options) !== true || options.length <= 0 ? null : options?.map(option => option.value).join(','))
                  }}
                />
              </div>
            </Form.Group>
          </Row>

          <Row>
            <Form.Group as={Col} xs={12} className={'form-field'}>
              <Form.Label>
                <span>Letter of Explanation:</span>
              </Form.Label>
              <div>
                <RichTextEditor
                  value={editingReportYear?.LetterOfExplanation}
                  onChange={(newText) => changeField('LetterOfExplanation', newText)}
                />
              </div>
            </Form.Group>
          </Row>

          <div className={'text-right'}>
            {getBtns()}
          </div>
        </Form>
      </div>
    </Wrapper>
  )
};

export default AdminEditReportYear;
