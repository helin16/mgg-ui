import iVStudent from '../../../../types/Synergetic/Student/iVStudent';
import AssessmentAlertGraph from './components/AssessmentAlertGraph';
import AssessmentSubjectCharts from './components/AssessmentSubjectCharts';
import SemesterOverallScoresChart from './components/SemesterOverallScoresChart';
import {Container, Row, Col} from 'react-bootstrap';

type iAssessmentGraph = {
  student: iVStudent
}

const AssessmentGraph = ({student}: iAssessmentGraph) => {
  return (
    <Container fluid>
      <Row>
        <Col md={4}>
          <SemesterOverallScoresChart student={student} />
          <AssessmentAlertGraph student={student} />
        </Col>
        <Col md={8}>
          <AssessmentSubjectCharts student={student} />
        </Col>
      </Row>
    </Container>
  );
}

export default AssessmentGraph;
