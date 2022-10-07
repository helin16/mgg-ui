import iSynVDocument from '../../../types/Synergetic/iSynVDocument';
import PopupModal from '../../../components/common/PopupModal';
import styled from 'styled-components';
import {Form} from 'react-bootstrap';
import iOperooSafetyAlert from '../../../types/Operoo/iOperooSafetyAlert';
import {useState} from 'react';
import OperooSafetyAlertService from '../../../services/Operoo/OperooSafetyAlertService';
import iVStudent from '../../../types/Synergetic/iVStudent';
import OperooExisitingDocViewer from './OperooExisitingDocViewer';
import OperooNewDocViewer from './OperooNewDocViewer';
import moment from 'moment-timezone';
import {FlexContainer} from '../../../styles';
import LoadingBtn from '../../../components/common/LoadingBtn';
import Toaster from '../../../services/Toaster';

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
  const [description, setDescription] = useState(`${moment(alert.operooRecord?.updated_at).format('YYYY')} ${alert.operooRecord?.name}`);

  const handleCancel = () => {
    if (isSaving) {
      return;
    }
    onCancel();
  }

  const handleUpdate = () => {
    setIsSaving(true);
    OperooSafetyAlertService.syncOperooSafetyAlert(alert.id, { tDocumentsSeq: `${document.tDocumentsSeq}`, description })
      .then(resp => {
        if (onUpdated) {
          onUpdated(resp);
        }
      })
      .catch(err => {
        Toaster.showApiError(err);
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
        <FlexContainer className={'justify-content space-between'}>
          <div>
            <Form.Control
              style={{width: '20rem'}}
              placeholder="description for Synergetic DocMan"
              aria-label="description"
              value={description}
              onChange={(newValue) => setDescription(newValue.target.value)}
              disabled={isSaving}
            />
          </div>
          <div>
            <LoadingBtn variant={'default'} onClick={handleCancel} isLoading={isSaving}>Cancel</LoadingBtn>
            <LoadingBtn variant={'primary'} onClick={handleUpdate} isLoading={isSaving}>Replace</LoadingBtn>
          </div>
        </FlexContainer>
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
