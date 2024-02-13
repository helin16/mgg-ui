import styled from "styled-components";
import { useEffect, useState } from "react";
import iCampusDisplaySlide from "../../types/CampusDisplay/iCampusDisplaySlide";
import CampusDisplayDefaultSlide from "./CampusDisplayDefaultSlide";
import iCampusDisplay from "../../types/CampusDisplay/iCampusDisplay";
import CampusDisplaySlideService from "../../services/CampusDisplay/CampusDisplaySlideService";
import Toaster from "../../services/Toaster";
import PageLoadingSpinner from "../common/PageLoadingSpinner";
import { Carousel } from "react-bootstrap";

type iCampusDisplaySlideShowPanel = {
  campusDisplay: iCampusDisplay;
  className?: string;
};

const Wrapper = styled.div`
  width: 100vw !important;
  height: 100vh !important;
  background-color: black;

  .showing-slide {
    width: 100vw !important;
    height: 100vh !important;
    img {
      object-fit: contain;
      object-position: center center;
      background-color: black;
      width: 100%;
      height: 100%;
      min-height: 680px;
      filter: none; /* Reset the filter to its default value */
      -webkit-backdrop-filter: none; /* For some older browsers (optional) */
      backdrop-filter: none; /* For modern browsers */
    }
  }
`;
const CampusDisplaySlideShow = ({
  campusDisplay,
  className
}: iCampusDisplaySlideShowPanel) => {
  const slideShowingTime = 5000;
  const [isLoading, setIsLoading] = useState(false);
  const [cdSlides, setCdSlides] = useState<iCampusDisplaySlide[]>([]);

  useEffect(() => {
    let isCanceled = false;

    setIsLoading(true);
    CampusDisplaySlideService.getAll({
      where: JSON.stringify({
        isActive: true,
        displayId: campusDisplay.id
      }),
      include: "Asset",
      perPage: 999999,
      sort: "sortOrder:ASC"
    })
      .then(resp => {
        if (isCanceled) {
          return;
        }
        setCdSlides(resp.data || []);
      })
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
  }, [campusDisplay.id]);

  const getSlideImage = (slide: iCampusDisplaySlide) => {
    if (slide.settings?.isFullScreen === true) {
      return (
        <div className={"showing-slide fullscreen"}>
          <img
            className="d-block w-100"
            src={`${slide.Asset?.url || ""}`.trim().replace(".mp4", ".jpg")}
            alt="Slide"
          />
        </div>
      );
    }
    return (
      <div className={"showing-slide"}>
        <img
          className="d-block w-100"
          src={`${slide.Asset?.url || ""}`.trim().replace(".mp4", ".jpg")}
          alt="Slide"
        />
      </div>
    );
  };

  const getContent = () => {
    if (isLoading === true) {
      return <PageLoadingSpinner />;
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
            <Carousel.Item key={slide.id}>{getSlideImage(slide)}</Carousel.Item>
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
