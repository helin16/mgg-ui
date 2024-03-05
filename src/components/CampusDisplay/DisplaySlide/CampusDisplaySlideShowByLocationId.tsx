import styled from "styled-components";
import React, { useCallback, useEffect, useState } from "react";
import iCampusDisplaySlide from "../../../types/CampusDisplay/iCampusDisplaySlide";
import CampusDisplayDefaultSlide from "./CampusDisplayDefaultSlide";
import CampusDisplaySlideService from "../../../services/CampusDisplay/CampusDisplaySlideService";
import Toaster, { TOAST_TYPE_SUCCESS } from "../../../services/Toaster";
import PageLoadingSpinner from "../../common/PageLoadingSpinner";
import { Button } from "react-bootstrap";
import MathHelper from "../../../helper/MathHelper";
import CampusDisplayLocationService from "../../../services/CampusDisplay/CampusDisplayLocationService";
import Page401 from "../../Page401";
import { FlexContainer } from "../../../styles";
import moment from "moment-timezone";
import iCampusDisplayLocation from "../../../types/CampusDisplay/iCampusDisplayLocation";
import SchoolLogo from "../../SchoolLogo";
import SectionDiv from "../../common/SectionDiv";
import CampusDisplaySlideShow from "./CampusDisplaySlideShow";
import CampusDisplayScheduleService from "../../../services/CampusDisplay/CampusDisplayScheduleService";
import {OP_LTE} from "../../../helper/ServiceHelper";
import * as _ from "lodash";
import iCampusDisplaySchedule from '../../../types/CampusDisplay/iCampusDisplaySchedule';

type iCampusDisplaySlideShowPanel = {
  locationId: string;
  className?: string;
  onCancel?: () => void;
  onLocationLoaded?: (location: iCampusDisplayLocation | null) => void;
};

const Wrapper = styled.div`
  background-color: transparent;
  height: 100%;
  max-height: 100vh !important;

  .carousel-item {
    width: 100%;
    height: 100%;
  }

  .no-display {
    height: 100%;
    background-color: white;
  }
`;

const CampusDisplaySlideShowByLocationId = ({
  locationId,
  onCancel,
  onLocationLoaded,
  className
}: iCampusDisplaySlideShowPanel) => {
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [cdSlides, setCdSlides] = useState<iCampusDisplaySlide[]>([]);
  const [playListIds, setPlayListIds] = useState<string[]>([]);
  const [
    displayLocation,
    setDisplayLocation
  ] = useState<iCampusDisplayLocation | null>(null);

  const filterScheduleToBeCurrent = (schedule: iCampusDisplaySchedule) => {
    if (moment(schedule.startDate).isAfter(moment().endOf('day'))) {
      return false;
    }

    if (schedule.endDate && moment(schedule.endDate).isBefore(moment().startOf('day'))) {
      return false;
    }

    const weekDay = moment().format('dddd').substring(0,3).toLowerCase();
    // @ts-ignore
    // console.log('weekDay', weekDay, schedule[weekDay], !(weekDay in schedule) || schedule[weekDay] !== true);
    // @ts-ignore
    if(!(weekDay in schedule) || schedule[weekDay] !== true) {
      return false;
    }

    const timeFormat = 'HH:mm';
    if (schedule.startTime && moment(schedule.startTime).format(timeFormat) > moment().format(timeFormat)) {
      return false;
    }

    if (schedule.endTime && moment(schedule.endTime).format(timeFormat) < moment().format(timeFormat)) {
      return false;
    }
    return true;
  }

  const getSlidesFromDB = useCallback(async () => {
    const result = await Promise.all([
      CampusDisplayLocationService.getAll({
        where: JSON.stringify({
          isActive: true,
          id: locationId
        }),
        perPage: 1
      }),
      CampusDisplayScheduleService.getAll({
        where: JSON.stringify({
          isActive: true,
          locationId,
          // just trying to cover all in case of UTC time.
          startDate: { [OP_LTE]: moment().add(1, 'day').format("YYYY-MM-DD") }
        }),
        perPage: 999999
      })
    ]);

    const locations = result[0].data || [];
    const schedules = result[1].data || [];
    console.log('schedules', schedules);
    if (locations.length <= 0) {
      return;
    }

    const location = locations[0];
    const playListIds = [
      ..._.uniq(schedules.filter(filterScheduleToBeCurrent).map(schedule => schedule.displayId)),
      location.displayId || ""
    ].filter(id => `${id || ""}`.trim() !== "");

    const slidesFromDB =
      (
        await CampusDisplaySlideService.getAll({
          where: JSON.stringify({
            isActive: true,
            displayId: playListIds
          }),
          include: "Asset",
          perPage: 999999,
          sort: "sortOrder:ASC"
        })
      ).data || [];

    setDisplayLocation(location || null);
    setPlayListIds(playListIds);

    const slideIdsFromDB = slidesFromDB.map(slide => slide.id);
    setCdSlides(prevSlides => {
      const currentSlideIds = prevSlides.map(slide => slide.id);
      if (currentSlideIds !== slideIdsFromDB) {
        return slidesFromDB;
      }
      return prevSlides;
    });
  }, [locationId]);

  useEffect(() => {
    let isCanceled = false;

    if (count <= 0) {
      setIsLoading(true);
    }
    getSlidesFromDB()
      .catch(err => {
        if (isCanceled) {
          return;
        }
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) {
          return;
        }
        setIsLoading(false);
      });

    return () => {
      isCanceled = true;
    };
  }, [locationId, count, getSlidesFromDB]);

  useEffect(() => {
    onLocationLoaded && onLocationLoaded(displayLocation);
  }, [displayLocation, onLocationLoaded]);

  const reloadWindow = () => {
    window.location.reload(); // Reload the page
  };

  useEffect(() => {
    let reloadTimeOut: NodeJS.Timeout | null = null;
    const calculateTimeUntilMidnight = () => {
      const now = moment();
      const midnight = moment().endOf("day");

      return midnight.diff(now);
    };

    const reloadAtMidnight = () => {
      const timeUntilMidnight = calculateTimeUntilMidnight();

      reloadTimeOut = setTimeout(() => {
        reloadWindow(); // Reload the page
      }, timeUntilMidnight);
    };

    reloadAtMidnight(); // Initial schedule

    return () => {
      reloadTimeOut && clearTimeout(reloadTimeOut);
    };
  }, []);

  useEffect(() => {
    let reloadTimeOut: NodeJS.Timeout | null = null;
    const calculateTimeUntilMidnight = () => {
      const now = moment();
      const midnight = moment().endOf("day");

      return midnight.diff(now);
    };

    const reloadAtMidnight = () => {
      const timeUntilMidnight = calculateTimeUntilMidnight();

      reloadTimeOut = setTimeout(() => {
        reloadWindow(); // Reload the page
      }, timeUntilMidnight);
    };

    reloadAtMidnight(); // Initial schedule

    return () => {
      reloadTimeOut && clearTimeout(reloadTimeOut);
    };
  }, []);

  useEffect(() => {
    if (!displayLocation) {
      return;
    }
    let isCanceled = false;
    let timeout: NodeJS.Timeout | null = null;
    const getData = () => {
      return CampusDisplayLocationService.getById(displayLocation.id)
        .then(resp => {
          if (isCanceled) {
            return;
          }
          if (
            `${resp.id || ""}`.trim() === "" ||
            resp.isActive !== true ||
            (resp?.version || 0) <= (displayLocation?.version || 0)
          ) {
            return;
          }
          if (
            (resp.settings?.forceReload || 0) > (displayLocation?.version || 0)
          ) {
            Toaster.showToast("Reloaded", TOAST_TYPE_SUCCESS);
            reloadWindow();
            return;
          }
          setCount(prev => MathHelper.add(prev, 1));
          return;
        })
        .catch(() => {
          // don't do anything when you catch an error
        })
        .finally(() => {
          if (isCanceled) {
            return;
          }
          timeout = setTimeout(() => getData(), 1000);
        });
    };

    getData();

    return () => {
      timeout && clearTimeout(timeout);
      isCanceled = true;
    };
  }, [displayLocation]);

  const getContent = () => {
    if (isLoading === true) {
      return (
        <FlexContainer
          className={
            "no-display justify-content-center align-items-center flex-column"
          }
        >
          <SchoolLogo />
          <SectionDiv>
            <PageLoadingSpinner />
          </SectionDiv>
        </FlexContainer>
      );
    }

    if (playListIds.length <= 0) {
      return (
        <FlexContainer
          className={"no-display justify-content-center align-items-center"}
        >
          <Page401
            title={"Can NOT find the campus display related to this location"}
            btns={
              <Button
                variant={"primary"}
                onClick={() => onCancel && onCancel()}
              >
                Select again
              </Button>
            }
          />
        </FlexContainer>
      );
    }

    if (cdSlides.length <= 0) {
      return <CampusDisplayDefaultSlide />;
    }

    return <CampusDisplaySlideShow slides={cdSlides} />;
  };

  return (
    <Wrapper className={`slide-wrapper ${className || ""}`}>
      {getContent()}
    </Wrapper>
  );
};

export default CampusDisplaySlideShowByLocationId;
