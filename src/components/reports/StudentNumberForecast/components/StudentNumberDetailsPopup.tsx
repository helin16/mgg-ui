import iVStudent from '../../../../types/Synergetic/iVStudent';
import iFunnelLead from '../../../../types/Funnel/iFunnelLead';
import { Table} from 'react-bootstrap';
import PopupModal from '../../../common/PopupModal';

type iStudentNumberDetailsPopup = {
  records: (iVStudent | iFunnelLead)[];
  isShowing?: boolean;
  handleClose: () => void;
}

const StudentNumberDetailsPopup = ({records, handleClose, isShowing = false}: iStudentNumberDetailsPopup) => {

  return (
    <PopupModal
      dialogClassName={'modal-90w'}
      show={isShowing}
      handleClose={handleClose}
      title={`${records.length} students:`}
    >
      <Table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Leaving Date</th>
            <th>Current Year Level</th>
            <th>Proposing Entry Year</th>
            <th>Proposing Entry Year Level</th>
            <th>Lead Stage</th>
          </tr>
        </thead>
        <tbody>
        {records
          // @ts-ignore
          .sort((r1, r2) => `${r1.StudentYearLevelDescription || ''}` > `${r2.StudentYearLevelDescription || ''}` ? -1 : 1)
          // @ts-ignore
          .sort((r1, r2) => `${r1.student_starting_year_level || ''}` > `${r2.student_starting_year_level || ''}` ? 1 : -1)
          .map((record, index) => {
            return (
              <tr key={index}>
                <td>{'StudentGiven1' in record ? record.StudentGiven1 : record.student_first_name}</td>
                <td>{'StudentSurname' in record ? record.StudentSurname : record.student_last_name}</td>
                <td>{'StudentLeavingDate' in record ? record.StudentLeavingDate : ''}</td>
                <td>{'StudentYearLevelDescription' in record ? record.StudentYearLevelDescription : ''}</td>
                <td>{'student_starting_year' in record ? record.student_starting_year : ''}</td>
                <td>{'student_starting_year_level' in record ? record.student_starting_year_level : ''}</td>
                <td>{'pipeline_stage_name' in record ? record.pipeline_stage_name : ''}</td>
              </tr>
            )
        })}
        </tbody>
      </Table>
    </PopupModal>
  )
}

export default StudentNumberDetailsPopup;
