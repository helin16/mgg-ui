import iHouseAwardScore from "../../../types/HouseAwards/iHouseAwardScore";
import iHouseAwardEventType from "../../../types/HouseAwards/iHouseAwardEventType";
import iHouseAwardStudentYear from "../../../types/HouseAwards/iHouseAwardStudentYear";
import LoadingBtn from "../../../components/common/LoadingBtn";
import { useState } from "react";
import PopupModal from "../../../components/common/PopupModal";
import iVStudent from "../../../types/Synergetic/Student/iVStudent";
import { FlexContainer } from "../../../styles";
import { Alert, Button, ButtonProps } from "react-bootstrap";
import HouseAwardScoreService from "../../../services/HouseAwards/HouseAwardScoreService";
import Toaster, { TOAST_TYPE_SUCCESS } from "../../../services/Toaster";
import iHouseAwardEvent from "../../../types/HouseAwards/iHouseAwardEvent";
import IconDisplay from "../../../components/IconDisplay";
import Table, { iTableColumn } from "../../../components/common/Table";

type iHouseAwardConfirmAwardPopupBtn = ButtonProps & {
  viewOnly?: boolean;
  scores: iHouseAwardScore[];
  eventType: iHouseAwardEventType;
  student: iVStudent;
  events: iHouseAwardEvent[];
  FileYear: number;
  onAwarded: (
    scores: iHouseAwardScore[],
    newStudentYear: iHouseAwardStudentYear
  ) => void;
  isDisabled?: boolean;
};
const HouseAwardConfirmAwardPopupBtn = ({
  scores,
  eventType,
  student,
  FileYear,
  onAwarded,
  events,
  isDisabled,
  viewOnly = false,
  ...props
}: iHouseAwardConfirmAwardPopupBtn) => {
  const filteredScores = scores
    .filter((score: iHouseAwardScore) => score.awarded_id === null)
    .sort((score1, score2) => {
      return score1.created_at < score2.created_at ? -1 : 1;
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
    viewOnly === true
      ? []
      : filteredScores.slice(0, eventType.points_to_be_awarded)
  );

  const handelAwards = () => {
    setIsUpdating(true);
    HouseAwardScoreService.awardScores({
      scoreIds: selectedScores.map(score => score.id),
      StudentID: student.StudentID,
      FileYear: FileYear,
      eventTypeId: eventType.id
    })
      .then(resp => {
        setIsShowing(false);
        setIsUpdating(false);
        Toaster.showToast("Awarded successfully.", TOAST_TYPE_SUCCESS);
        onAwarded(resp.scores, resp.studentYear);
      })
      .catch(err => {
        Toaster.showApiError(err);
      });
  };

  const handleClose = () => {
    setIsShowing(false);
    setSelectedScores(filteredScores.slice(0, eventType.points_to_be_awarded));
  };

  const getIsAwardable = () => {
    return selectedScores.length === eventType.points_to_be_awarded;
  };

  const getEventTable = (scores: iHouseAwardScore[]) => {
    if (scores.length <= 0) {
      return null;
    }

    return (
      <Table
        columns={[
          ...(viewOnly === true
            ? []
            : [
                {
                  key: "options",
                  header: "",
                  cell: (col: iTableColumn, data: iHouseAwardScore) => {
                    const selectedScoreIds = selectedScores.map(
                      score => score.id
                    );
                    return (
                      <td
                        key={col.key}
                        style={{ width: "23px" }}
                        className={"cursor-pointer"}
                        onClick={() => {
                          if (selectedScoreIds.indexOf(data.id) >= 0) {
                            setSelectedScores(
                              selectedScores.filter(
                                sScore => sScore.id !== data.id
                              )
                            );
                          } else {
                            setSelectedScores([...selectedScores, data]);
                          }
                        }}
                      >
                        {selectedScoreIds.indexOf(data.id) >= 0 ? (
                          <IconDisplay
                            name={"CheckSquareFill"}
                            className={"text-success"}
                          />
                        ) : (
                          <IconDisplay
                            name={"Square"}
                            className={"text-muted"}
                          />
                        )}
                      </td>
                    );
                  }
                }
              ]),
          {
            key: "eventYear",
            header: "Year",
            cell: (col: iTableColumn, data: iHouseAwardScore) => {
              return <td key={col.key}>{data.FileYear}</td>;
            }
          },
          {
            key: "eventName",
            header: "Event",
            cell: (col: iTableColumn, data: iHouseAwardScore) => {
              return <td key={col.key}>{eventMap[data.event_id].name}</td>;
            }
          },
          {
            key: "score",
            header: "Score",
            cell: (col: iTableColumn, data: iHouseAwardScore) => {
              return <td key={col.key}>{data.score}</td>;
            }
          }
        ]}
        rows={scores}
        responsive
        hover
      />
    );
  };

  const getModal = () => {
    if (!isShowing) {
      return null;
    }
    return (
      <PopupModal
        header={
          <h6>
            ({filteredScores.length}) Event(s) for <b>{student.StudentLegalFullName}</b> to be awarded:
          </h6>
        }
        handleClose={() => handleClose()}
        show={true}
        size={"lg"}
        footer={
          viewOnly === true ? (
            <Button onClick={() => handleClose()}>OK</Button>
          ) : (
            <FlexContainer
              className={
                "justify-content-between full-width align-items-center"
              }
            >
              <div className={"text-danger text-left"}>
                <div>
                  <b>NOT reversible:</b>
                </div>{" "}
                you can NOT remove awards for selected points, after submission.
              </div>

              <div className={"text-right"}>
                <Button variant={"link"} onClick={() => handleClose()}>
                  <IconDisplay name={"XLg"} /> Cancel
                </Button>
                <LoadingBtn
                  variant={!getIsAwardable() ? "light" : "primary"}
                  isLoading={isUpdating}
                  onClick={() => handelAwards()}
                  disabled={!getIsAwardable()}
                >
                  <IconDisplay name={"Send"} /> Confirm
                </LoadingBtn>
              </div>
            </FlexContainer>
          )
        }
      >
        <>
          {getEventTable(scores)}

          {getIsAwardable() || viewOnly === true ? null : (
            <Alert variant={"danger"}>
              You have to select {eventType.points_to_be_awarded} points and
              ONLY {eventType.points_to_be_awarded} points to be awarded
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
    <>
      <LoadingBtn
        size={"sm"}
        disabled={isDisabled}
        className={"showing-btn"}
        {...props}
        isLoading={isShowing}
        onClick={() => setIsShowing(true)}
      />
      {getModal()}
    </>
  );
};

export default HouseAwardConfirmAwardPopupBtn;
