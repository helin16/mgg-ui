import iSynVDocument from '../../../types/Synergetic/iSynVDocument';
import PopupModal from '../../../components/common/PopupModal';
import styled from 'styled-components';
import {getDocumentUrl, openDocument} from '../../../services/Synergetic/SynVDocumentService';
import {Button} from 'react-bootstrap';
import iOperooSafetyAlert from '../../../types/Operoo/iOperooSafetyAlert';
import {useState} from 'react';
import OperooSafetyAlertService from '../../../services/Operoo/OperooSafetyAlertService';
import iVStudent from '../../../types/Synergetic/iVStudent';

type iDocManViewingPopup = {
  alert: iOperooSafetyAlert;
  document: iSynVDocument;
  student: iVStudent;
  onCancel: () => void;
  onUpdated?: (alert: iOperooSafetyAlert) => void;
}

const Wrapper = styled.div`
  .current-doc {
    width: 50%;
    iframe {
      height: calc(100vh - 12.5rem);
      width: 100%;
    }
  }
  .title-row {
    display: flex;
    justify-content: space-between;
    button {
      padding: 0px;
    }
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
        <div className={'current-doc'}>
          <div className={'title-row'}>
            <div>Current: <b>{document.Description}</b></div>
            <Button variant={'link'} size={'sm'} onClick={() => openDocument(document)}>View fullscreen</Button>
          </div>
          <iframe src={getDocumentUrl(document)} title={'current-doc'}/>
        </div>
      </Wrapper>
    </PopupModal>
  )
};

export default DocManReplacingPopup
