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
  const data = [{
    title: 'ID',
    content: student.StudentID
  }, {
    title: 'Year Level',
    content: student.StudentForm
  }, {
    title: 'D.O.B.',
    content: `${student.StudentBirthDate || ""}`.trim() === ""
      ? ""
      : moment(`${student.StudentBirthDate || ""}`.trim()).format(
        "DD/MM/YYYY"
      ),
  }, {
    title: 'House',
    content: student.StudentHouseDescription,
  }, {
    title: 'Commenced',
    content: `${student.StudentEntryDate || ""}`.trim() === ""
      ? ""
      : moment(`${student.StudentEntryDate || ""}`.trim()).format(
        "DD/MM/YYYY"
      ),
  }, {
    title: 'Court Order?',
    content: `${student.LegalCourtOrderType || ""}`.trim() === "" ? "No" : <div className={'bg-danger text-white'}>Yes</div>,
  }, {
    title: 'Parent Separated?',
    content: `${student.LegalParentsSeparatedFlag || ""}`.trim() === "" ? "No" :
      <div className={'bg-danger text-white'}>Yes</div>,
  }]
  return (
    <Wrapper className={"details-table"}>
      {
        data.map(row => {
          return (
            <div key={row.title} className={'clearfix border-bottom'} style={{padding: '6px 0'}}>
              <div className={'float-start text-left'}><b>{row.title}</b></div>
              <div className={'float-end'}>{row.content}</div>
            </div>
          )
        })
      }
    </Wrapper>
  );
};

export default WellBeingGraphDetailsPanel;
