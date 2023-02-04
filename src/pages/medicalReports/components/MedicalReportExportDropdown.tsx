import Dropdown from 'react-bootstrap/Dropdown';
import styled from 'styled-components';
import iVStudent from '../../../types/Synergetic/iVStudent';
import iSynVMedicalConditionStudent from '../../../types/Synergetic/iSynVMedicalConditionStudent';
import * as Icons from 'react-bootstrap-icons';

const Wrapper = styled.div`
  .ap-dropdown {
    button {
      font-size: 11px;
      padding: 0.125rem 0.5rem;
    }
  }
`;

type iMedicalReportExportDropdown = {
  students: iVStudent[];
  conditionsMap: { [key: number]: iSynVMedicalConditionStudent[] };
}
const MedicalReportExportDropdown = ({students, conditionsMap}: iMedicalReportExportDropdown) => {

  if (students.length <= 0) {
    return null;
  }

  return (
    <Wrapper>
      <Dropdown className={'ap-dropdown'}>
        <Dropdown.Toggle variant="primary" size={'sm'}>
          <Icons.Download /> Download
        </Dropdown.Toggle>
        <Dropdown.Menu>
        </Dropdown.Menu>
      </Dropdown>
    </Wrapper>
  )
}

export default MedicalReportExportDropdown;
