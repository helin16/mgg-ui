import iSynVDocument from '../../../types/Synergetic/iSynVDocument';
import PopupModal from '../../../components/common/PopupModal';
import styled from 'styled-components';
import {Button} from 'react-bootstrap';
import iOperooSafetyAlert from '../../../types/Operoo/iOperooSafetyAlert';
import {useState} from 'react';
import OperooSafetyAlertService from '../../../services/Operoo/OperooSafetyAlertService';
import iVStudent from '../../../types/Synergetic/iVStudent';
import OperooExisitingDocViewer from './OperooExisitingDocViewer';
import OperooNewDocViewer from './OperooNewDocViewer';

type iDocManViewingPopup = {
  alert: iOperooSafetyAlert;
  document: iSynVDocument;
  student: iVStudent;
  onCancel: () => void;
  onUpdated?: (alert: iOperooSafetyAlert) => void;
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  justify-items: flex-start;
  .new-doc,
  .current-doc {
    width: calc(50% - 0.5rem);
  }
`;
const DocManReplacingPopup = ({alert, document, student, onCancel, onUpdated}: iDocManViewingPopup) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleCancel = () => {
    if (isSaving) {
      return;
    }
    onCancel();
  }

  const handleUpdate = () => {
    setIsSaving(true);
    OperooSafetyAlertService.syncOperooSafetyAlert(alert.id, { tDocumentsSeq: `${document.tDocumentsSeq}` })
      .then(resp => {
        if (onUpdated) {
          onUpdated(resp);
        }
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        setIsSaving(false);
      })
  }
  return (
    <PopupModal
      title={<small style={{fontSize: '14px'}}>Replacing <b>{alert.operooRecord?.Description}</b> into Synergetic DocMan for <b>{student.StudentLegalFullName}</b></small>}
      show={true}
      handleClose={onCancel}
      fullscreen
      footer={
        <>
          <Button variant={'default'} onClick={handleCancel}>Cancel</Button>
          <Button variant={'primary'} onClick={handleUpdate}>Replace</Button>
        </>
      }
    >
      <Wrapper>
        <div className={'new-doc'}>
          <OperooNewDocViewer alert={alert} />
        </div>
        <div className={'current-doc'}>
          <OperooExisitingDocViewer document={document} />
        </div>
      </Wrapper>
    </PopupModal>
  )
};

export default DocManReplacingPopup
