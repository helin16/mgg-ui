import styled from "styled-components";
import Table, { iTableColumn } from "../../common/Table";
import iCampusDisplay from "../../../types/CampusDisplay/iCampusDisplay";
import { Alert, Button } from "react-bootstrap";
import React, {useCallback} from "react";
import Toaster, { TOAST_TYPE_SUCCESS } from "../../../services/Toaster";
import CampusDisplayScheduleService from "../../../services/CampusDisplay/CampusDisplayScheduleService";
import PageLoadingSpinner from "../../common/PageLoadingSpinner";
import CampusDisplayScheduleEditPopupBtn from "./CampusDisplayScheduleEditPopupBtn";
import * as Icons from "react-bootstrap-icons";
import iCampusDisplaySchedule from "../../../types/CampusDisplay/iCampusDisplaySchedule";
import { FlexContainer } from "../../../styles";
import moment from "moment-timezone";
import UtilsService from "../../../services/UtilsService";
import DeleteConfirmPopupBtn from "../../common/DeleteConfirm/DeleteConfirmPopupBtn";
import useListCrudHook from '../../hooks/useListCrudHook/useListCrudHook';

const Wrapper = styled.div``;

type iCampusDisplayScheduleList = {
  locationId: string;
  onSelected?: (playList: iCampusDisplay) => void;
};
const CampusDisplayScheduleList = ({
  locationId,
  onSelected
}: iCampusDisplayScheduleList) => {
  const {state, onRefreshOnCurrentPage, onRefresh} = useListCrudHook<iCampusDisplaySchedule>({
    getFn: useCallback((config) => {
      const {sort, filter, ...props} = (config || {});
      return CampusDisplayScheduleService.getAll({
        where: JSON.stringify({
          ...filter,
          isActive: true,
          locationId
        }),
        sort: sort || "startDate:ASC,startTime:ASC",
        perPage: 999999,
        include: "CampusDisplay",
        ...props
      })
    }, [locationId]),
  })

  const getListTable = <T extends {}>(
    schs: iCampusDisplaySchedule[],
    title: any,
    canCreate = false
  ) => {
    const columns = [
      {
        key: "playlist",
        header: (col: iTableColumn<T>) => {
          return <th key={col.key}>{title}</th>;
        },
        cell: (col: iTableColumn<T>, data: iCampusDisplaySchedule) => {
          return (
            <td key={col.key}>
              {onSelected ? (
                <Button
                  variant={"link"}
                  size={"sm"}
                  onClick={() =>
                    data.CampusDisplay &&
                    onSelected &&
                    onSelected(data.CampusDisplay)
                  }
                >
                  {data.CampusDisplay?.name}
                </Button>
              ) : (
                `${data.CampusDisplay?.name || ""}`
              )}
            </td>
          );
        }
      },
      {
        key: "operations",
        header: (col: iTableColumn<T>) => {
          return (
            <th key={col.key} className={"text-right"}>
              {canCreate === true ? (
                <CampusDisplayScheduleEditPopupBtn
                  size={"sm"}
                  variant={"success"}
                  locationId={locationId}
                  onSaved={() => onRefreshOnCurrentPage()}
                >
                  <Icons.Plus /> List
                </CampusDisplayScheduleEditPopupBtn>
              ) : null}
            </th>
          );
        },
        cell: (col: iTableColumn<T>, data: iCampusDisplaySchedule) => {
          return (
            <td key={col.key}>
              <FlexContainer
                className={"justify-content-between align-items-start"}
              >
                <div>
                  <FlexContainer className={"with-gap lg-gap"}>
                    <b>Date: </b>
                    <FlexContainer className={"with-gap"}>
                      <div>
                        {moment(data.startDate).format("DD MMM YYYY")}
                      </div>
                      <div>~</div>
                      <div>
                        {data.endDate
                          ? moment(data.endDate).format("DD MMM YYYY")
                          : null}
                      </div>
                    </FlexContainer>
                  </FlexContainer>
                  <FlexContainer className={"with-gap lg-gap"}>
                    <b>Time: </b>
                    <FlexContainer className={"with-gap"}>
                      {data.startTime || data.endTime ? (
                        <>
                          <div>
                            {data.startTime
                              ? moment(data.startTime).format("HH:mm:ss")
                              : null}
                          </div>
                          <div>~</div>
                          <div>
                            {data.endTime
                              ? moment(data.endTime).format("HH:mm:ss")
                              : null}
                          </div>
                        </>
                      ) : null}
                    </FlexContainer>
                  </FlexContainer>
                  <FlexContainer className={"with-gap lg-gap"}>
                    <b>Day: </b>
                    <FlexContainer className={"with-gap"}>
                      {UtilsService.getWeekDaysShort().map(day => {
                        // @ts-ignore
                        return day in data && data[day] === true ? (
                          <small key={day}>{day.toUpperCase()}</small>
                        ) : null;
                      })}
                    </FlexContainer>
                  </FlexContainer>
                </div>
                <div>
                  <CampusDisplayScheduleEditPopupBtn
                    size={"sm"}
                    variant={"secondary"}
                    locationId={locationId}
                    schedule={data}
                    onSaved={() => onRefreshOnCurrentPage()}
                  >
                    <Icons.Pencil />
                  </CampusDisplayScheduleEditPopupBtn>{" "}
                  <DeleteConfirmPopupBtn
                    variant={"danger"}
                    deletingFn={() =>
                      CampusDisplayScheduleService.deactivate(data.id || "")
                    }
                    deletedCallbackFn={() => {
                      Toaster.showToast(
                        "Schedule Deleted.",
                        TOAST_TYPE_SUCCESS
                      );
                      onRefresh()
                    }}
                    size={"sm"}
                    description={
                      <>
                        You are about to delete the Schedule.
                        <Alert variant={"danger"}>
                          You are NOT deleting the play list
                        </Alert>
                      </>
                    }
                  >
                    <Icons.Trash />
                  </DeleteConfirmPopupBtn>
                </div>
              </FlexContainer>
            </td>
          );
        }
      }
    ];

    return (
      <Table<iCampusDisplaySchedule>
        hover
        rows={schs}
        columns={columns}
      />
    );
  };

  const getContent = () => {
    if (state.isLoading === true) {
      return <PageLoadingSpinner />;
    }

    const scheduleWithPlayList = (state.data.data || [])
      .filter(schedule => schedule.CampusDisplay)
      .sort((schedule1, schedule2) =>
        `${moment(schedule1.startDate).format("YYYY-MM-DD")}${
          schedule1.startTime
            ? moment(schedule1.startTime).format("HH:mm:ss")
            : ""
        }` >
        `${moment(schedule2.startDate).format("YYYY-MM-DD")}${
          schedule2.startTime
            ? moment(schedule2.startTime).format("HH:mm:ss")
            : ""
        }`
          ? 1
          : -1
      );
    const pastList = scheduleWithPlayList.filter(
      schedule =>
        schedule.endDate && moment(schedule.endDate).isBefore(moment().startOf('day'))
    );
    const pastListIds = pastList.map(s => s.id);
    const currentList = scheduleWithPlayList.filter(
      schedule => pastListIds.indexOf(schedule.id) < 0
    );

    return (
      <>
        {getListTable<iCampusDisplaySchedule>(currentList, "Play List", true)}
        {pastList.length > 0
          ? getListTable(pastList, <b className={"text-danger"}>Past</b>)
          : null}
      </>
    );
  };

  return <Wrapper>{getContent()}</Wrapper>;
};

export default CampusDisplayScheduleList;
