import iOperooSafetyAlert from '../../../types/Operoo/iOperooSafetyAlert';
import styled from 'styled-components';
import iVStudent from '../../../types/Synergetic/iVStudent';
import {Button, Dropdown, Spinner} from 'react-bootstrap';
import iSynVDocument from '../../../types/Synergetic/iSynVDocument';
import {useState} from 'react';
import OperooSafetyAlertIgnorePopup from './OperooSafetyAlertIgnorePopup';
import DocManReplacingPopup from './DocManReplacingPopup';
import DocManInsertingPopup from './DocManInsertingPopup';
import LoadingBtn from '../../../components/common/LoadingBtn';
import moment from 'moment-timezone';
import PopoverLayer from '../../../components/common/PopoverLayer';
// import moment from 'moment-timezone';

type iOperooSafetyAlertActionRow = {
  student: iVStudent;
  alert: iOperooSafetyAlert;
  docMans: iSynVDocument[];
  isLoading?: boolean;
  showActions?: boolean;
  onUpdated?: (alerts: iOperooSafetyAlert[]) => void;
}

const Wrapper = styled.tr`
  td > [role="button"] {
    padding: 0px;
    font-size: 12px;
  }
  td.modified-date {
    width: 10rem;
  }
  td.view-operoo,
  td.actions {
    width: 8rem;
  }
  td.actions {
    text-align: right;
    > .dropdown {
      text-align: right;
      > button {
        padding: 0px 4px;
        font-size: 12px;
      }
    }
  }
  td.medication,
  td.description {
    width: 200px;
    .popover-btn {
      font-size: 11px;
      width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 0px;
      text-align: left;
    }
  }
  .risk-level {
    width: 4rem;
    &.high {
      background-color: red;
      color: white;
    }
    &.medium {
      background-color: #ffc107;
    }
    &.low {
      background-color: green;
      color: white;
    }
  }
`;

const ACTION_IGNORE = 'INGORE';
const ACTION_REPLACING_DOC = 'REPLACING_DOC';
const ACTION_INSERTING_DOC = 'INSERTING_DOC';

const OperooSafetyAlertActionRow = ({student, alert, docMans, onUpdated, isLoading = false, showActions = false}: iOperooSafetyAlertActionRow) => {

  const [action, setAction] = useState<string>('');
  const [viewingDoc, setViewingDoc] = useState<iSynVDocument | null>(null);

  const getDocManDiv = () => {
    if (isLoading) {
      return <Spinner animation={'border'} size={'sm'}/>;
    }

    if (showActions !== true) {
      return;
    }

    return (
      <>
        <Dropdown>
          <Dropdown.Toggle size={'sm'}>
            Action
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {docMans.map(docMan => {
              return (
                <Dropdown.Item
                  key={docMan.tDocumentsSeq}
                  onClick={() => {setAction(ACTION_REPLACING_DOC); setViewingDoc(docMan)}}>
                  <small>Replacing <b>{docMan.Description}</b></small>
                </Dropdown.Item>
              )
            })}
            {docMans.length > 0 ? (<Dropdown.Divider />) : null}
            <Dropdown.Item
              onClick={() => {setAction(ACTION_INSERTING_DOC);}}
              >
              <small>INSERT AS NEW</small>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>
              <Button variant={'danger'} size={'sm'} style={{width: '100%'}} onClick={() => setAction(ACTION_IGNORE)}>
                IGNORE
              </Button>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </>
    );
  }

  const handleUpdated = (updatedAlert: iOperooSafetyAlert) => {
    setAction('');
    if (onUpdated) {
      onUpdated([updatedAlert]);
    }
  }


  const getActionPopup = () => {
    if (action === ACTION_IGNORE) {
      return (
        <OperooSafetyAlertIgnorePopup
          alert={alert}
          onCancel={() => setAction('')}
          onUpdated={(alert) => handleUpdated(alert)}
        />
      );
    }
    return null;
  }

  const getReplacingPopup = () => {
    if (action === ACTION_REPLACING_DOC && viewingDoc) {
      return <DocManReplacingPopup student={student} alert={alert} document={viewingDoc} onCancel={() => setAction('')} onUpdated={handleUpdated} />
    }
    return null;
  }

  const getInsertingPopup = () => {
    if (action === ACTION_INSERTING_DOC) {
      return <DocManInsertingPopup student={student} alert={alert} onCancel={() => setAction('')} onUpdated={handleUpdated} />
    }
    return null;
  }

  return (
    <Wrapper>
      <td>{alert.operooRecord?.name}</td>
      <td className={'description'}>
        <PopoverLayer body={<p>{alert.operooRecord?.description || ''}</p>}  header={<b>Description</b>} triggerProps={{ placement: 'auto'}}>
          <Button variant={'link'} size={'sm'} className={'popover-btn'}>{alert.operooRecord?.description}</Button>
        </PopoverLayer>
      </td>
      <td className={'medication'}>
        <PopoverLayer body={<p>{alert.operooRecord?.medication || ''}</p>} header={<b>Medication</b>} triggerProps={{ placement: 'auto'}}>
          <Button variant={'link'} size={'sm'} className={'popover-btn'}>{alert.operooRecord?.medication}</Button>
        </PopoverLayer>
      </td>
      <td className={`risk-level ${alert.operooRecord?.risk_level || ''}`.toLowerCase()}>{alert.operooRecord?.risk_level}</td>
      <td className={'modified-date'}>{moment(alert.operooRecord?.updated_at).format('lll')}</td>
      <td className={'view-operoo'}>
        {showActions && (
          <LoadingBtn variant={'link'} size={'sm'} href={alert.operooRecord?.attachment_url} isLoading={isLoading} target={'__BLANK'}>
            View New
          </LoadingBtn>
        )}
      </td>
      <td className={'actions'}>
        {getDocManDiv()}
        {getActionPopup()}
        {getInsertingPopup()}
        {getReplacingPopup()}
      </td>
    </Wrapper>
  )
}

export default OperooSafetyAlertActionRow;
