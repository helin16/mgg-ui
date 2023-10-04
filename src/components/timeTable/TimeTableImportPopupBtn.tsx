import styled from 'styled-components';
import LoadingBtn from '../common/LoadingBtn';
import {useEffect, useState} from 'react';
import {Button, ButtonProps, Spinner} from 'react-bootstrap';
import PopupModal from '../common/PopupModal';
import {FlexContainer} from '../../styles';
import * as _ from 'lodash';
import SynTimeTableService from '../../services/Synergetic/SynTimeTableService';
import Toaster from '../../services/Toaster';
import ExplanationPanel from '../ExplanationPanel';
import MessageService from '../../services/MessageService';
import iMessage, {
  MESSAGE_TYPE_TIME_TABLE_IMPORT
} from '../../types/Message/iMessage';
import moment from 'moment-timezone';
import MessageListPanel from '../common/Message/MessageListPanel';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/makeReduxStore';
import SynVConfigUserPermissionService from '../../services/Synergetic/SynVConfigUserPermissionService';
import {PERMISSION_MODULE_TIME_TABLE_MAINTENANCE} from '../../types/Synergetic/iSynVConfigUserPermission';
import Page401 from '../Page401';


const Wrapper = styled.span``;
const PopupWrapper = styled.div`
  .type-row {
    cursor: pointer;
    :hover {
      background-color: #ececec;
    }
  }
  
  input[type='checkbox'] {
    position: relative;
    opacity: 1;
    height: 21px;
    width: 21px;
  }
`

type iTimeTableImportPopupBtn = {
  className?: string;
  btnPros?: ButtonProps;
}

export const TIME_TABLE_TYPE_TIME_TABLER = 'TIMETABLER'
export const TIME_TABLE_TYPE_YARD_DUTY = 'TIMETABLERYD';
export const TIME_TABLE_TYPE_YARD_EXTRA = 'TIMETABLEREXT';
const typeTableTypes = [
  TIME_TABLE_TYPE_TIME_TABLER,
  TIME_TABLE_TYPE_YARD_DUTY,
  TIME_TABLE_TYPE_YARD_EXTRA,
]
const TimeTableImportPopupBtn = ({className, btnPros}: iTimeTableImportPopupBtn) => {
  const [isCheckingPermission, setIsCheckingPermission] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const {user: currentUser} = useSelector((state: RootState) => state.auth);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<iMessage | null>(null);
  const [isMessageExisting, setIsMessageExisting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isShowingPopup, setIsShowingPopup] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([...typeTableTypes])
  const [importResults, setImportResults] = useState<{[key: string]: boolean} | null>(null)
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (`${currentUser?.synergyId || ''}` === '') {
      return;
    }
    let isCanceled = false;
    setIsCheckingPermission(true);
    SynVConfigUserPermissionService.getAll({
        where: JSON.stringify({
          ID: currentUser?.synergyId,
          SelectFlag: true,
          UpdateFlag: true,
          InsertFlag: true,
          DeleteFlag: true,
          Module: PERMISSION_MODULE_TIME_TABLE_MAINTENANCE,
        }),
        perPage: '1'
      }).then(resp => {
        if (isCanceled) return;
        setHasPermission(resp && resp.total > 0)
      }).catch(err => {
        if (isCanceled) return;
        Toaster.showApiError(err);
      }).finally(() => {
        if (isCanceled) return;
        setIsCheckingPermission(false);
      });

    return () => {
      isCanceled = true;
    }
  }, [currentUser?.synergyId])

  const handleClose = () => {
    if(isImporting) {
      return null;
    }
    setIsShowingPopup(false);
    setSelectedTypes([...typeTableTypes]);
    setIsImporting(false);
    setImportResults(null);
    setMessage(null);
    setIsLoading(false);
    setShowHistory(false);
    setIsMessageExisting(false);
  }

  const startImport = () => {
    if (selectedTypes.length <= 0) {
      return;
    }
    setIsImporting(true);
    SynTimeTableService.importTimeTable({
      types: selectedTypes
    }).then(resp => {
      setMessage(resp);
      setIsMessageExisting(false);
    }).catch(err => {
      Toaster.showApiError(err)
    }).finally(() => {
      setIsImporting(false);
    })
  }

  const toggleSelectedType = (type: string) => {
    const index = selectedTypes.indexOf(type);
    if (index < 0) {
      setSelectedTypes(_.uniq([...selectedTypes, type]));
      return;
    }

    selectedTypes.splice(index, 1);
    setSelectedTypes(_.uniq(selectedTypes));
  }

  const getSelectionPanel = () => {
    if (isLoading) {
      return <Spinner animation={'border'} />;
    }
    if (message !== null) {
      return (
        <div className={'text-center'}>
          <Spinner animation={'border'} />
            {
              isMessageExisting ?
                <h5>There is another import(started @ {moment(message.createdAt).format('lll')}) in progress now, please wait for it to be finished first.</h5>
                :
                <h5>Job ({moment(message.createdAt).format('lll')}) in progress now, please wait for it to be finished.</h5>
            }
        </div>
      )
    }
    return (
      <>
        <ExplanationPanel text={'This feature is designed to allow TimeTable admin to import from TimeTabler into Synergetic manually.'} />
        <div><b>Which type(s) you are trying to import into Synergetic?</b></div>
        <div>
          {typeTableTypes.map((type) => {
            return (
              <FlexContainer className={'with-gap space-below type-row'} key={type} onClick={() => toggleSelectedType(type)}>
                <input type={'checkbox'} checked={selectedTypes.indexOf(type) >=0} onChange={() => null}/>
                <span>{type}</span>
              </FlexContainer>
            )
          })}
        </div>
        <div className={'text-danger'}>
          <b>Action can NOT be reversed:</b> once job initiated, you can't cancel it until it finishes.
        </div>
      </>
    )
  }

  const getResultPanel = () => {
    return (
      <>
        <h5>Import script has run, here are the results:</h5>
      </>
    )
  }

  const showPopup = () => {
    setIsShowingPopup(true);
    setIsLoading(true);
    MessageService.getMessages({
      where: JSON.stringify({
        type: MESSAGE_TYPE_TIME_TABLE_IMPORT,
        response: null,
        error: null,
      }),
      sort: 'updatedAt:DESC',
      currentPage: '1',
      perPage: '1',
    }).then(resp => {
      const existingMsg = resp.data.length > 0 ? resp.data[0] : null;
      setMessage(existingMsg);
      setIsMessageExisting(existingMsg !== null ? true : false);
    }).catch(err => {
      Toaster.showApiError(err);
    }).finally(() => {
      setIsLoading(false);
    })
  }

  const getFooter = () => {
    if (isLoading) {
      return null;
    }

    if (!hasPermission || message !== null) {
      return (
        <>
          <div />
          <div>
            <Button variant={'primary'} onClick={() => handleClose()} >OK</Button>
          </div>
        </>
      )
    }

    return (
      <>
        <div />
        <div>
          <LoadingBtn variant={'link'} onClick={() => handleClose()} isLoading={isImporting}>Cancel</LoadingBtn>
          <LoadingBtn
            isLoading={isImporting}
            onClick={() => startImport()}
            disabled={selectedTypes.length <= 0}
          >
            Start Import
          </LoadingBtn>
        </div>
      </>
    )
  }

  const getHistoryPanel = () => {
    return (
      <div>
        <FlexContainer className={'with-gap cursor'} onClick={() => setShowHistory(!showHistory)}>
          <input type={'checkbox'} checked={showHistory} onChange={() => null}/>
          <span>Show History</span>
          <small className={'text-muted'}>You can see the status of the jobs(include the current one) below, after you click on the checkbox</small>
        </FlexContainer>
        {showHistory === true ? <MessageListPanel type={MESSAGE_TYPE_TIME_TABLE_IMPORT} /> : null}
      </div>
    )
  }

  const getPopupContent = () => {
    if (!hasPermission) {
      return <Page401
        description={`To access this feature, you need all permission for module: ${PERMISSION_MODULE_TIME_TABLE_MAINTENANCE}, including: select, update, insert and delete`}
        btns={<div />}
      />
    }
    return (
      <>
        {importResults === null ? getSelectionPanel() : getResultPanel()}
        {getHistoryPanel()}
      </>
    )
  }

  const getPopup = () => {
    return (
      <PopupModal
        fullWidth
        header={<b>TimeTable Manual Import</b>}
        handleClose={() => handleClose()}
        show={isShowingPopup}
        size={'lg'}
        footer={getFooter()}
      >
        <PopupWrapper>
          {getPopupContent()}
        </PopupWrapper>
      </PopupModal>
    )
  }

  return (
    <Wrapper className={className}>
      <LoadingBtn
        variant={hasPermission ? 'primary' : 'secondary'}
        onClick={() => showPopup()}
        {...btnPros}
        isLoading={isCheckingPermission}>
        TimeTable Import
      </LoadingBtn>
      {getPopup()}
    </Wrapper>
  )
}

export default TimeTableImportPopupBtn
