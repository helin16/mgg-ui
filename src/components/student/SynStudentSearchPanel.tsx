import styled from "styled-components";
import { Col, Form, FormControl, InputGroup, Row } from "react-bootstrap";
import LoadingBtn from "../common/LoadingBtn";
import { Search } from "react-bootstrap-icons";
import React, { useEffect, useState } from "react";
import iVStudent from "../../types/Synergetic/Student/iVStudent";
import SynVStudentService from "../../services/Synergetic/Student/SynVStudentService";
import Toaster from "../../services/Toaster";
import EmptyState from "../common/EmptyState";
import PanelTitle from "../PanelTitle";
import FileYearSelector from "./FileYearSelector";
import FileSemesterSelector from "./FileSemesterSelector";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/makeReduxStore";
import moment from "moment-timezone";
import YearLevelSelector from "./YearLevelSelector";
import LuFormSelector from "./SynFormSelector";
import { OP_LIKE, OP_OR } from "../../helper/ServiceHelper";
import UtilsService from "../../services/UtilsService";

const Wrapper = styled.div`
  .row {
    > div {
      padding-left: 0px;
    }
  }
`;

type iSynStudentSearchPanel = {
  onRowRender: (student: iVStudent) => any;
  showAdvancedSearch?: boolean;
  label?: any;
};

const SynStudentSearchPanel = ({
  label,
  onRowRender,
  showAdvancedSearch = false
}: iSynStudentSearchPanel) => {
  const [searchTxt, setSearchTxt] = useState("");
  const [searchFileYear, setSearchFileYear] = useState<number | undefined>(
    undefined
  );
  const [searchFileSemester, setSearchFileSemester] = useState<
    number | undefined
  >(undefined);
  const [searchYearLevel, setSearchYearLevel] = useState<string | undefined>(
    undefined
  );
  const [searchForm, setSearchForm] = useState<string | undefined>(undefined);
  const [isSearching, setIsSearching] = useState(false);
  const [students, setStudents] = useState<iVStudent[] | undefined>(undefined);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setSearchFileYear(
      user?.SynCurrentFileSemester?.FileYear || moment().year()
    );
    setSearchFileSemester(user?.SynCurrentFileSemester?.FileSemester || 1);
  }, [user, user?.SynCurrentFileSemester]);

  const onSearch = () => {
    setIsSearching(true);

    const searchTxtObj =
      `${searchTxt || ""}`.trim() === ""
        ? {}
        : UtilsService.isNumeric(`${searchTxt || ""}`.trim())
        ? {StudentID: `${searchTxt || ""}`.trim()}
        : {
            [OP_OR]: [
              { StudentForm: { [OP_LIKE]: `%${searchTxt}%` } },
              { StudentGiven1: { [OP_LIKE]: `%${searchTxt}%` } },
              { StudentPreferred: { [OP_LIKE]: `%${searchTxt}%` } },
              { StudentSurname: { [OP_LIKE]: `%${searchTxt}%` } },
              { StudentNameExternal: { [OP_LIKE]: `%${searchTxt}%` } },
              { StudentNameInternal: { [OP_LIKE]: `%${searchTxt}%` } }
            ]
          };

    SynVStudentService.getVStudentAll({
      where: JSON.stringify({
        ...searchTxtObj,
        ...(`${searchFileYear || ""}`.trim() === ""
          ? {}
          : { FileYear: `${searchFileYear}` }),
        ...(`${searchFileSemester || ""}`.trim() === ""
          ? {}
          : { FileSemester: `${searchFileSemester}` }),
        ...(`${searchYearLevel || ""}`.trim() === ""
          ? {}
          : { StudentYearLevel: `${searchYearLevel}` }),
        ...(`${searchForm || ""}`.trim() === ""
          ? {}
          : { StudentForm: `${searchForm}` })
      }),
      perPage: 9999999
    })
      .then(resp => {
        setStudents(
          (resp.data || []).sort((stu1, stu2) => {
            return stu1.StudentGiven1 > stu2.StudentGiven1 ? 1 : -1;
          })
        );
      })
      .catch(err => {
        Toaster.showApiError(err);
      })
      .finally(() => {
        setIsSearching(false);
      });
  };

  const search = (event: any) => {
    if (event.key === "Enter") {
      return onSearch();
    }
  };

  const getStudentSearchResults = () => {
    if (students === undefined) {
      return null;
    }
    if (students.length <= 0) {
      return (
        <EmptyState
          title={"No Students found"}
          description={"Please refine your search and try again."}
          hideLogo
        />
      );
    }
    return (
      <div className={"student-search-result"}>
        <p>
          Click on any of the students listed below to view their academic
          reports.
        </p>
        <PanelTitle>Search Result</PanelTitle>
        <div className={"search-result"}>
          {students.map(student => (
            <React.Fragment key={student.StudentID}>
              {onRowRender(student)}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const getAdvancedSearchPanel = () => {
    if (showAdvancedSearch !== true) {
      return null;
    }

    return (
      <Row>
        <Col sm={3}>
          <Form.Label>File Year</Form.Label>
          <FileYearSelector
            onSelect={fileYear => setSearchFileYear(fileYear || undefined)}
            value={searchFileYear}
          />
        </Col>
        <Col sm={3}>
          <Form.Label>File Semester</Form.Label>
          <FileSemesterSelector
            semesters={[1, 2, 3, 4, 5]}
            onSelect={fileSemester =>
              setSearchFileSemester(fileSemester || undefined)
            }
            value={searchFileSemester}
          />
        </Col>
        <Col sm={3}>
          <Form.Label>Year Level</Form.Label>
          <YearLevelSelector
            allowClear
            values={
              searchYearLevel === undefined || searchYearLevel === null
                ? []
                : [`${searchYearLevel}`]
            }
            onSelect={option => {
              setSearchYearLevel(
                // @ts-ignore
                option === null || option === undefined
                  ? null
                  : `${Array.isArray(option) ? option[0].value : option?.value}`
              );
            }}
          />
        </Col>
        <Col sm={3}>
          <Form.Label>Form</Form.Label>
          <LuFormSelector
            allowClear
            values={
              searchForm === undefined || searchForm === null
                ? []
                : [`${searchForm}`]
            }
            onSelect={option => {
              setSearchForm(
                // @ts-ignore
                option === null || option === undefined
                  ? null
                  : `${Array.isArray(option) ? option[0].value : option?.value}`
              );
            }}
          />
        </Col>
      </Row>
    );
  };

  return (
    <Wrapper>
      {getAdvancedSearchPanel()}
      <div className={"search-bar"}>
        {label}
        <InputGroup className="mb-3">
          <FormControl
            disabled={isSearching === true}
            placeholder={`Student Name, HomeRoom or Student ID (e.g. Amanda, 9C) ...`}
            value={searchTxt}
            onChange={event => setSearchTxt(event.target.value)}
            onKeyUp={event => search(event)}
          />
          <LoadingBtn
            variant={"primary"}
            isLoading={isSearching}
            onClick={() => onSearch()}
            className={"search-btn"}
          >
            <Search /> <div className={"d-none d-sm-inline-block"}>Search</div>
          </LoadingBtn>
        </InputGroup>
      </div>
      {getStudentSearchResults()}
    </Wrapper>
  );
};

export default SynStudentSearchPanel;
