import iOperooSafetyAlert from '../../../types/Operoo/iOperooSafetyAlert';
import React, {useState} from 'react';
import PopupModal from '../../../components/common/PopupModal';
import {Badge, Button, Table} from 'react-bootstrap';
import styled from 'styled-components';
import moment from 'moment-timezone';
import OperooSafetyAlertService from '../../../services/Operoo/OperooSafetyAlertService';

type iOperooSafetyAlertIgnorePopup = {
  alert: iOperooSafetyAlert;
  onCancel: () => void;
  onUpdated?: (alert: iOperooSafetyAlert) => void;
}
const Wrapper = styled.div`
  .details {
    .details-row {
      .title {
        font-weight: bold;
        text-transform: uppercase;
      }
    }
  }
`;
const OperooSafetyAlertIgnorePopup = ({alert, onCancel, onUpdated}: iOperooSafetyAlertIgnorePopup) => {
  const [isSaving, setIsSaving] = useState(false);

  const onConfirm = () => {
    setIsSaving(true)
    OperooSafetyAlertService.ignoreOperooSafetyAlert(alert.id, {})
      .then(resp => {
        if (onUpdated) {
          onUpdated(resp);
        }
      })
      .finally(() => {
        setIsSaving(false)
      })
  }

  return (
    <PopupModal
      show={true}
      handleClose={onCancel}
      title={'Are you sure?'}
      footer={
        <>
          <Button variant={'default'} onClick={() => onCancel()} disabled={isSaving}>Cancel</Button>
          <Button variant={'danger'} onClick={() => onConfirm()} disabled={isSaving}>Ignore</Button>
        </>
      }
    >
      <Wrapper>
        <p>Once you mark this alert as <Badge bg={'danger'}>IGNORED</Badge>, then you won't be able to re-process this record anymore</p>
        <Table className={'details'} striped borderless responsive>
          <tbody>
            <tr className={'details-row'}>
              <td className={'title'}>name</td><td>{alert.operooRecord?.name || ''}</td>
            </tr>
            <tr className={'details-row'}>
              <td className={'title'}>Description</td><td>{alert.operooRecord?.description || ''}</td>
            </tr>
            <tr className={'details-row'}>
              <td className={'title'}>Risk Level</td><td>{alert.operooRecord?.risk_level || ''}</td>
            </tr>
            <tr className={'details-row'}>
              <td className={'title'}>medication</td><td>{alert.operooRecord?.medication || ''}</td>
            </tr>
            <tr className={'details-row'}>
              <td className={'title'}>updated_at</td><td>{moment(alert.operooRecord?.updated_at || '').format('lll')}</td>
            </tr>
          </tbody>
        </Table>
      </Wrapper>
    </PopupModal>
  )
}

export default OperooSafetyAlertIgnorePopup;
