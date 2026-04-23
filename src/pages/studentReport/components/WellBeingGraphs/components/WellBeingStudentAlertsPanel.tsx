import { Table } from "react-bootstrap";
import styled from "styled-components";
import iVStudent from "../../../../../types/Synergetic/Student/iVStudent";
import iSynVActivity from '../../../../../types/Synergetic/iSynVActivity';
import iSynUStudentGiftedSummary from '../../../../../types/Synergetic/iSynUStudentGiftedSummary';

const Wrapper = styled.div``;
type iWellBeingStudentAlertsPanel = {
  student: iVStudent;
  activities: iSynVActivity[];
  studentGiftedSummaries: iSynUStudentGiftedSummary[];
};
const WellBeingStudentAlertsPanel = ({
  student, activities, studentGiftedSummaries
}: iWellBeingStudentAlertsPanel) => {
  return (
    <Wrapper className={"alerts-table"}>
      <Table responsive>
        <tbody>
          <tr>
            <td>Learning Support</td>
            <td>{student.StudentSpecialNeedsFlag === true ? 'Y' : 'N'}</td>
          </tr>
          <tr>
            <td>Extension</td>
            <td>{studentGiftedSummaries.filter(studentGiftedSummary => studentGiftedSummary.InExtensionFlag === true).length > 0 ? 'Y' : 'N'}</td>
          </tr>
          <tr>
            <td>English Language Support</td>
            <td>
              {activities.length > 0 ? 'Y' : 'N'}
            </td>
          </tr>
          <tr>
            <td>EAL</td>
            <td>{student.EnglishSecondFlag === true ? 'Y' : 'N'}</td>
          </tr>
        </tbody>
      </Table>
    </Wrapper>
  );
};

export default WellBeingStudentAlertsPanel;
