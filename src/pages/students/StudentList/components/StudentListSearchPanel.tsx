import styled from "styled-components";
import { Col, FormControl, Row } from "react-bootstrap";
import ActiveFlagSelector from "../../../../components/form/ActiveFlagSelector";
import { useState } from "react";
import LoadingBtn from "../../../../components/common/LoadingBtn";
import * as Icons from "react-bootstrap-icons";
import MathHelper from "../../../../helper/MathHelper";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/makeReduxStore";
import moment from "moment-timezone";
import FileSemesterSelector from "../../../../components/student/FileSemesterSelector";
import FileYearSelector from "../../../../components/student/FileYearSelector";
import { FlexContainer } from "../../../../styles";
import FormLabel from '../../../../components/form/FormLabel';
import SynFormSelector from '../../../../components/student/SynFormSelector';
import YearLevelSelector from '../../../../components/student/YearLevelSelector';
import FlagSelector from '../../../../components/form/FlagSelector';
import SynCampusSelector from '../../../../components/student/SynCampusSelector';

const Wrapper = styled.div`
  .row {
    > * {
      padding-top: 0.5rem;
      padding-left: 5px;
      padding-right: 5px;
    }
  }
`;

export type iStudentListSearchCriteria = {
  searchTxt?: string;
  count?: number;
  FileYear?: number;
  FileSemester?: number;
  StudentActiveFlag?: boolean;
  StudentIsPastFlag?: boolean;
  StudentForm?: string[];
  StudentCampus?: string[];
  StudentYearLevel?: (string)[];
};
type iStudentListSearchPanel = {
  className?: string;
  isLoading?: boolean;
  onSearch: (searchCriteria: iStudentListSearchCriteria) => void;
};
const StudentListSearchPanel = ({
  onSearch,
  className,
  isLoading
}: iStudentListSearchPanel) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [criteria, setCriteria] = useState<iStudentListSearchCriteria>({
    count: 0,
    StudentActiveFlag: true,
    FileYear: user?.SynCurrentFileSemester?.FileYear || moment().year(),
    FileSemester: user?.SynCurrentFileSemester?.FileSemester || 1
  });
  const [showingAdvancedPanel, setShowingAdvancedPanel] = useState(false);

  const changeSearchCriteria = (fieldName: string, newValue: any) => {
    setCriteria({
      ...criteria,
      [fieldName]: newValue
    });
  };

  const getAdvancedPanel = () => {
    if (showingAdvancedPanel !== true) {
      return null;
    }
    return (
      <Row>
        <Col md={4} sm={6}>
          <FormLabel label={'Form'} />
          <SynFormSelector
            allowClear
            isMulti
            values={criteria?.StudentForm || []}
            onSelect={(options) => {
              // @ts-ignore
              changeSearchCriteria("StudentForm", (options || []).length <= 0 ? undefined : (options || []).map(option => option.value))
            }}
          />
        </Col>
        <Col md={3} sm={6}>
          <FormLabel label={'Campus'} />
          <SynCampusSelector
            allowClear
            isMulti
            values={criteria?.StudentCampus || []}
            onSelect={(options) => {
              // @ts-ignore
              changeSearchCriteria("StudentCampus", (options || []).length <= 0 ? undefined : (options || []).map(option => option.value))
            }}
          />
        </Col>
        <Col md={3} sm={6}>
          <FormLabel label={'Year Lvl.'} />
          <YearLevelSelector
            allowClear
            isMulti
            values={criteria?.StudentYearLevel || []}
            onSelect={(options) => {
              // @ts-ignore
              changeSearchCriteria("StudentYearLevel", (options || []).length <= 0 ? undefined : (options || []).map(option => option.value))
            }}
          />
        </Col>
        <Col md={2} sm={6}>
          <FormLabel label={'Show Past Stud.'} />
          <FlagSelector
            value={criteria?.StudentIsPastFlag}
            onSelect={value =>
              changeSearchCriteria(
                "StudentIsPastFlag",
                value ? value.value : undefined
              )
            }
          />
        </Col>
      </Row>
    )
  }

  return (
    <Wrapper className={className}>
      <Row>
        <Col md={7} sm={12}>
          <FormControl
            placeholder={"search student by name or ID..."}
            value={criteria.searchTxt || ''}
            onChange={event =>
              changeSearchCriteria("searchTxt", event.target.value)
            }
          />
        </Col>
        <Col md={1} sm={4} xs={6}>
          <ActiveFlagSelector
            showIndicatorSeparator={false}
            value={criteria.StudentActiveFlag || true}
            onSelect={value =>
              changeSearchCriteria(
                "StudentActiveFlag",
                value ? value.value : undefined
              )
            }
          />
        </Col>
        <Col md={2} sm={4} xs={6}>
          <FlexContainer className={"with-gap"}>
            <FileYearSelector
              showIndicatorSeparator={false}
              value={criteria.FileYear}
              max={MathHelper.add(user?.SynCurrentFileSemester?.FileYear || moment().year(), 1)}
              onSelect={year => changeSearchCriteria("FileYear", year)}
            />
            <FileSemesterSelector
              showIndicatorSeparator={false}
              value={criteria.FileSemester}
              onSelect={term => changeSearchCriteria("FileSemester", term)}
              semesters={[1, 2, 3, 4, 5]}
            />
          </FlexContainer>
        </Col>
        <Col md={2} sm={4} className={"text-right"}>
          <LoadingBtn variant={'link'} onClick={() => setShowingAdvancedPanel(!showingAdvancedPanel)}>
            {!showingAdvancedPanel ? <Icons.ChevronDown /> : <Icons.ChevronUp />} Adv.
          </LoadingBtn>
          <LoadingBtn
            onClick={() =>
              onSearch({
                ...criteria,
                count: MathHelper.add(criteria.count || 0, 1)
              })
            }
            isLoading={isLoading}
          >
            <Icons.Search /> Search
          </LoadingBtn>
        </Col>
      </Row>
      {getAdvancedPanel()}
    </Wrapper>
  );
};

export default StudentListSearchPanel;
