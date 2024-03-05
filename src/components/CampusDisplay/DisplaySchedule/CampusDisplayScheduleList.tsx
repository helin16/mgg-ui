import styled from "styled-components";
import Table, { iTableColumn } from "../../common/Table";
import iCampusDisplay from "../../../types/CampusDisplay/iCampusDisplay";
import {Alert, Button} from "react-bootstrap";
import React, { useEffect, useState } from "react";
import Toaster, {TOAST_TYPE_SUCCESS} from "../../../services/Toaster";
import CampusDisplayScheduleService from "../../../services/CampusDisplay/CampusDisplayScheduleService";
import PageLoadingSpinner from "../../common/PageLoadingSpinner";
import CampusDisplayScheduleEditPopupBtn from "./CampusDisplayScheduleEditPopupBtn";
import * as Icons from "react-bootstrap-icons";
import MathHelper from "../../../helper/MathHelper";
import iCampusDisplaySchedule from "../../../types/CampusDisplay/iCampusDisplaySchedule";
import {FlexContainer} from '../../../styles';
import moment from 'moment-timezone';
import UtilsService from '../../../services/UtilsService';
import DeleteConfirmPopupBtn from '../../common/DeleteConfirm/DeleteConfirmPopupBtn';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/makeReduxStore';

const Wrapper = styled.div``;

type iCampusDisplayScheduleList = {
  locationId: string;
  onSelected?: (playList: iCampusDisplay) => void;
};
const CampusDisplayScheduleList = ({
  locationId,
  onSelected
}: iCampusDisplayScheduleList) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [schedules, setSchedules] = useState<iCampusDisplaySchedule[]>([]);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    CampusDisplayScheduleService.getAll({
      where: JSON.stringify({
        isActive: true
      }),
      sort: "startDate:ASC,startTime:ASC",
      perPage: 999999,
      include: "CampusDisplay"
    })
      .then(resp => {
        if (isCancelled === true) {
          return;
        }
        setSchedules(resp.data || []);
      })
      .catch(err => {
        if (isCancelled === true) {
          return;
        }
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCancelled === true) {
          return;
        }
        setIsLoading(false);
      });
    return () => {
      isCancelled = true;
    };
  }, [locationId, count]);

  const getContent = () => {
    if (isLoading === true) {
      return <PageLoadingSpinner />;
    }
    return (
      <Table
        hover
        rows={schedules.filter(schedule => schedule.CampusDisplay)}
        columns={[
          {
            key: "playlist",
            header: (col: iTableColumn) => {
              return <th key={col.key}>Play List </th>;
            },
            cell: (col, data: iCampusDisplaySchedule) => {
              return (
                <td key={col.key}>
                  <Button
                    variant={"link"}
                    size={"sm"}
                    onClick={() => data.CampusDisplay && onSelected && onSelected(data.CampusDisplay)}
                  >
                    {data.CampusDisplay?.name}
                  </Button>{" "}
                </td>
              );
            }
          },
          {
            key: "operations",
            header: (col: iTableColumn) => {
              return (
                <th key={col.key} className={"text-right"}>
                  <CampusDisplayScheduleEditPopupBtn
                    size={"sm"}
                    variant={"success"}
                    locationId={locationId}
                    onSaved={() => {
                      setCount(MathHelper.add(count, 1));
                    }}
                  >
                    <Icons.Plus /> List
                  </CampusDisplayScheduleEditPopupBtn>
                </th>
              );
            },
            cell: (col, data: iCampusDisplaySchedule) => {
              return (
                <td key={col.key}>
                  <FlexContainer className={'justify-content-between align-items-start'}>
                    <div>
                      <FlexContainer className={'with-gap lg-gap'}>
                        <b>Date: </b>
                        <FlexContainer className={'with-gap'}>
                          <div>{moment(data.startDate).format('DD MMM YYYY')}</div>
                          <div>~</div>
                          <div>{data.endDate ? moment(data.endDate).format('DD MMM YYYY') : null}</div>
                        </FlexContainer>

                      </FlexContainer>
                      <FlexContainer className={'with-gap lg-gap'}>
                        <b>Time: </b>
                        <FlexContainer className={'with-gap'}>
                          <div>{moment(data.startTime).format('HH:mm:ss')}</div>
                          <div>~</div>
                          <div>{data.endTime ? moment(data.endTime).format('HH:mm:ss') : null}</div>
                        </FlexContainer>

                      </FlexContainer>
                      <FlexContainer className={'with-gap lg-gap'}>
                        <b>Day: </b>
                        <FlexContainer className={'with-gap'}>
                          {UtilsService.getWeekDaysShort().map(day => {
                            // @ts-ignore
                            return day in data && data[day] === true ? <small key={day}>{day.toUpperCase()}</small> : null
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
                        onSaved={() => {
                          setCount(MathHelper.add(count, 1));
                        }}
                      >
                        <Icons.Pencil />
                      </CampusDisplayScheduleEditPopupBtn>
                      {' '}
                      <DeleteConfirmPopupBtn
                        variant={"danger"}
                        deletingFn={() =>
                          CampusDisplayScheduleService.deactivate(data.id || "")
                        }
                        deletedCallbackFn={() => {
                          setCount(MathHelper.add(count, 1));
                          Toaster.showToast("Schedule Deleted.", TOAST_TYPE_SUCCESS);
                        }}
                        size={"sm"}
                        description={
                          <>
                            You are about to delete the Schedule.<Alert variant={'danger'}>You are NOT deleting the play list</Alert>
                          </>
                        }
                        confirmString={`${user?.synergyId || "na"}`}
                      >
                        <Icons.Trash />
                      </DeleteConfirmPopupBtn>
                    </div>
                  </FlexContainer>
                </td>
              );
            }
          }
        ]}
      />
    );
  };

  return <Wrapper>{getContent()}</Wrapper>;
};

export default CampusDisplayScheduleList;
