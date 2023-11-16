import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import iVStudent from "../../../types/Synergetic/Student/iVStudent";
import styled from "styled-components";
import ModuleAdminBtn from "../../../components/module/ModuleAdminBtn";
import AdminPage from "../AdminPage";
import { MGGS_MODULE_ID_STUDENT_REPORT } from "../../../types/modules/iModuleUser";
import StudentStatusBadge from "./AcademicReports/StudentStatusBadge";
import SynStudentSearchPanel from "../../../components/student/SynStudentSearchPanel";
import * as Icons from "react-bootstrap-icons";

const Wrapper = styled.div`
  .form-label {
    margin-bottom: 0px;
    margin-top: 8px;
  }
  .search-btn {
    @media only print, screen and (max-width: 40em) {
      max-width: 45px;
    }
  }
  .search-result {
    .search-result-item {
      border-bottom: 1px solid #ddd !important;
      padding: 0.5rem;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      :hover {
        background-color: #f5f5f5 !important;
      }
      :nth-child(2n + 1) {
        background-color: #f9f9f9;
      }

      .status-div {
        margin-left: 20px;
        font-size: 9px;
      }
    }
  }
`;
const SearchPage = ({
  onSelect
}: {
  onSelect: (student: iVStudent) => void;
}) => {
  const [isShowAdminPage, setIsShowAdminPage] = useState(false);
  const [isShowingAdvanced, setIsShowingAdvanced] = useState(false);

  if (isShowAdminPage === true) {
    return <AdminPage backToReportFn={() => setIsShowAdminPage(false)} />;
  }

  return (
    <Wrapper className={"search-box-wrapper"}>
      <h3>
        Student Report
        <span className={"pull-right"}>
          <ModuleAdminBtn
            onClick={() => setIsShowAdminPage(true)}
            moduleId={MGGS_MODULE_ID_STUDENT_REPORT}
          />
        </span>
      </h3>

      <p>
        Welcome to the student academic report viewer. Type the homeroom or name
        of the student you want to locate below.
        <Button
          variant={"link"}
          className={"text-muted"}
          size={"sm"}
          onClick={() => setIsShowingAdvanced(!isShowingAdvanced)}
        >
          Advanced{" "}
          {isShowingAdvanced === true ? (
            <Icons.ChevronUp />
          ) : (
            <Icons.ChevronDown />
          )}
        </Button>
      </p>
      <SynStudentSearchPanel
        showAdvancedSearch={isShowingAdvanced}
        label={<Form.Label>Search</Form.Label>}
        onRowRender={(student: iVStudent) => {
          return (
            <div
              onClick={() => onSelect(student)}
              className={"search-result-item"}
            >
              <div className={"left"}>
                {student.StudentSurname}, {student.StudentGiven1} (
                {student.StudentPreferred}) - {student.StudentID}
                <StudentStatusBadge
                  student={student}
                  className={"status-div"}
                />
              </div>
              <div className={"right"}>{student.StudentForm}</div>
            </div>
          );
        }}
      />
    </Wrapper>
  );
};

export default SearchPage;
