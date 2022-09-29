import PopupModal from '../../../components/common/PopupModal';
import styled from 'styled-components';
import {Button} from 'react-bootstrap';
import iOperooSafetyAlert from '../../../types/Operoo/iOperooSafetyAlert';
import iVStudent from '../../../types/Synergetic/iVStudent';
import OperooSafetyAlertService from '../../../services/Operoo/OperooSafetyAlertService';
import {useState} from 'react';
import LoadingBtn from '../../../components/common/LoadingBtn';

type iDocManInsertingPopup = {
  alert: iOperooSafetyAlert;
  student: iVStudent;
  onCancel: () => void;
  onUpdated?: (alert: iOperooSafetyAlert) => void;
}

const Wrapper = styled.div`
  iframe {
    height: calc(100vh - 12.5rem);
    width: 100%;
  }
`;
const DocManInsertingPopup = ({alert, student, onCancel, onUpdated}: iDocManInsertingPopup) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleCancel = () => {
    if (isSaving) {
      return;
    }
    onCancel();
  }

  const handleUpdate = () => {
    setIsSaving(true);
    OperooSafetyAlertService.syncOperooSafetyAlert(alert.id, {})
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
      title={<small style={{fontSize: '14px'}}>Inserting <b>{alert.operooRecord?.Description}</b> into Synergetic DocMan for <b>{student.StudentLegalFullName}</b></small>}
      show={true}
      handleClose={handleCancel}
      fullscreen
      footer={
        <>
          <Button variant={'default'} onClick={handleCancel} disabled={isSaving}>Cancel</Button>
          <LoadingBtn variant={'primary'} onClick={handleUpdate} disabled={isSaving}>Insert</LoadingBtn>
        </>
      }
    >
      <Wrapper>
        <iframe src={alert.operooRecord?.attachment_url || ''} title={'current-doc'}/>
      </Wrapper>
    </PopupModal>
  )
};

export default DocManInsertingPopup
