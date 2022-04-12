import iVStudent from '../../../../types/Synergetic/iVStudent';
import styled from 'styled-components';
import AssessmentAlertGraph from './components/AssessmentAlertGraph';
import AssessmentSubjectCharts from './components/AssessmentSubjectCharts';

const Wrapper = styled.div``

type iAssessmentGraph = {
  student: iVStudent
}

const AssessmentGraph = ({student}: iAssessmentGraph) => {
  return (
    <Wrapper>
      <AssessmentAlertGraph student={student} />
      <AssessmentSubjectCharts student={student} />
    </Wrapper>
  );
}

export default AssessmentGraph;
