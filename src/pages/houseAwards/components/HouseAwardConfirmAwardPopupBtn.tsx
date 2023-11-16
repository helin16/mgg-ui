import iHouseAwardScore from "../../../types/HouseAwards/iHouseAwardScore";
import iHouseAwardEventType from "../../../types/HouseAwards/iHouseAwardEventType";
import iHouseAwardStudentYear from "../../../types/HouseAwards/iHouseAwardStudentYear";
import LoadingBtn from "../../../components/common/LoadingBtn";
import styled from "styled-components";
import { useState } from "react";
import PopupModal from "../../../components/common/PopupModal";
import iVStudent from "../../../types/Synergetic/Student/iVStudent";
import { FlexContainer } from "../../../styles";
import { Alert, Button } from "react-bootstrap";
import HouseAwardScoreService from "../../../services/HouseAwards/HouseAwardScoreService";
import Toaster from "../../../services/Toaster";
import iHouseAwardEvent from "../../../types/HouseAwards/iHouseAwardEvent";
import * as Icons from "react-bootstrap-icons";

type iHouseAwardConfirmAwardPopupBtn = {
  scores: iHouseAwardScore[];
  type: iHouseAwardEventType;
  student: iVStudent;
  events: iHouseAwardEvent[];
  FileYear: number;
  onAwarded: (
    scores: iHouseAwardScore[],
    newStudentYear: iHouseAwardStudentYear
  ) => void;
  isDisabled?: boolean;
};
const Wrapper = styled.div``;
const HouseAwardConfirmAwardPopupBtn = ({
  scores,
  type,
  student,
  FileYear,
  onAwarded,
  events,
  isDisabled
}: iHouseAwardConfirmAwardPopupBtn) => {
  const filteredScores = scores
    .filter((score: iHouseAwardScore) => score.awarded_id === null)
    .sort((score1, score2) => {
      return score1.created_at < score2.created_at ? 1 : -1;
    });
  const eventMap: { [key: number]: iHouseAwardEvent } = events.reduce(
    (map, event) => {
      return { ...map, [event.id]: event };
    },
    {}
  );
  const [isShowing, setIsShowing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedScores, setSelectedScores] = useState<iHouseAwardScore[]>(
    filteredScores.slice(0, type.points_to_be_awarded)
  );

  const handelAwards = () => {
    setIsUpdating(true);
    HouseAwardScoreService.awardScores({
      scoreIds: selectedScores.map(score => score.id),
      StudentID: student.StudentID,
      FileYear: FileYear,
      eventTypeId: type.id
    })
      .then(resp => {
        setIsShowing(false);
        onAwarded(resp.scores, resp.studentYear);
      })
      .catch(err => {
        Toaster.showApiError(err);
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };

  const handleClose = () => {
    setIsShowing(false);
    setSelectedScores(filteredScores.slice(0, type.points_to_be_awarded));
  };

  const getIsAwardable = () => {
    return selectedScores.length === type.points_to_be_awarded;
  };

  const getSelectedEvents = () => {
    const selectedScoreIds = selectedScores.map(score => score.id);
    return (
      <>
        <h6>Events to be awarded:</h6>
        {scores.map(score => {
          return (
            <FlexContainer
              className={
                "cursor-pointer with-gap lg-gap space-below align-items-center"
              }
              key={score.id}
              onClick={() => {
                if (selectedScoreIds.indexOf(score.id) >= 0) {
                  setSelectedScores(
                    selectedScores.filter(sScore => sScore.id !== score.id)
                  );
                } else {
                  setSelectedScores([...selectedScores, score]);
                }
              }}
            >
              {selectedScoreIds.indexOf(score.id) >= 0 ? <Icons.CheckSquareFill className={"text-success"} /> : <Icons.Square className={"text-muted"} />}
              <div>
                {score.event_id in eventMap
                  ? eventMap[score.event_id].name
                  : ""}
              </div>
            </FlexContainer>
          );
        })}
      </>
    );
  };

  const getModal = () => {
    if (!isShowing) {
      return null;
    }
    return (
      <PopupModal
        header={
          <div>
            Please selected the points for <b>{student.StudentLegalFullName}</b> in (<b>{FileYear}</b>)?
          </div>
        }
        handleClose={() => handleClose()}
        show={true}
        size={"lg"}
        footer={
          <FlexContainer className={'justify-content-between full-width align-items-center'}>
            <div className={"text-danger text-left"}>
              <div><b>NOT reversible:</b></div> you can NOT remove awards for
              selected points, after submission.
            </div>

            <div className={"text-right"}>
              <Button variant={"link"} onClick={() => handleClose()}>
                <Icons.XLg /> Cancel
              </Button>
              <LoadingBtn
                isLoading={isUpdating}
                onClick={() => handelAwards()}
                disabled={!getIsAwardable()}
              >
                <Icons.Send /> Confirm
              </LoadingBtn>
            </div>
          </FlexContainer>
        }
      >
        <>
          {getSelectedEvents()}

          {getIsAwardable() ? null : (
            <Alert variant={'danger'}>
              You have to select {type.points_to_be_awarded} points and ONLY {type.points_to_be_awarded} points to be
              awarded
            </Alert>
          )}
        </>
      </PopupModal>
    );
  };

  if (filteredScores.length <= 0) {
    return null;
  }

  return (
    <Wrapper>
      <LoadingBtn
        size={"sm"}
        className={"showing-btn"}
        isLoading={isShowing}
        onClick={() => setIsShowing(true)}
        disabled={isDisabled}
      >
        Award
      </LoadingBtn>
      {getModal()}
    </Wrapper>
  );
};

export default HouseAwardConfirmAwardPopupBtn;
