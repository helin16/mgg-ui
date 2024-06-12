import React, {ChangeEvent, useEffect, useState} from 'react';
import iStudentReportYear, {getDataForClone} from '../../../../types/Synergetic/Student/iStudentReportYear';
import {Button, Col, Form, Row, Spinner, Table} from 'react-bootstrap';
import styled from 'styled-components';
import StudentReportService from '../../../../services/Synergetic/Student/StudentReportService';
import EmptyState from '../../../../components/common/EmptyState';
import moment from 'moment-timezone';
import * as _ from 'lodash';
import * as Icons from 'react-bootstrap-icons';
import DeleteConfirmPopupBtn from '../../../../components/common/DeleteConfirm/DeleteConfirmPopupBtn';
import FileYearSelector from '../../../../components/student/FileYearSelector';
import FileSemesterSelector from '../../../../components/student/FileSemesterSelector';
import SynCampusSelector, {translateCampusToOption} from '../../../../components/student/SynCampusSelector';
import YearLevelSelector, {translateYearLevelToOption} from '../../../../components/student/YearLevelSelector';
import ISynLuCampus, {CAMPUS_CODE_ELC, CAMPUS_CODE_JUNIOR, CAMPUS_CODE_SENIOR} from '../../../../types/Synergetic/Lookup/iSynLuCampus';
import ISynLuYearLevel from '../../../../types/Synergetic/Lookup/iSynLuYearLevel';
import ReportStyleSelector, {translateReportStyleToOption} from './ReportStyleSelector';
import iStudentReportStyle from '../../../../types/Synergetic/Student/iStudentReportStyle';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../redux/makeReduxStore';

const Wrapper = styled.div`
  .result-wrapper {
    margin-top: 18px;
  }
`
type iQuery = {
  name?: string;
  campus?: ISynLuCampus;
  yearLevel?: ISynLuYearLevel;
  style?: iStudentReportStyle;
  fileYear?: number;
  fileSemester?: number;
}
type iAdminReportList = {
  onSelected: (report: any) => void;
};
const AdminReportList = ({ onSelected }: iAdminReportList) => {
  const [isLoading, setIsLoading] = useState(false);
  const [reportList, setReportList] = useState<iStudentReportYear[]>([]);
  const [query, setQuery] = useState<iQuery>({});
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setIsLoading(true);
    StudentReportService.getStudentReportYears({
        where: JSON.stringify({
          Active: true,
        })
      })
      .then(resp => {
        const results = _.sortBy(resp, (obj) => [obj.FileYear, obj.FileSemester, obj.Name])
          .reverse();
        setReportList(results);
        if (results.length > 0) {
          setQuery((q) => ({
            ...q,
            fileYear: Number(results[0].FileYear),
            fileSemester: Number(results[0].FileSemester),
          }));
        }
      })
      .finally(() => {
        setIsLoading(false);
      })
  }, []);

  const onChangeFilter = (value: string | number | null, fieldName: string) => {
    if (value === null) {
      // @ts-ignore
      delete query[fieldName];
      setQuery({...query});
      return;
    }
    setQuery({
      ...query,
      [fieldName]: value,
    })
  }

  const getFilteredResult = () => {
    if (Object.values(query).length <= 0) {
      return [];
    }
    return reportList
      .filter(report => {
        let foundName = true;
        let foundCampus = true;
        let foundYearLevel = true;
        let foundStyle = true;
        let foundFileYear = true;
        let foundFileSemester = true;
        if(`${query.name || ''}`.trim() !== '') {
          foundName = report.Name.toLowerCase().includes(`${query.name || ''}`.toLowerCase());
        }
        if(query.campus) {
          foundCampus = report.CampusCode.trim().toLowerCase() === `${query.campus?.Code}`.trim().toLowerCase();
        }
        if(query.yearLevel) {
          foundYearLevel = `${report.YearLevelCode || ''}`.trim().toLowerCase() === `${query.yearLevel?.Code}`.trim().toLowerCase();
        }
        if(query.style) {
          foundStyle = `${report.styleCode || ''}`.trim().toLowerCase() === `${query.style.code || ''}`.trim().toLowerCase();
        }
        if(`${query.fileYear || ''}`.trim() !== '') {
          foundFileYear = `${report.FileYear}`.trim() === `${query.fileYear}`.trim();
        }
        if(`${query.fileSemester || ''}`.trim() !== '') {
          foundFileSemester = `${report.FileSemester}`.trim() === `${query.fileSemester || ''}`.trim();
        }
        return foundName && foundCampus && foundYearLevel && foundStyle && foundFileYear && foundFileSemester;
      })
  }

  const getDeleteReportFn = (report: iStudentReportYear) => {
    return StudentReportService.deleteStudentReportYear(report.ID || '')
      .then(resp => {
        if (resp.Active === false) {
          setReportList(reportList.filter(res => res.ID !== report.ID));
        }
      });
  }

  const getResultTable = () => {
    if (isLoading === true) {
      return <Spinner animation={'border'} />
    }

    if (reportList.length <= 0) {
      return <EmptyState
        title={'Sorry, no reports found'}
        hideLogo={true}
      />
    }

    return (
      <Table striped hover className={'list-table'} responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Semester</th>
            <th>Style</th>
            <th>Campus</th>
            <th>Year Level</th>
            <th>Release To Staff</th>
            <th>Release To All</th>
            <th className={'text-right'}>
              <Button variant={'success'} size={'sm'} className={'flexbox-inline flexbox-align-items-center'} onClick={() => onSelected(null)}>
                <Icons.PlusLg />
                <span className={'d-none d-lg-block'}> New</span>
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {getFilteredResult().map(report => {
            return (
             <tr key={report.ID}>
               <td><Button variant={'link'} size={'sm'} onClick={() => onSelected(report)}>{report.Name}</Button></td>
               <td>{report.FileYear}-{report.FileSemester}</td>
               <td>{report.styleCode}</td>
               <td>{report.CampusCode}</td>
               <td>{report.YearLevelCode}</td>
               <td>{moment(report.ReleaseToStaffDate).format('lll')}</td>
               <td>{report.ReleaseToAllDate && moment(report.ReleaseToAllDate).format('lll')}</td>
               <td className={'text-right'}>
                 <Button
                   variant={'secondary'}
                   title={'clone'}
                   size={'sm'}
                   className={'flexbox-inline flexbox-align-items-center'}
                   onClick={() => onSelected(getDataForClone(report, user?.SynCurrentFileSemester))}
                   >
                   <Icons.Files />
                   <span className={'d-none d-lg-block'}> Clone</span>
                 </Button> {' '}
                 <DeleteConfirmPopupBtn
                   title={'Delete'}
                   className={'flexbox-inline flexbox-align-items-center'}
                   deletingFn={() => getDeleteReportFn(report)} confirmString={`${report.ID}`}
                   size={'sm'}
                   description={<>Are you sure you want to delete <b>{report.Name}</b>? </>}
                   variant={'danger'}>
                   <Icons.Trash />
                   <span className={'d-none d-lg-block'}> Delete</span>
                 </DeleteConfirmPopupBtn>
               </td>
             </tr>
            )
          })}
        </tbody>
      </Table>
    );
  }

  return (
    <Wrapper>
      <div className={'search-panel'}>
        <Form>
          <Row>
            <Form.Group as={Col} md={4} sm={4}>
              <Form.Label>Name:</Form.Label>
              <Form.Control placeholder={'Name of the report'} onChange={(event: ChangeEvent<HTMLInputElement>) => onChangeFilter(event.target.value, 'name')}/>
            </Form.Group>

            <Form.Group as={Col} md={2} sm={4} xs={6}>
              <Form.Label>Campus:</Form.Label>
              <div>
                <SynCampusSelector
                  allowClear={true}
                  showIndicator={false}
                  values={query.campus ? [translateCampusToOption(query.campus)] : undefined}
                  onSelect={(option) => onChangeFilter(option === null ? null : (Array.isArray(option) ? option[0].data : option.data), 'campus')}
                />
              </div>
            </Form.Group>

            <Form.Group as={Col} md={2} sm={4} xs={6}>
              <Form.Label>Year Level:</Form.Label>
              <div>
                <YearLevelSelector
                  allowClear={true}
                  showIndicator={false}
                  campusCodes={[
                    CAMPUS_CODE_ELC,
                    CAMPUS_CODE_JUNIOR,
                    CAMPUS_CODE_SENIOR,
                  ]}
                  values={query.yearLevel ? [translateYearLevelToOption(query.yearLevel)] : undefined}
                  onSelect={(option) => onChangeFilter(option === null ? null : (Array.isArray(option) ? option[0].data : option.data), 'yearLevel')}
                />
              </div>
            </Form.Group>

            <Form.Group as={Col} md={2} sm={4} xs={4}>
              <Form.Label>Style:</Form.Label>
              <div>
                <ReportStyleSelector
                  allowClear={true}
                  showIndicator={false}
                  values={query.style ? [translateReportStyleToOption(query.style)] : undefined}
                  onSelect={(style) => onChangeFilter(style === null ? null : style.data, 'style')}
                />
              </div>
            </Form.Group>

            <Form.Group as={Col} md={1} sm={4} xs={4}>
              <Form.Label>Year:</Form.Label>
              <div>
                <FileYearSelector
                  allowClear={true}
                  showIndicator={false}
                  value={query.fileYear}
                  onSelect={(year) => onChangeFilter(year === null ? null : year, 'fileYear')}
                />
              </div>
            </Form.Group>

            <Form.Group as={Col} md={1} sm={4} xs={4}>
              <Form.Label>Semester:</Form.Label>
              <div>
                <FileSemesterSelector
                  allowClear={true}
                  showIndicator={false}
                  value={query.fileSemester}
                  onSelect={(semester) => onChangeFilter(semester === null ? null : semester, 'fileSemester')}
                />
              </div>
            </Form.Group>

          </Row>
        </Form>
      </div>
      <div className={'result-wrapper'}>
        {getResultTable()}
      </div>
    </Wrapper>
  )
};

export default AdminReportList;
