import React from 'react';
import iStudentReportYear from '../../../../types/Synergetic/iStudentReportYear';
import {Button, Col, Form, Row } from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import FileYearSelector from '../../../../components/student/FileYearSelector';
import CampusSelector from '../../../../components/student/CampusSelector';
import YearLevelSelector from '../../../../components/student/YearLevelSelector';
import ReportStyleSelector from './ReportStyleSelector';
import styled from 'styled-components';
import ExplanationTooltip from '../../../../components/common/ExplanationTooltip';
import ToggleBtn from '../../../../components/common/ToggleBtn';
import LearningAreaSelector from '../../../../components/student/LearningAreaSelector';
import {SYN_LEARNING_AREA_FILE_TYPE_A} from '../../../../types/Synergetic/iSynLearningArea';
import RichTextEditor from '../../../../components/common/RichTextEditor';

const Wrapper = styled.div`
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
}
const AdminEditReportYear = ({reportYear, onCancel}: iAdminEditReportYear) => {

  const getTitle = () => {
    if (reportYear === null || `${reportYear.ID || ''}`.trim() === '') {
      return `Creating`
    }
    return `Editing ${reportYear.Name}`
  }

  return (
    <Wrapper>
      <h3>
        <Button variant={'link'} size={'sm'} onClick={onCancel}>
          <Icons.ArrowLeft />
        </Button>
        {getTitle()}
      </h3>
      <div className={'editing-body-wrapper'}>
        <Form>
          <Row>
            <Form.Group as={Col} md={4} className={'form-field'}>
              <Form.Label>Name <small className={'text-danger'}>*</small></Form.Label>
              <Form.Control
                placeholder={'The name of the report'}
                value={reportYear?.Name || ''}
                onChange={() => {}}
              />
            </Form.Group>

            <Form.Group as={Col} md={2} xs={5} className={'form-field'}>
              <Form.Label>Style <small className={'text-danger'}>*</small></Form.Label>
              <ReportStyleSelector
                showIndicator={false}
                value={reportYear?.styleCode}
              />
            </Form.Group>

            <Form.Group as={Col} md={1} xs={4} className={'form-field'}>
              <Form.Label>Year <small className={'text-danger'}>*</small></Form.Label>
              <FileYearSelector
                showIndicator={false}
                value={reportYear?.FileYear}
              />
            </Form.Group>

            <Form.Group as={Col} md={1} xs={3} className={'form-field'}>
              <Form.Label>Sem.: <small className={'text-danger'}>*</small></Form.Label>
              <FileYearSelector
                showIndicator={false}
                value={reportYear?.FileSemester}
              />
            </Form.Group>

            <Form.Group as={Col} md={2} xs={6} className={'form-field'}>
              <Form.Label>Campus <small className={'text-danger'}>*</small></Form.Label>
              <CampusSelector
                showIndicator={false}
                values={reportYear ? [reportYear?.CampusCode] : undefined}
              />
            </Form.Group>

            <Form.Group as={Col} md={2} xs={6} className={'form-field'}>
              <Form.Label>YearLevel</Form.Label>
              <YearLevelSelector
                showIndicator={false}
                values={reportYear ? [reportYear?.YearLevelCode] : undefined}
              />
            </Form.Group>
          </Row>

          <Row>
            <Form.Group as={Col} md={2} sm={6} className={'form-field'}>
              <Form.Label>Release to Staff Date <small className={'text-danger'}>*</small></Form.Label>
              <div>
                <ToggleBtn
                  on={'Yes'}
                  off={'No'}
                  size={'sm'}
                  checked={reportYear?.IncludeHomeGroup === true}
                  onChange={(checked) => console.log(checked)}
                />
              </div>
            </Form.Group>

            <Form.Group as={Col} md={2} sm={6} className={'form-field'}>
              <Form.Label>Release to All Date</Form.Label>
              <div>
                <ToggleBtn
                  on={'Yes'}
                  off={'No'}
                  size={'sm'}
                  checked={reportYear?.IncludeHomeGroup === true}
                  onChange={(checked) => console.log(checked)}
                />
              </div>
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
                  checked={reportYear?.IncludeHomeGroup === true}
                  onChange={(checked) => console.log(checked)}
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
                  checked={reportYear?.IncludeLetterOfExplanation === true}
                  onChange={(checked) => console.log(checked)}
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
                  checked={reportYear?.IncludeComparative === true}
                  onChange={(checked) => console.log(checked)}
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
                  allowClear={true}
                  isMulti={true}
                  onSelect={(options) => console.log(options)}
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
                <RichTextEditor value={reportYear?.LetterOfExplanation} />
              </div>
            </Form.Group>
          </Row>
        </Form>
      </div>
    </Wrapper>
  )
};

export default AdminEditReportYear;
