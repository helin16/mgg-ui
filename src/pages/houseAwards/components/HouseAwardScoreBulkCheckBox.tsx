import iHouseAwardEvent from "../../../types/HouseAwards/iHouseAwardEvent";
import iHouseAwardEventType from "../../../types/HouseAwards/iHouseAwardEventType";
import iHouseAwardScore from "../../../types/HouseAwards/iHouseAwardScore";
import React, { useEffect } from "react";
import * as Icons from "react-bootstrap-icons";
import styled from "styled-components";
import HouseAwardScoreService from "../../../services/HouseAwards/HouseAwardScoreService";
import Toaster from "../../../services/Toaster";
import { Spinner } from "react-bootstrap";

type iStudentEventScoreMap = {
  [key: number]: { [key: number]: iHouseAwardScore };
};

type iHouseAwardScoreBulkCheckBox = {
  event: iHouseAwardEvent;
  eventType: iHouseAwardEventType;
  fileYear: number;
  isDisabled?: boolean;
  studentEventScoreMap: iStudentEventScoreMap;
  studentIds: number[];
  onAddedScores: (newScores: iHouseAwardScore[]) => void;
  onDeletedScores: (deletedScores: iHouseAwardScore[]) => void;
  forceReload?: number;
};

const Wrapper = styled.div`
  padding: 4px 0px;
  .check-icon {
    cursor: pointer;
  }
`;

const HouseAwardScoreBulkCheckBox = ({
  studentIds,
  event,
  eventType,
  fileYear,
  forceReload = 0,
  studentEventScoreMap,
  onAddedScores,
  onDeletedScores
}: iHouseAwardScoreBulkCheckBox) => {
  const [isChanging, setIsChanging] = React.useState(false);
  const [notCheckedStudentIds, setNotCheckedStudentIds] = React.useState<
    number[]
  >([]);
  const [awardedStudentIds, setAwardedStudentIds] = React.useState<number[]>(
    []
  );
  const [changableScoreIds, setChangableScoreIds] = React.useState<number[]>(
    []
  );
  useEffect(() => {
    const studentIdWithSameEvent = Object.keys(studentEventScoreMap)
      .filter(studentId => {
        // @ts-ignore
        return event.id in studentEventScoreMap[studentId];
      })
      .map(studentId => Number(studentId));

    const studentIdsAwarded = studentIdWithSameEvent.filter(studentId => {
      return (
        `${studentEventScoreMap[studentId][event.id].awarded_at ||
          ""}`.trim() !== ""
      );
    });

    setNotCheckedStudentIds(
      studentIds.filter(
        studentId => studentIdWithSameEvent.indexOf(studentId) < 0
      )
    );
    setAwardedStudentIds(studentIdsAwarded);
    const chgableScoreIds =
      Object.keys(studentEventScoreMap)
        .map(studentId => {
          if (
            // @ts-ignore
            event.id in studentEventScoreMap[studentId] &&
            // @ts-ignore
            `${studentEventScoreMap[studentId][event.id].awarded_at ||
            ""}`.trim() === ""
          ) {
            return Number(
              // @ts-ignore
              `${studentEventScoreMap[studentId][event.id].id || ""}`.trim()
            );
          }
          return null;
        })
        .filter(scoreId => `${scoreId || ""}`.trim() !== "");
    // @ts-ignore
    setChangableScoreIds(chgableScoreIds);
  }, [studentIds, event, eventType, forceReload, studentEventScoreMap]);

  const handleOnChange = (checked: boolean) => {
    setIsChanging(true);
    if (checked === true) {
      const newStudentIds = notCheckedStudentIds.filter(
        studentId => awardedStudentIds.indexOf(studentId) < 0
      );
      Promise.all(
        newStudentIds.map(studentId => {
          return HouseAwardScoreService.createScore({
            FileYear: `${fileYear}`,
            StudentID: `${studentId}`,
            event_id: `${event.id}`,
            event_type_id: `${eventType.id}`,
            score: "1"
          });
        })
      )
        .then(resp => {
          setIsChanging(false);
          onAddedScores(resp);
        })
        .catch(err => {
          Toaster.showApiError(err);
          setIsChanging(false);
        });
      return;
    }

    Promise.all(
      changableScoreIds.map(scoreId => {
        return HouseAwardScoreService.deleteScore(scoreId);
      })
    )
      .then(resp => {
        setIsChanging(false);
        onDeletedScores(resp);
      })
      .catch(err => {
        Toaster.showApiError(err);
        setIsChanging(false);
      });
  };

  const getContent = () => {
    if (isChanging === true) {
      return <Spinner size={"sm"} />;
    }

    if (notCheckedStudentIds.length <= 0) {
      return (
        <Icons.CheckSquareFill
          className={"check-icon text-primary"}
          onClick={() => handleOnChange(false)}
        />
      );
    }

    return (
      <Icons.Square
        className={"check-icon"}
        onClick={() => handleOnChange(true)}
      />
    );
  };

  return <Wrapper>{getContent()}</Wrapper>;
};

export default HouseAwardScoreBulkCheckBox;
