import styled from "styled-components";
import React, { useEffect, useRef, useState } from "react";
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
import CampusDisplayShowSlide from "./CampusDisplayShowSlide";
import iCampusDisplayLocation from "../../../types/CampusDisplay/iCampusDisplayLocation";
import SchoolLogo from '../../SchoolLogo';
import SectionDiv from '../../common/SectionDiv';

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
const CampusDisplaySlideShow = ({
  locationId,
  onCancel,
  onLocationLoaded,
  className
}: iCampusDisplaySlideShowPanel) => {
  const slideShowingTime = 5000;

  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  // @ts-ignore
  const carouselRef = useRef<Carousel>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [cdSlides, setCdSlides] = useState<iCampusDisplaySlide[]>([]);
  const [campusDisplay, setCampusDisplay] = useState<iCampusDisplay | null>(
    null
  );
  const [
    displayLocation,
    setDisplayLocation
  ] = useState<iCampusDisplayLocation | null>(null);

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

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

      const locations = result.data || [];
      if (
        locations.length <= 0 ||
        `${locations[0].displayId || ""}`.trim() === ""
      ) {
        return;
      }

      const location = locations[0];
      const display = location.CampusDisplay;

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
      setDisplayLocation(location || null);
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
    onLocationLoaded && onLocationLoaded(displayLocation);
  }, [displayLocation, onLocationLoaded]);


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
  }, []);

  useEffect(() => {
    if (!displayLocation) {
      return;
    }
    let isCanceled = false;
    const getData = () => {
      return CampusDisplayLocationService.getById(displayLocation.id)
        .then(resp => {
          if (isCanceled) {
            return;
          }
          // console.log('resp', resp, 'displayLocation', displayLocation);
          if (
            `${resp.id || ""}`.trim() === "" ||
            resp.isActive !== true ||
            (resp?.version || 0) <= (displayLocation?.version || 0)
          ) {
            // console.log('here');
            return;
          }

          // console.log('here1');
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
          setTimeout(() => getData(), 30000);
        });
    };

    getData();

    return () => {
      clearTimeout();
      isCanceled = true;
    };
  }, [displayLocation]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isVideoPlaying) {
        carouselRef.current?.next();
      }
    }, slideShowingTime);

    return () => {
      clearInterval(intervalId);
    };
  }, [isVideoPlaying, slideShowingTime]);

  // const handleSlideTransition = () => {
  //   setIsVideoPlaying(true);
  // };

  const handleSlide = (selectedIndex: number, e: any) => {
    setCurrentSlideIndex(selectedIndex);
  };

  const getContent = () => {
    if (isLoading === true) {
      return (
        <FlexContainer
          className={"no-display justify-content-center align-items-center flex-column"}
        >
          <SchoolLogo />
          <SectionDiv>
            <PageLoadingSpinner />
          </SectionDiv>
        </FlexContainer>
      );
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
        activeIndex={currentSlideIndex}
        indicators={false}
        controls={false}
        // onSlide={handleSlideTransition}
        onSelect={handleSlide}
        interval={null} // Disable built-in interval
        variant={"dark"}
        ref={carouselRef}
      >
        {cdSlides.map((slide, index) => {
          return (
            <Carousel.Item key={slide.id}>
              <CampusDisplayShowSlide
                slide={slide}
                campusDisplay={campusDisplay}
                videoProps={{
                  key: currentSlideIndex,
                  autoPlay: currentSlideIndex === index,
                  onEnded: () => {
                    setIsVideoPlaying(false);
                    carouselRef.current?.next();
                  },
                  onPlay: () => setIsVideoPlaying(true)
                }}
              />
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
