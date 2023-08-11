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

const Wrapper = styled.div``;

export type iStudentListSearchCriteria = {
  searchTxt?: string;
  count?: number;
  FileYear?: number;
  FileSemester?: number;
  StudentActiveFlag?: boolean;
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
    StudentActiveFlag: true,
    count: 0,
    FileYear: user?.SynCurrentFileSemester?.FileYear || moment().year(),
    FileSemester: user?.SynCurrentFileSemester?.FileSemester || 1
  });

  const changeSearchCriteria = (fieldName: string, newValue: any) => {
    if (newValue === undefined) {
      // @ts-ignore
      delete criteria[fieldName];
      setCriteria(criteria);
      return;
    }

    setCriteria({
      ...criteria,
      [fieldName]: newValue
    });
  };

  return (
    <Wrapper className={className}>
      <Row>
        <Col>
          <FormControl
            placeholder={"search student by name or ID..."}
            value={criteria.searchTxt || ''}
            onChange={event =>
              changeSearchCriteria("searchTxt", event.target.value)
            }
          />
        </Col>
        <Col md={2}>
          <FlexContainer className={"with-gap"}>
            <FileYearSelector
              showIndicatorSeparator={false}
              value={criteria.FileYear}
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
        <Col md={2}>
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
        <Col md={2} className={"text-right"}>
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
    </Wrapper>
  );
};

export default StudentListSearchPanel;
