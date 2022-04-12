import iVStudent from '../../../../types/student/iVStudent';
import styled from 'styled-components';
import AssessmentAlertGraph from './components/AssessmentAlertGraph';

const Wrapper = styled.div``

type iAssessmentGraph = {
  student: iVStudent
}
const AssessmentGraph = ({student}: iAssessmentGraph) => {
  return (
    <Wrapper>
      <AssessmentAlertGraph student={student} />
    </Wrapper>
  );
}

export default AssessmentGraph;
