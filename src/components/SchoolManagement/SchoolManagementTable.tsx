import styled from 'styled-components';
import ExplanationPanel from '../ExplanationPanel';
import React, {useEffect, useState} from 'react';
import {Col, FormControl, Row, Spinner, Table} from 'react-bootstrap';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/makeReduxStore';
import SchoolManagementTeamService from '../../services/Synergetic/SchoolManagementTeamService';
import Toaster from '../../services/Toaster';
import iSchoolManagementTeam from '../../types/Synergetic/iSchoolManagementTeam';
import FileYearSelector from '../student/FileYearSelector';
import FormLabel from '../form/FormLabel';
import FileSemesterSelector from '../student/FileSemesterSelector';
import moment from 'moment-timezone';
import SchoolManagementRoleSelector, {schoolManagementRoleMap} from './SchoolManagementRoleSelector';
import {OP_LIKE} from '../../helper/ServiceHelper';
import LoadingBtn from '../common/LoadingBtn';
import * as Icons from 'react-bootstrap-icons';
import MathHelper from '../../helper/MathHelper';
import iSynCommunity from '../../types/Synergetic/iSynCommunity';
import DeleteConfirmPopupBtn from '../common/DeleteConfirm/DeleteConfirmPopupBtn';
import SchoolManagementEditPopupBtn from './SchoolManagementEditPopupBtn';

const Wrapper = styled.div`
  .search-panel {
    margin-bottom: 1rem;
    
    .search-btn {
      width: 100%;
    }
  }
  
  .team-table {
    .col.btns {
      width: 130px;
    }
  }
`

// type iSchoolManagementTable = {}
const SchoolManagementTable = () => {
  const {user} = useSelector((state: RootState) => state.auth);
  const [selectedFileYear, setSelectedFileYear] = useState(user?.SynCurrentFileSemester?.FileYear || moment().year())
  const [selectedFileSemester, setSelectedFileSemester] = useState(user?.SynCurrentFileSemester?.FileSemester || 1)
  const [selectedRoleCodes, setSelectedRoleCodes] = useState<string[]>([])
  const [searchingText, setSearchingText] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [schoolManageTeams, setSchoolManageTeams] = useState<iSchoolManagementTeam[]>([]);
  const [count, setCount] = useState(0);


  useEffect(() => {
    if (`${selectedFileYear || ''}`.trim() === '' || `${selectedFileSemester || ''}`.trim() === '') {
      return;
    }

    let isCanceled = false;
    setIsLoading(true);
    SchoolManagementTeamService.getSchoolManagementTeams({
        where: JSON.stringify({
          FileYear: selectedFileYear,
          FileSemester: selectedFileSemester,
          ...(selectedRoleCodes.length <= 0 ? {} : {SchoolRoleCode: selectedRoleCodes}),
          ...(`${searchingText || ''}`.trim() === '' ? {} : {Comments: {[OP_LIKE]: `%${searchingText || ''}%`}}),
        }),
        include: 'SynSSTStaff,SynActingStaff1,SynActingStaff2,SynCreatedBy,SynModifiedBy',
      })
      .then(resp => {
        if (isCanceled) { return }
        setSchoolManageTeams(resp);
      })
      .catch(err => {
        if (isCanceled) { return }
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) { return }
        setIsLoading(false);
      })
  }, [selectedFileYear, selectedFileSemester, selectedRoleCodes, searchingText, count])

  const getStaffDetailsCell = (staff?: iSynCommunity) => {
    if (!staff) {
      return null;
    }
    return <>({staff.ID}) {staff?.Title} {staff?.Given1} {staff?.Surname}</>
  }

  const getContent = () => {
    if (isLoading === true) {
      return <Spinner animation={'border'} />
    }
    return (
      <Table striped hover className={'team-table'}>
        <thead>
          <tr>
            <th>Year - Sem</th>
            <th>Staff</th>
            <th>Role</th>
            <th>YearLevel</th>
            <th>Comments</th>
            <th>Acting 1</th>
            <th>Acting 2</th>
            <th className={'col btns'}>
              <SchoolManagementEditPopupBtn
                onSaved={() => setCount(MathHelper.add(count, 1))}
                variant={'success'}
                size={'sm'}>
                <Icons.Plus />{' '} New
              </SchoolManagementEditPopupBtn>
            </th>
          </tr>
        </thead>
        <tbody>
          {schoolManageTeams.map(team => {
            return (
              <tr key={team.SchoolSeniorTeamID}>
                <td>
                  <SchoolManagementEditPopupBtn
                    title={'Edit'}
                    onSaved={() => setCount(MathHelper.add(count, 1))}
                    schoolManagementTeam={team}
                    variant={'link'}
                    size={'sm'}>
                    {team.FileYear} - {team.FileSemester}
                  </SchoolManagementEditPopupBtn>
                </td>
                <td>{getStaffDetailsCell(team.SynSSTStaff)}</td>
                <td>{team.SchoolRoleCode} - {team.SchoolRoleCode in schoolManagementRoleMap ? schoolManagementRoleMap[team.SchoolRoleCode] : ''}</td>
                <td>{team.YearLevelCode}</td>
                <td>{team.Comments}</td>
                <td>{getStaffDetailsCell(team.SynActingStaff1)}</td>
                <td>{getStaffDetailsCell(team.SynActingStaff2)}</td>
                <td className={'col btns'}>
                  <SchoolManagementEditPopupBtn
                    title={'Clone'}
                    onSaved={() => setCount(MathHelper.add(count, 1))}
                    schoolManagementTeam={{
                      ...team,
                      // @ts-ignore
                      SchoolSeniorTeamID: undefined,
                      // @ts-ignore
                      FileYear: undefined,
                      // @ts-ignore
                      FileSemester: undefined,
                    }}
                    variant={'outline-secondary'}
                    size={'sm'}>
                    <Icons.Files />{' '} Clone
                  </SchoolManagementEditPopupBtn>
                  {' '}
                  <DeleteConfirmPopupBtn
                    deletingFn={() => SchoolManagementTeamService.remove(team.SchoolSeniorTeamID)}
                    deletedCallbackFn={() => setCount(MathHelper.add(count, 1))}
                    confirmString={`${team.SchoolSeniorTeamID}`}
                    variant={'outline-danger'}
                    size={'sm'}
                  >
                    <Icons.Trash />
                  </DeleteConfirmPopupBtn>
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    )
  }

  const search = (event: any) => {
    if (event.key === 'Enter') {
      return setSearchingText(event.target.value);
    }
    return true;
  }

  return (
    <Wrapper>
      <ExplanationPanel text={
        <>
          This a UI for managing the <b>uluSchoolManagementTeam</b>.
          <p>Changing information below will affect: Student absence notification / Student Reports</p>
          <p><b>The system run every night to check whether the current Semester is the same with the latest record in uluSchoolManagementTeam. If not, it will copy the latest records to the current Semester</b></p>
        </>
      } />
      <Row className={'search-panel'}>
        <Col sm={2}>
          <FormLabel label={'File Year'} />
          <FileYearSelector
            isDisabled={isLoading === true}
            value={selectedFileYear}
            onSelect={(fileYear) => setSelectedFileYear(fileYear || moment().year())}
          />
        </Col>
        <Col sm={2}>
          <FormLabel label={'File Semester'} />
          <FileSemesterSelector
            isDisabled={isLoading === true}
            value={selectedFileSemester}
            onSelect={(fileSemester) => setSelectedFileSemester(fileSemester || 1)}
            semesters={[1, 2, 3, 4]}
          />
        </Col>
        <Col sm={4}>
          <FormLabel label={'Role'} />
          <SchoolManagementRoleSelector
            isDisabled={isLoading === true}
            isMulti
            values={selectedRoleCodes || []}
            onSelect={(values) => setSelectedRoleCodes((values === null ? [] : Array.isArray(values) ? values : [values]).map(value => `${value.value}`))}
            allowClear
          />
        </Col>
        <Col sm={3}>
          <FormLabel label={'Comments'} />
          <FormControl
            disabled={isLoading === true}
            placeholder={`search any comments...`}
            defaultValue={searchingText}
            onKeyUp={(event) => search(event)}
            onBlur={(event) => setSearchingText(event.target.value)}
          />
        </Col>
        <Col sm={1}>
          <div dangerouslySetInnerHTML={{__html: '&nbsp;'}} />
          <LoadingBtn isLoading={isLoading} className={'search-btn'} onClick={() => setCount(MathHelper.add(count, 1))}>
            <Icons.Search />
          </LoadingBtn>
        </Col>
      </Row>

      {getContent()}
    </Wrapper>
  )
}

export default SchoolManagementTable;
