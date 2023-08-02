import styled from "styled-components";
import { Col, FormControl, Row } from "react-bootstrap";
import SynLuDepartmentSelector from "../SynLuDepartmentSelector";
import { useEffect, useState } from "react";
import FormLabel from "../../form/FormLabel";
import SynLuStaffCategorySelector from "../SynLuStaffCategorySelector";
import LoadingBtn from "../../common/LoadingBtn";
import * as Icons from "react-bootstrap-icons";
import ActiveFlagSelector from "../../form/ActiveFlagSelector";

const Wrapper = styled.div`
  .row {
    > * {
      padding-top: 0.5rem;
    }
  }
`;

export type iStaffListSearchCriteria = {
  SearchTxt?: string;
  ID?: number[];
  ActiveFlag?: boolean;
  CategoryCodes?: string[];
  DepartmentCodes?: string[];
};
const defaultSearchCriteria = { ActiveFlag: true };
type iStaffListSearchPanel = {
  selectedSearchCriteria?: iStaffListSearchCriteria;
  isSearching?: boolean;
  onSearch: (criteria: iStaffListSearchCriteria) => void;
  onReset: () => void;
};
const StaffListSearchPanel = ({
  isSearching = false,
  selectedSearchCriteria,
  onSearch,
  onReset
}: iStaffListSearchPanel) => {
  const [showAdvancedPanel, setShowAdvancedPanel] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState<
    iStaffListSearchCriteria
  >(defaultSearchCriteria);

  useEffect(() => {
    setSearchCriteria(Object.keys(selectedSearchCriteria || {}).length <= 0  ? defaultSearchCriteria : (selectedSearchCriteria || defaultSearchCriteria));
  }, [selectedSearchCriteria]);

  const changeSearchCriteria = (fieldName: string, newValue: any) => {
    setSearchCriteria({
      ...searchCriteria,
      [fieldName]: newValue
    });
  };

  const getAdvancedSearchPanel = () => {
    if (showAdvancedPanel !== true) {
      return null;
    }
    return (
      <Row>
        <Col md={6}>
          <FormLabel label={"Departments"} />
          <SynLuDepartmentSelector
            isMulti
            allowClear
            onSelect={values => {
              if (!values) {
                changeSearchCriteria("DepartmentCodes", []);
              }
              changeSearchCriteria(
                "DepartmentCodes",
                (Array.isArray(values) ? values : [values]).map(
                  value => value?.value
                )
              );
            }}
            values={searchCriteria.DepartmentCodes || []}
          />
        </Col>
        <Col md={6}>
          <FormLabel label={"Categories"} />
          <SynLuStaffCategorySelector
            isMulti
            allowClear
            onSelect={values => {
              if (!values) {
                changeSearchCriteria("CategoryCodes", []);
              }
              changeSearchCriteria(
                "CategoryCodes",
                (Array.isArray(values) ? values : [values]).map(
                  value => value?.value
                )
              );
            }}
            values={searchCriteria.CategoryCodes || []}
          />
        </Col>
      </Row>
    );
  };

  return (
    <Wrapper>
      <Row>
        <Col>
          <FormControl
            value={searchCriteria.SearchTxt || ""}
            onChange={value =>
              changeSearchCriteria("SearchTxt", value.target.value || "")
            }
            placeholder={"Search By Staff ID or Staff Name..."}
          />
        </Col>
        <Col sm={6} md={2} className={"active-flag-wrapper"}>
          <ActiveFlagSelector
            value={searchCriteria.ActiveFlag}
            onSelect={value =>
              changeSearchCriteria("ActiveFlag", value ? value.value : null)
            }
          />
        </Col>
        <Col sm={6} md={4} className={"text-right"}>
          <LoadingBtn
            variant={"link"}
            isLoading={isSearching}
            onClick={() => setShowAdvancedPanel(!showAdvancedPanel)}
          >
            {!showAdvancedPanel ? <Icons.ChevronDown /> : <Icons.ChevronUp />}{" "}
            Advanced
          </LoadingBtn>{" "}
          <LoadingBtn
            variant={"outline-secondary"}
            isLoading={isSearching}
            onClick={() => onReset()}
          >
            <Icons.X /> Reset
          </LoadingBtn>{" "}
          <LoadingBtn
            variant={"primary"}
            isLoading={isSearching}
            onClick={() => onSearch(searchCriteria)}
          >
            <Icons.Search /> Search
          </LoadingBtn>
        </Col>
      </Row>
      {getAdvancedSearchPanel()}
    </Wrapper>
  );
};

export default StaffListSearchPanel;
