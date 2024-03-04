import styled from "styled-components";
import React, { useEffect, useRef, useState } from "react";
import iCampusDisplaySlide from "../../../types/CampusDisplay/iCampusDisplaySlide";
import CampusDisplayDefaultSlide from "./CampusDisplayDefaultSlide";
import { Carousel } from "react-bootstrap";
import moment from "moment-timezone";
import CampusDisplayShowSlide from "./CampusDisplayShowSlide";
import iCampusDisplay from '../../../types/CampusDisplay/iCampusDisplay';

type iCampusDisplaySlideShow = {
  className?: string;
  slides: iCampusDisplaySlide[];
  playList: iCampusDisplay;
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
  slides,
  playList,
  className
}: iCampusDisplaySlideShow) => {
  const defaultSlideShowingTime = 5000;

  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  // @ts-ignore
  const carouselRef = useRef<Carousel>(null);

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

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
        window.location.reload(); // Reload the page
      }, timeUntilMidnight);
    };

    reloadAtMidnight(); // Initial schedule

    return () => {
      reloadTimeOut && clearTimeout(reloadTimeOut);
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isVideoPlaying !== true) {
        carouselRef.current?.next();
      }
    }, playList.settings?.slideInterval || defaultSlideShowingTime);

    return () => {
      clearInterval(intervalId);
    };
  }, [isVideoPlaying, playList.settings?.slideInterval]);

  const handleSlide = (selectedIndex: number, e: any) => {
    setCurrentSlideIndex(selectedIndex);
  };

  const getContent = () => {

    if (slides.length <= 0) {
      return <CampusDisplayDefaultSlide campusDisplay={playList} />;
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
        {slides.map((slide, index) => {
          return (
            <Carousel.Item key={slide.id}>
              <CampusDisplayShowSlide
                slide={slide}
                campusDisplay={playList}
                videoProps={{
                  controls: false,
                  playsinline: true,
                  playing: index === currentSlideIndex,
                  muted: true,
                  onEnded: () => {
                    setIsVideoPlaying(false);
                    setTimeout(() => {
                      carouselRef.current?.next();
                    }, 1000);
                    return;
                  },
                  onBuffer: () => {
                    setIsVideoPlaying(true);
                    return;
                  },
                  onPlay: () => {
                    setIsVideoPlaying(true);
                    return;
                  }
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
