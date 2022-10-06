import iOperooSafetyAlert, {
  OPEROO_STATUS_SAFETY_ALERT_NEW,
  OPEROO_STATUS_SAFETY_ALERT_UPDATED
} from '../../../types/Operoo/iOperooSafetyAlert';
import styled from 'styled-components';
import iVStudent from '../../../types/Synergetic/iVStudent';
import {Badge, Button, Image, Spinner, Table} from 'react-bootstrap';
import OperooSafetyAlertActionRow from './OperooSafetyAlertActionRow';
import {useState} from 'react';
import SynVDocumentService from '../../../services/Synergetic/SynVDocumentService';
import iSynVDocument from '../../../types/Synergetic/iSynVDocument';
import OperooSafetyAlertService from '../../../services/Operoo/OperooSafetyAlertService';

type iOperooSafetyAlertRow = {
  student?: iVStudent;
  alerts: iOperooSafetyAlert[];
  onAlertUpdated?: (alerts: iOperooSafetyAlert[]) => void;
}

const Wrapper = styled.div`
  display: flex;
  border-bottom: 1px solid #1a1e21;
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;
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
  const [operooAlerts, setOperooAlerts] = useState(alerts);
  const [documents, setDocuments] = useState<iSynVDocument[]>([]);
  const [showActions, setShowActions] = useState(false);

  const loadData = () => {
    if (!student) return;
    setIsLoading(true);
    Promise.all([
      SynVDocumentService.getVDocuments({
        where: JSON.stringify({
          ID: student.StudentID,
          SourceCode: 'MEDICAL_CURRENT',
          ClassificationCode: 'MEDICAL',
        })
      }),
      OperooSafetyAlertService.refetchAlerts(alerts[0].id)
    ]).then(resp => {
      setDocuments(resp[0].data);
      setOperooAlerts(resp[1]);
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

  if (!operooAlerts || operooAlerts.length <= 0 ){
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
                {isLoading === true ? (<Spinner animation={'border'} size={'sm'}/>) : 'Load Data'}
              </Button>
            )}
          </div>
        </div>
        <Table size={'sm'} className={'alerts-table'} borderless hover>
          <tbody>
          {operooAlerts
            .filter(alert => [OPEROO_STATUS_SAFETY_ALERT_NEW, OPEROO_STATUS_SAFETY_ALERT_UPDATED].indexOf(alert.status) >= 0)
            .map(alert => {
            return <OperooSafetyAlertActionRow
              key={alert.id}
              alert={alert}
              student={student}
              docMans={documents}
              isLoading={isLoading}
              showActions={showActions}
              onUpdated={() => loadData()}
            />
          })}
          </tbody>
        </Table>
      </div>
    </Wrapper>
  )
}

export default OperooSafetyAlertRow;
