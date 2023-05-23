import styled from 'styled-components';
import {Col, Container, Row} from 'react-bootstrap';
import FormLabel from '../../../components/form/FormLabel';
import Form from 'react-bootstrap/Form';
import {useEffect, useState} from 'react';
import UtilsService from '../../../services/UtilsService';
import SynSubjectClassSelector from '../../../components/student/SynSubjectClassSelector';
import LoadingBtn from '../../../components/common/LoadingBtn';
import * as Icons from 'react-bootstrap-icons';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/makeReduxStore';
import SynVStudentClassService from '../../../services/Synergetic/SynVStudentClassService';
import Toaster from '../../../services/Toaster';
import moment from 'moment-timezone';
import * as _ from 'lodash';
import {HEADER_NAME_SELECTING_FIELDS} from '../../../services/AppService';

export type iSearchCriteria = {
  searchText: string;
  classCodes: string[];
}



type iStudentListSearchPanel = {
  preSelectedClassCodes?: string[];
  isLoading: boolean;
  onSearch?: (criteria: iSearchCriteria) => void;
}

const Wrapper = styled.div`
  .btns {
    padding-left: 0px;
    padding-right: 0px;
  }
`;
const StudentListSearchPanel = ({isLoading = false, preSelectedClassCodes = [], onSearch}: iStudentListSearchPanel) => {
  const initialSearchCriteria: iSearchCriteria = {
    searchText: '',
    classCodes: preSelectedClassCodes,
  }
  const [searchCriteria, setSearchCriteria] = useState<iSearchCriteria>(initialSearchCriteria);
  const {user} = useSelector((state: RootState) => state.auth);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsSearching(true);
    SynVStudentClassService.getAll({
        where: JSON.stringify({
          StaffID: user?.synergyId || 0,
          FileYear: (user?.SynCurrentFileSemester?.FileYear || moment().year()),
          FileSemester: (user?.SynCurrentFileSemester?.FileSemester || 1),
        }),
        perPage: '9999'
      }, {
        headers: { [HEADER_NAME_SELECTING_FIELDS]: JSON.stringify(['ClassCode'])}
      }).then(resp => {
          setSearchCriteria((searchCriteria) => ({
            ...searchCriteria,
            classCodes: _.uniq(resp.data.map(studentClass => studentClass.ClassCode))
          }));
        }).catch((err: any) => {
          Toaster.showApiError(err);
        }).finally(() => {
          setIsSearching(false);
        })
  }, [user?.synergyId, user?.SynCurrentFileSemester?.FileYear, user?.SynCurrentFileSemester?.FileSemester])


  return (
    <Wrapper>
      <Row>
        <Col sm={2}>
          <FormLabel label={' '} />
          <Form.Control
            placeholder="Student name or homeroom (e.g. 'Amanda', '9C')" value={searchCriteria.searchText}
            onChange={(event) => setSearchCriteria({
              ...searchCriteria,
              searchText: event.target.value,
            })}
            onKeyUp={(event) => UtilsService.handleEnterKeyPressed(event, () => onSearch && onSearch(searchCriteria))}
          />
        </Col>
        <Col sm={9}>
          <FormLabel label={'Classes'} />
          <SynSubjectClassSelector
            pageSize={9999}
            FileYear={user?.SynCurrentFileSemester?.FileYear || moment().year()}
            FileSemester={user?.SynCurrentFileSemester?.FileSemester || 1}
            values={searchCriteria.classCodes}
            isMulti
            allowClear
            onSelect={(values) => setSearchCriteria({
              ...searchCriteria,
              classCodes: (values === null ? [] : Array.isArray(values) ? values : [values]).map(value => `${value.value}`),
            })}
          />
        </Col>
        <Col sm={1} className={'btns'}>
          <FormLabel label={' '} />
          <div className={'text-right'}>
            <LoadingBtn
              isLoading={isLoading || isSearching}
              variant={'primary'}
              icon={<Icons.Search />}
              onClick={() => onSearch && onSearch(searchCriteria)}>
              Search
            </LoadingBtn>
          </div>
        </Col>
      </Row>
    </Wrapper>
  );
}

export default StudentListSearchPanel;
