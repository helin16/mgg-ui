import styled from 'styled-components';
import {Button, Col, Collapse, Container, Row} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormLabel from '../../../components/form/FormLabel';
import * as Icons from 'react-bootstrap-icons';
import {useState} from 'react';
import SynCampusSelector from '../../../components/student/SynCampusSelector';
import LoadingBtn from '../../../components/common/LoadingBtn';
import YearLevelSelector from '../../../components/student/YearLevelSelector';
import SynMedicalConditionTypeSelector from '../../../components/medical/SynMedicalConditionTypeSelector';
import SynMedicalConditionSeveritySelector from '../../../components/medical/SynMedicalConditionSeveritySelector';
import SynSubjectClassSelector from '../../../components/student/SynSubjectClassSelector';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/makeReduxStore';
import moment from 'moment-timezone';



const Wrapper = styled.div`
  .search-btn-wrapper {
    display: flex;
    align-items: flex-end;
  }
`;

export type iSearchState = {
  searchText: string;
  campuses: string[];
  yearLevels: string[];
  conditionTypes: string[];
  conditionSeverities: string[];
  classCodes: string[];
}
const initialSearchState: iSearchState = {
  searchText: '',
  campuses: [],
  yearLevels: [],
  conditionTypes: [],
  conditionSeverities: [],
  classCodes: [],
}

type iState = {
  isSearching?: boolean;
  onSearch?: (criteria: iSearchState) => void;
  onClear?: () => void;
}
const MedicalReportSearchPanel = ({onSearch, onClear, isSearching = false}: iState) => {
  const {user} = useSelector((state: RootState) => state.auth);
  const [isShowingAdvanced, setIsShowingAdvanced] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState<iSearchState>(initialSearchState);

  const getAdvancedPanel = () => {
    if (!isShowingAdvanced) {
      return null;
    }
    return (
      <Collapse in={isShowingAdvanced}>
        <Row>
          <Col sm={6} md={3}>
            <FormLabel label={'Risk Levels'} />
            <SynMedicalConditionSeveritySelector
              isMulti
              allowClear
              values={searchCriteria.conditionSeverities || []}
              onSelect={(values) => setSearchCriteria({
                ...searchCriteria,
                conditionSeverities: (values === null ? [] : Array.isArray(values) ? values : [values]).map(value => `${value.value}`),
              })}
            />
          </Col>
          <Col sm={6} md={3}>
            <FormLabel label={'Conditions'} />
            <SynMedicalConditionTypeSelector
              isMulti
              allowClear
              values={searchCriteria.conditionTypes || []}
              onSelect={(values) => setSearchCriteria({
                  ...searchCriteria,
                  conditionTypes: (values === null ? [] : Array.isArray(values) ? values : [values]).map(value => `${value.value}`),
                })}
            />
          </Col>
          <Col sm={6} md={3}>
            <FormLabel label={'Campuses'} />
            <SynCampusSelector
              allowClear
              isMulti
              values={searchCriteria.campuses || []}
              onSelect={(values) => setSearchCriteria({
                ...searchCriteria,
                campuses: (values === null ? [] : Array.isArray(values) ? values : [values]).map(value => `${value.value}`),
              })}
            />
          </Col>
          <Col sm={6} md={3}>
            <FormLabel label={'Year Levels'} />
            <YearLevelSelector
              allowClear
              isMulti
              values={searchCriteria.yearLevels || []}
              onSelect={(values) => setSearchCriteria({
                ...searchCriteria,
                yearLevels: (values === null ? [] : Array.isArray(values) ? values : [values]).map(value => `${value.value}`),
              })}
            />
          </Col>
        </Row>
      </Collapse>
    )
  }

  const handleSearchKeyPressed = (event: any) => {
    if (event.key === 'Enter') {
      return onSearch && onSearch(searchCriteria);
    }
    return true;
  }

  return (
    <Wrapper>
      <Container fluid>
        <Row>
          <Col sm={6}>
            <FormLabel label={' '} />
            <Form.Control
              placeholder="Name of student or homeroom (e.g. 'Amanda', '9C')" value={searchCriteria.searchText}
              onChange={(event) => setSearchCriteria({
                ...searchCriteria,
                searchText: event.target.value,
              })}
              onKeyUp={(event) => handleSearchKeyPressed(event)}
            />
          </Col>
          <Col sm={4}>
            <FormLabel label={'Classes'} />
            <SynSubjectClassSelector
              FileYear={user?.SynCurrentFileSemester?.FileYear || moment().year()}
              FileSemester={user?.SynCurrentFileSemester?.FileSemester || 1}
              isMulti
              allowClear
              showIndicator
              pageSize={9999}
              values={searchCriteria.classCodes || []}
              onSelect={(values) => setSearchCriteria({
                ...searchCriteria,
                classCodes: (values === null ? [] : Array.isArray(values) ? values : [values]).map(value => `${value.value}`),
              })}
            />
          </Col>
          <Col sm={2}>
            <FormLabel label={' '} />
            <div className={'search-btn-wrapper'}>
              <LoadingBtn variant={'link'} size={'sm'} isLoading={isSearching} onClick={() => {
                setSearchCriteria(initialSearchState);
                if (onClear) {
                  onClear();
                }
              }}>
                <Icons.X />Clear
              </LoadingBtn>
              <LoadingBtn variant={'primary'} size={'sm'} isLoading={isSearching} onClick={() => onSearch && onSearch(searchCriteria)}>
                <Icons.Search /> Search
              </LoadingBtn>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Button variant={'link'} className={'text-muted'} size={'sm'} onClick={() => setIsShowingAdvanced(!isShowingAdvanced)}>
              Advanced {isShowingAdvanced === true ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
            </Button>
          </Col>
        </Row>
        {getAdvancedPanel()}
      </Container>
    </Wrapper>
  )
}


export default MedicalReportSearchPanel;
