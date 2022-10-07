import PopupModal from '../../../components/common/PopupModal';
import styled from 'styled-components';
import {Alert, Form} from 'react-bootstrap';
import iOperooSafetyAlert from '../../../types/Operoo/iOperooSafetyAlert';
import iVStudent from '../../../types/Synergetic/iVStudent';
import OperooSafetyAlertService from '../../../services/Operoo/OperooSafetyAlertService';
import {useState} from 'react';
import LoadingBtn from '../../../components/common/LoadingBtn';
import OperooNewDocViewer from './OperooNewDocViewer';
import {FlexContainer} from '../../../styles';
import moment from 'moment-timezone';

type iDocManInsertingPopup = {
  alert: iOperooSafetyAlert;
  student: iVStudent;
  onCancel: () => void;
  onUpdated?: (alert: iOperooSafetyAlert) => void;
}

const Wrapper = styled.div`
  .title-row {
    display: flex;
  }
  
`;
const DocManInsertingPopup = ({alert, student, onCancel, onUpdated}: iDocManInsertingPopup) => {
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
    OperooSafetyAlertService.syncOperooSafetyAlert(alert.id, {description})
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
            <LoadingBtn variant={'primary'} onClick={handleUpdate} isLoading={isSaving}>Insert</LoadingBtn>
          </div>
        </FlexContainer>
      }
    >
      <Wrapper>
        <OperooNewDocViewer alert={alert} />
      </Wrapper>
    </PopupModal>
  )
};

export default DocManInsertingPopup
