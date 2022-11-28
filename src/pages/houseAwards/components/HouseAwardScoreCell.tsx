import styled from 'styled-components';
import CheckBox from '../../../components/common/CheckBox';
import iHouseAwardScore from '../../../types/HouseAwards/iHouseAwardScore';
import iHouseAwardEvent from '../../../types/HouseAwards/iHouseAwardEvent';
import {useState} from 'react';
import PopupModal from '../../../components/common/PopupModal';
import {Button, Spinner} from 'react-bootstrap';
import CommunityService from '../../../services/Synergetic/CommunityService';
import iSynCommunity from '../../../types/Synergetic/iSynCommunity';
import Toaster from '../../../services/Toaster';
import moment from 'moment-timezone';
import * as Icons from 'react-bootstrap-icons';
import HouseAwardScoreService from '../../../services/HouseAwards/HouseAwardScoreService';
import iHouseAwardEventType from '../../../types/HouseAwards/iHouseAwardEventType';

type iHouseAwardScoreCell = {
  event: iHouseAwardEvent;
  eventType: iHouseAwardEventType;
  fileYear: number;
  scoreMap: {[key: number]: iHouseAwardScore};
  isDisabled?: boolean;
  studentId: number;
  onAddedScore: (newScore: iHouseAwardScore) => void;
  onDeletedScore: (deletedScore: iHouseAwardScore) => void;
}
const Wrapper = styled.div`
  text-align: center;
  .award-checkbox {
    input[type='checkbox'] {
      cursor: pointer;
    }
    
  }
  .awarded-wrapper {
    color: #cbcbcb;
    cursor: not-allowed;
  }
`
const HouseAwardScoreCell = ({event, isDisabled, eventType, studentId, fileYear, onAddedScore, onDeletedScore, scoreMap = {}}: iHouseAwardScoreCell) => {
  const scoreAwarded = event.id in scoreMap ? scoreMap[event.id].awarded_by_id !== null : false;
  const [showingErr, setShowingErr] = useState(false)
  const [isLoadingAwardedBy, setIsLoadingAwardedBy] = useState(false)
  const [awardedInfo, setAwardedInfo] = useState<iSynCommunity | null>(null)
  const [isChanging, setIsChanging] = useState(false)
  const getAwardedInfo = () => {
    if (isLoadingAwardedBy) {
      return <Spinner animation={'border'} />;
    }
    return (
      <p>Score is awarded by {awardedInfo?.Given1} {awardedInfo?.Surname} @ {moment(scoreMap[event.id].awarded_at).format('lll')}</p>
    )
  }

  const fetchAwardedInfo = () => {
    setIsLoadingAwardedBy(true);
    CommunityService.getCommunityProfiles({
      where: JSON.stringify({
        ID: scoreMap[event.id].awarded_by_id || 0
      })
    }).then(resp => {
      if (resp.data.length > 0) {
        setAwardedInfo(resp.data[0])
      }
    }).catch(err => {
      Toaster.showApiError(err)
    }).finally(() => {
      setIsLoadingAwardedBy(false);
    })
  }

  const getErrorPanel = () => {
    if (showingErr !== true) {
      return null;
    }

    return (
      <PopupModal
        show={showingErr === true}
        handleClose={() => setShowingErr(false)}
        title={'Can NOT update the score'}
        footer = {
          <>
            <Button variant={'primary'} onClick={() => setShowingErr(false)}>OK</Button>
          </>
        }
      >
        {getAwardedInfo()}
      </PopupModal>
    )
  }

  const handleOnChange = (checked: boolean) => {
    setIsChanging(true);
    if (checked) {
      HouseAwardScoreService.createScore({
        FileYear: `${fileYear}`,
        StudentID: `${studentId}`,
        event_id: `${event.id}`,
        event_type_id: `${eventType.id}`,
        score: '1',
      }).then(resp => {
        setIsChanging(false);
        onAddedScore(resp);
      }).catch(err => {
        Toaster.showApiError(err);
        setIsChanging(false);
      });
      return;
    }

    HouseAwardScoreService.deleteScore(scoreMap[event.id].id || 0).then(resp => {
      setIsChanging(false);
      onDeletedScore(resp);
    }).catch(err => {
      Toaster.showApiError(err);
      setIsChanging(false);
    });
  }


  const getContent = () => {
    if (isChanging) {
      return <Spinner animation={'border'} size={'sm'} />
    }

    if (scoreAwarded) {
      return (
        <div
          className={'awarded-wrapper'}>
          <Icons.CheckSquareFill
            onClick={() => {
              fetchAwardedInfo();
              setShowingErr(true);
              return;
            }} />
          {getErrorPanel()}
        </div>
      )
    }
    return <CheckBox
      className={`award-checkbox`}
      checked={event.id in scoreMap}
      onChange={(option: any) => {
        handleOnChange(option.target.checked);
      }}
      disabled={isDisabled}
    />
  }

  return (
    <Wrapper>
      {getContent()}
    </Wrapper>
  )
}

export default HouseAwardScoreCell
