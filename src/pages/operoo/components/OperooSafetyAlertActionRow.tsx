import iOperooSafetyAlert from '../../../types/Operoo/iOperooSafetyAlert';
import styled from 'styled-components';
import iVStudent from '../../../types/Synergetic/iVStudent';
import {Button, Dropdown, Spinner} from 'react-bootstrap';
import iSynVDocument from '../../../types/Synergetic/iSynVDocument';
import {useState} from 'react';
import OperooSafetyAlertIgnorePopup from './OperooSafetyAlertIgnorePopup';
import DocManReplacingPopup from './DocManReplacingPopup';
import DocManInsertingPopup from './DocManInsertingPopup';
// import moment from 'moment-timezone';

type iOperooSafetyAlertActionRow = {
  student: iVStudent;
  alert: iOperooSafetyAlert;
  docMans: iSynVDocument[];
  isLoading?: boolean;
  showActions?: boolean;
  onUpdated?: (alerts: iOperooSafetyAlert[]) => void;
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px 3px;
  :hover {
    background-color: #ccc;
  }
  .alert-row {
    display: flex;
    > * {
      padding: 0 4px;
    }
  }
  .docman-row {
    display: flex;
    > * {
      padding: 0 0 0 2px;
    }
  }
`;

const ACTION_IGNORE = 'INGORE';
const ACTION_REPLACING_DOC = 'REPLACING_DOC';
const ACTION_INSERTING_DOC = 'INSERTING_DOC';

const OperooSafetyAlertActionRow = ({student, alert, docMans, onUpdated, isLoading = false, showActions = false}: iOperooSafetyAlertActionRow) => {

  const [action, setAction] = useState<string>('');
  const [viewingDoc, setViewingDoc] = useState<iSynVDocument | null>(null);

  // const getViewingDropdown = () => {
  //   if (docMans.length <= 0) {
  //     return null;
  //   }
  //   return (
  //     <Dropdown>
  //       <Dropdown.Toggle size={'sm'}>
  //         View
  //       </Dropdown.Toggle>
  //       <Dropdown.Menu>
  //         {docMans.map(docMan => {
  //           return (
  //             <Dropdown.Item
  //               key={docMan.tDocumentsSeq}
  //               onClick={() => {setAction(ACTION_VIEW_DOC); setViewingDoc(docMan)}}>
  //               <small>View <b>{docMan.Description}</b></small>
  //             </Dropdown.Item>
  //           );
  //         })}
  //       </Dropdown.Menu>
  //     </Dropdown>
  //   )
  // }

  const getDocManDiv = () => {
    if (isLoading) {
      return <Spinner animation={'border'} size={'sm'}/>;
    }

    if (showActions !== true) {
      return;
    }

    return (
      <>
        {/*{getViewingDropdown()}*/}
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
    <>
      <Wrapper>
        <div className={'alert-row'}>
          <div>{alert.operooRecord?.name}</div>
          <div>{alert.operooRecord?.risk_level}</div>
          <div><a href={alert.operooRecord?.attachment_url} >{alert.operooRecord?.attachment_name || ''}</a></div>
          {/*<div>{moment(alert.operooRecord?.updated_at).format('lll')}</div>*/}
        </div>
        <div className={'docman-row'}>
          {getDocManDiv()}
        </div>
        {/*<div>{alert.operooRecord?.description}</div>*/}
        {/*<div><small>{alert.operooRecord?.medication}</small></div>*/}
      </Wrapper>
      {getActionPopup()}
      {getInsertingPopup()}
      {getReplacingPopup()}
    </>
  )
}

export default OperooSafetyAlertActionRow;
