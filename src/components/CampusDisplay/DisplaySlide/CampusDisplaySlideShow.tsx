import styled from "styled-components";
import React, { useEffect, useRef, useState } from "react";
import iCampusDisplaySlide from "../../../types/CampusDisplay/iCampusDisplaySlide";
import CampusDisplayDefaultSlide from "./CampusDisplayDefaultSlide";
import { Carousel } from "react-bootstrap";
import CampusDisplayShowSlide from "./CampusDisplayShowSlide";

type iCampusDisplaySlideShow = {
  className?: string;
  slides: iCampusDisplaySlide[];
  onError?: () => void;
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
  className,
  onError,
}: iCampusDisplaySlideShow) => {
  const defaultSlideShowingTime = 8000;

  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  // @ts-ignore
  const carouselRef = useRef<Carousel>(null);

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isVideoPlaying !== true) {
        carouselRef.current?.next();
      }
    }, defaultSlideShowingTime);

    return () => {
      clearInterval(intervalId);
    };
  }, [isVideoPlaying]);

  const handleSlide = (selectedIndex: number, e: any) => {
    setCurrentSlideIndex(selectedIndex);
  };

  const getContent = () => {

    if (slides.length <= 0) {
      return <CampusDisplayDefaultSlide />;
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
                videoProps={{
                  controls: true,
                  // playsinline: true,
                  playing: index === currentSlideIndex,
                  muted: true,
                  onEnded: () => {
                    setIsVideoPlaying(false);
                    setTimeout(() => {
                      carouselRef.current?.next();
                    }, 300);
                    return;
                  },
                  onBuffer: () => {
                    setIsVideoPlaying(true);
                    return;
                  },
                  onPlay: () => {
                    setIsVideoPlaying(true);
                    return;
                  },
                  onError: () => {
                    onError && onError();
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
