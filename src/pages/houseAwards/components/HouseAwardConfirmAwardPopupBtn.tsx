import iHouseAwardScore from '../../../types/HouseAwards/iHouseAwardScore';
import iHouseAwardEventType from '../../../types/HouseAwards/iHouseAwardEventType';
import iHouseAwardStudentYear from '../../../types/HouseAwards/iHouseAwardStudentYear';
import LoadingBtn from '../../../components/common/LoadingBtn';
import styled from 'styled-components';
import {useEffect, useState} from 'react';
import PopupModal from '../../../components/common/PopupModal';
import iVStudent from '../../../types/Synergetic/iVStudent';
import {FlexContainer} from '../../../styles';
import {Alert, Button} from 'react-bootstrap';
import HouseAwardScoreService from '../../../services/HouseAwards/HouseAwardScoreService';
import Toaster from '../../../services/Toaster';
import iHouseAwardEvent from '../../../types/HouseAwards/iHouseAwardEvent';

type iHouseAwardConfirmAwardPopupBtn = {
  scores: iHouseAwardScore[];
  type: iHouseAwardEventType;
  student: iVStudent;
  events: iHouseAwardEvent[];
  FileYear: number;
  onAwarded: (scores: iHouseAwardScore[], newStudentYear: iHouseAwardStudentYear) => void;
  isDisabled?: boolean;
}
const Wrapper = styled.div``;
const HouseAwardConfirmAwardPopupBtn = ({scores, type, student, FileYear, onAwarded, events, isDisabled}: iHouseAwardConfirmAwardPopupBtn ) => {
  const filteredScores = scores.filter((score: iHouseAwardScore) => score.awarded_id === null).sort((score1, score2) => {
    return score1.created_at < score2.created_at ? 1 : -1;
  });
  const [isShowing, setIsShowing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [eventMap, setEventMap] = useState<{[key: number]: iHouseAwardEvent}>({});
  const [selectedScores, setSelectedScores] = useState<iHouseAwardScore[]>([]);
  const [notSelectedScores, setNotSelectedScores] = useState<iHouseAwardScore[]>([]);

  useEffect(() => {
    setEventMap(events.reduce((map, event) => {
      return {...map, [event.id]: event};
    }, {}));
    setSelectedScores(filteredScores.slice(0, type.points_to_be_awarded));
  }, [events, scores, type.points_to_be_awarded, filteredScores])

  useEffect(() => {
    const selectedScoreIds = selectedScores.map(score => score.id);
    setNotSelectedScores(scores.filter(score => selectedScoreIds.indexOf(score.id) < 0));
  }, [selectedScores, scores])

  const handelAwards = () => {
    setIsUpdating(true);
    HouseAwardScoreService.awardScores({
      scoreIds: selectedScores.map(score => score.id),
      StudentID: student.StudentID,
      FileYear: FileYear,
      eventTypeId: type.id,
    }).then(resp => {
      setIsShowing(false);
      onAwarded(resp.scores, resp.studentYear);
    }).catch(err => {
      Toaster.showApiError(err);
    }).finally(() => {
      setIsUpdating(false);
    })
  }

  const handleClose = () => {
    setIsShowing(false);
    setSelectedScores(filteredScores.slice(0, type.points_to_be_awarded));
  }


  const getIsAwardable = () => {
    return selectedScores.length === type.points_to_be_awarded;
  }

  const getSelectedEvents = () => {
    if (selectedScores.length <= 0) {
      return null;
    }
    return (
      <>
        <FlexContainer className={'withGap'}>
          <b>Events to be awarded:</b><small className={'text-muted'}>click on below event to be removed</small>
        </FlexContainer>
        <FlexContainer className={'withGap wrap space-below'}>
          {selectedScores.map(score => {
            return (
              <Button variant={'success'} key={score.id} size={'sm'} onClick={() => {
                setSelectedScores(selectedScores.filter(sScore => sScore.id !== score.id))
              }}>
                {score.event_id in eventMap ? eventMap[score.event_id].name : ''}
              </Button>
            )
          })}
        </FlexContainer>
      </>
    )
  }

  const getNotSelectedEvents = () => {
    if (notSelectedScores.length <= 0) {
      return null;
    }
    return (
      <>
        <FlexContainer className={'withGap'}>
          <b>Events left for next time:</b><small className={'text-muted'}>click on below event to be added</small>
        </FlexContainer>
        <FlexContainer className={'withGap wrap space-below'}>
          {notSelectedScores.map(score => {
            return (
              <Button key={score.id} variant={'secondary'} size={'sm'} onClick={() => {
                setSelectedScores([
                  ...selectedScores,
                  score,
                ])
              }}>
                {score.event_id in eventMap ? eventMap[score.event_id].name : ''}
              </Button>
            )
          })}
        </FlexContainer>
      </>
    )
  }

  const getModal = () => {
    if (!isShowing) {
      return null;
    }
    return (
      <PopupModal
        header={<div>Award these points for <b>{student.StudentLegalFullName}</b>?</div>}
        handleClose={() => handleClose()}
        show={true}
        size={'lg'}
        footer={
          <>
            <div>{getIsAwardable() ? null : <b className={'text-danger'}>You can ONLY select {type.points_to_be_awarded} points to be awarded</b>}</div>
            <div>
              <Button variant={'link'} onClick={() => handleClose()}>Cancel</Button>
              <LoadingBtn isLoading={isUpdating} onClick={() => handelAwards()} disabled={!getIsAwardable()}>Confirm</LoadingBtn>
            </div>
          </>
        }
      >
        <>
          <FlexContainer className={'withGap'}>
            <div>FileYear: </div><div><b>{FileYear}</b></div>
          </FlexContainer>
          {getSelectedEvents()}
          {getNotSelectedEvents()}
          <Alert variant={'danger'}>
            <b>Action can NOT be reversed:</b> you can NOT remove awards for above points.
          </Alert>
        </>
      </PopupModal>
    )
  }

  if (filteredScores.length <= 0) {
    return null;
  }

  return (
    <Wrapper>
      <LoadingBtn
        size={'sm'}
        className={'showing-btn'}
        isLoading={isShowing}
        onClick={() => setIsShowing(true)}
        disabled={isDisabled}
      >
        Award
      </LoadingBtn>
      {getModal()}
    </Wrapper>
  );
}

export default HouseAwardConfirmAwardPopupBtn;
