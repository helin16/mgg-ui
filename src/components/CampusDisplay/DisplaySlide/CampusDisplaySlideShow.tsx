import styled from "styled-components";
import React, { useEffect, useState } from "react";
import iCampusDisplaySlide from "../../../types/CampusDisplay/iCampusDisplaySlide";
import CampusDisplayDefaultSlide from "./CampusDisplayDefaultSlide";
import iCampusDisplay from "../../../types/CampusDisplay/iCampusDisplay";
import CampusDisplaySlideService from "../../../services/CampusDisplay/CampusDisplaySlideService";
import Toaster from "../../../services/Toaster";
import PageLoadingSpinner from "../../common/PageLoadingSpinner";
import { Button, Carousel } from "react-bootstrap";
import MathHelper from "../../../helper/MathHelper";
import CampusDisplayLocationService from "../../../services/CampusDisplay/CampusDisplayLocationService";
import Page401 from "../../Page401";
import { FlexContainer } from "../../../styles";
import moment from "moment-timezone";
import CampusDisplayShowSlide from './CampusDisplayShowSlide';

type iCampusDisplaySlideShowPanel = {
  locationId: string;
  className?: string;
  onCancel?: () => void;
};

const Wrapper = styled.div`
  background-color: black;
    
  .carousel-item {
    width: 100vw !important;
    height: 100vh !important;
  }

  .no-display {
    height: 100%;
    background-color: white;
  }
`;
const CampusDisplaySlideShow = ({
  locationId,
  onCancel,
  className
}: iCampusDisplaySlideShowPanel) => {
  const slideShowingTime = 5000;
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [cdSlides, setCdSlides] = useState<iCampusDisplaySlide[]>([]);
  const [campusDisplay, setCampusDisplay] = useState<iCampusDisplay | null>(
    null
  );

  useEffect(() => {
    let isCanceled = false;

    const getData = async () => {
      const result = await CampusDisplayLocationService.getAll({
        where: JSON.stringify({
          isActive: true,
          id: locationId
        }),
        perPage: 1,
        include: "CampusDisplay"
      });

      const displays = result.data || [];
      if (
        displays.length <= 0 ||
        `${displays[0].displayId || ""}`.trim() === ""
      ) {
        return;
      }

      const display = displays[0].CampusDisplay;

      const slidesFromDB =
        (
          await CampusDisplaySlideService.getAll({
            where: JSON.stringify({
              isActive: true,
              displayId: `${display?.id || ""}`.trim()
            }),
            include: "Asset",
            perPage: 999999,
            sort: "sortOrder:ASC"
          })
        ).data || [];

      if (isCanceled) {
        return;
      }

      setCampusDisplay(display || null);
      const slideIdsFromDB = slidesFromDB.map(slide => slide.id);
      setCdSlides(prevSlides => {
        const currentSlideIds = prevSlides.map(slide => slide.id);
        if (currentSlideIds !== slideIdsFromDB) {
          return slidesFromDB;
        }
        return prevSlides;
      });
    };

    if (count <= 0) {
      setIsLoading(true);
    }
    getData()
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
  }, [locationId, count]);

  useEffect(() => {
    const calculateTimeUntilMidnight = () => {
      const now = moment();
      const midnight = moment().endOf("day");

      return midnight.diff(now);
    };

    const reloadAtMidnight = () => {
      const timeUntilMidnight = calculateTimeUntilMidnight();

      setTimeout(() => {
        window.location.reload(); // Reload the page
      }, timeUntilMidnight);
    };

    reloadAtMidnight(); // Initial schedule

    // Update count every 10 minutes to ensure that reloadAtMidnight is called at midnight
    const dbRefreshInterval = setInterval(() => {
      setCount(prevCount => {
        const newCount = MathHelper.add(prevCount, 1);
        return newCount > 10 ? 1 : newCount;
      });
    }, 600000); // every 10 minutes

    return () => {
      clearInterval(dbRefreshInterval);
    };
  }, []);

  const getContent = () => {
    if (isLoading === true) {
      return <PageLoadingSpinner />;
    }

    if (!campusDisplay || `${campusDisplay?.id || ""}`.trim() === "") {
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
      return <CampusDisplayDefaultSlide campusDisplay={campusDisplay} />;
    }

    return (
      <Carousel
        pause={false}
        indicators={false}
        fade={true}
        controls={false}
        interval={slideShowingTime}
        variant={"dark"}
      >
        {cdSlides.map(slide => {
          return (
            <Carousel.Item key={slide.id}>
              <CampusDisplayShowSlide slide={slide} campusDisplay={campusDisplay} />
            </Carousel.Item>
          );
        })}
      </Carousel>
    );
  };

  return (
    <Wrapper className={`slide-wrapper ${className || ""}`}>
      {getContent()}
    </Wrapper>
  );
};

export default CampusDisplaySlideShow;
