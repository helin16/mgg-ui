import iOperooSafetyAlert from '../../../types/Operoo/iOperooSafetyAlert';
import styled from 'styled-components';
import iVStudent from '../../../types/Synergetic/iVStudent';
import {Badge, Button, Image, Spinner} from 'react-bootstrap';
import OperooSafetyAlertActionRow from './OperooSafetyAlertActionRow';
import {useState} from 'react';
import SynVDocumentService from '../../../services/Synergetic/SynVDocumentService';
import iSynVDocument from '../../../types/Synergetic/iSynVDocument';

type iOperooSafetyAlertRow = {
  student?: iVStudent;
  alerts: iOperooSafetyAlert[];
  onAlertUpdated?: (alert: iOperooSafetyAlert) => void;
}

const Wrapper = styled.div`
  display: flex;
  margin-bottom: 1rem;
  .profile {
    font-weight: bold;
    display: flex;
    > * {
      padding: 4px;
    }
  }
  .profile-image {
    width: 80px;
  }
  .right-panel {
    width: calc(100% - 80px);
    .title-row {
      display: flex;
      justify-content: space-between;
    }
  }
  
  .load-btn {
    padding: 0px;
  }
`;
const OperooSafetyAlertRow = ({student, alerts, onAlertUpdated}: iOperooSafetyAlertRow) => {

  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<iSynVDocument[]>([]);
  const [showActions, setShowActions] = useState(false);

  const loadData = () => {
    if (!student) return;
    setIsLoading(true);
    SynVDocumentService.getVDocuments({
      where: JSON.stringify({
        ID: student.StudentID,
        SourceCode: 'MEDICAL_CURRENT',
        ClassificationCode: 'MEDICAL',
      })
    }).then(resp => {
      setDocuments(resp.data);
      setShowActions(true);
    }).catch((err) => {
      console.error(err)
    }).finally(() => {
      setIsLoading(false)
    })
  }

  if (!student) {
    return null;
  }
  return (
    <Wrapper>
      <div className={'profile-image'}>
        <Image src={student.profileUrl} fluid />
      </div>
      <div className={'right-panel'}>
        <div className={'title-row'}>
          <div className={'profile'}>
            <div>{student.StudentID}</div>
            <div>{student.StudentPreferred}</div>
            <div>{student.StudentGiven1}</div>
            <div>{student.StudentSurname}</div>
            <div>{student.StudentForm}</div>
            <div>
              <Badge bg="warning" text="dark">
                {alerts.length} changed
              </Badge>
            </div>
          </div>
          <div>
            {showActions === true ? null : (
              <Button variant={'link'} size={'sm'} className={'load-btn'} disabled={isLoading} onClick={() => loadData()}>
                {isLoading === true ? (<Spinner animation={'border'} size={'sm'}/>) : 'Load DocMan'}
              </Button>
            )}
          </div>
        </div>
        {alerts.map(alert => {
          return <OperooSafetyAlertActionRow
            key={alert.id}
            alert={alert}
            student={student}
            docMans={documents}
            isLoading={isLoading}
            showActions={showActions}
            onUpdated={onAlertUpdated}
          />
        })}
      </div>
    </Wrapper>
  )
}

export default OperooSafetyAlertRow;
