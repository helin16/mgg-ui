import { Table } from "react-bootstrap";
import moment from "moment-timezone";
import styled from "styled-components";
import iVStudent from "../../../../../types/Synergetic/Student/iVStudent";

const Wrapper = styled.div`
  padding: 0.8rem;
  text-align: center;
  td {
    border-color: #c8c8c8;
  }
  td:first-child {
    text-align: left;
    padding: 0.3rem;
  }
`;
type iWellBeingGraphDetailsPanel = {
  student: iVStudent;
};
const WellBeingGraphDetailsPanel = ({
  student
}: iWellBeingGraphDetailsPanel) => {
  return (
    <Wrapper className={"details-table"}>
      <Table>
        <tbody>
          <tr>
            <td>ID</td>
            <td>{student.StudentID}</td>
          </tr>
          <tr>
            <td>Year Level</td>
            <td>{student.StudentForm}</td>
          </tr>
          <tr>
            <td>D.O.B.</td>
            <td>
              {`${student.StudentBirthDate || ""}`.trim() === ""
                ? ""
                : moment(`${student.StudentBirthDate || ""}`.trim()).format(
                    "DD/MM/YYYY"
                  )}
            </td>
          </tr>
          <tr>
            <td>House</td>
            <td>{student.StudentHouseDescription}</td>
          </tr>
          <tr>
            <td>Commented</td>
            <td>
              {`${student.StudentEntryDate || ""}`.trim() === ""
                ? ""
                : moment(`${student.StudentEntryDate || ""}`.trim()).format(
                    "DD/MM/YYYY"
                  )}
            </td>
          </tr>
          <tr>
            <td>Court Order</td>
            <td>
              {`${student.LegalCourtOrderType || ""}`.trim() === "" ? "N" : "Y"}
            </td>
          </tr>
          <tr>
            <td>Parent Separated</td>
            <td>{student.LegalParentsSeparatedFlag === true ? "Y" : "N"}</td>
          </tr>
        </tbody>
      </Table>
    </Wrapper>
  );
};

export default WellBeingGraphDetailsPanel;
