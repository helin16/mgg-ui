import iCampusDisplaySlide from "../../../types/CampusDisplay/iCampusDisplaySlide";
import ImageWithPlaceholder, {getImagePlaceHolder} from "../../common/ImageWithPlaceholder";
import React from "react";
import styled from "styled-components";
import iCampusDisplay from "../../../types/CampusDisplay/iCampusDisplay";
import CampusDisplayDefaultSlide from "./CampusDisplayDefaultSlide";
import CloudinaryHelper from "../../../helper/CloudinaryHelper";
import {CD_DISPLAY_MODE_FULL_SCREEN_FILL} from './CDSlideDisplayModeSelector';

type iCampusDisplayShowSlide = {
  slide?: iCampusDisplaySlide | null;
  campusDisplay: iCampusDisplay;
  thumbnail?: boolean;
  className?: string;
  videoProps?: any
  onSaved?: () => void;
};

const Wrapper = styled.div`
  width: 100% !important;
  height: 100% !important;
  position: relative;
  display: flex;
  justify-items: center;
  align-items: center;
  justify-content: center;

  .bg-blurry {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100% !important;
    height: 100% !important;
    background-color: transparent;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    filter: blur(3rem); /* Adjust the blur radius as needed */
    -webkit-backdrop-filter: blur(
      3rem
    ); /* For some older browsers (optional) */
    backdrop-filter: blur(3rem); /* For modern browsers */
    z-index: 998;
  }
    
  video,
  img {
    height: 90% !important;
    width: 90% !important;
    object-fit: contain;
    z-index: 999;
  }

  &.fullscreen,
  &.thumbnail {
    img {
      object-fit: contain;
      object-position: center center;
      width: 100% !important;
      height: 100% !important;
      filter: none; /* Reset the filter to its default value */
      -webkit-backdrop-filter: none; /* For some older browsers (optional) */
      backdrop-filter: none; /* For modern browsers */
    }
  }

  &.fullscreen {
      img.${CD_DISPLAY_MODE_FULL_SCREEN_FILL} {
          object-fit: cover !important;
      }
      video {
          width: 100% !important;
          height: 100% !important;
      }
  }
`;

const CampusDisplayShowSlide = ({
  slide,
  thumbnail,
  campusDisplay,
  onSaved,
  className,
  videoProps,
}: iCampusDisplayShowSlide) => {
  const isFullScreen = () => {
    return `${slide?.settings?.displayMode || ""}`
      .trim()
      .toLowerCase()
      .startsWith("fullscreen");
  };

  const getImgDiv = (url: string, className?: string) => {
    if (`${slide?.Asset?.mimeType}`.trim().toLowerCase().startsWith('video')) {
      return (
        <video
          className={className}
          autoPlay={videoProps?.autoPlay || false}
          controls={false}
          // onEnded={handleVideoEnd}
          style={{zIndex: 999}}
          {...videoProps}
        >
          <source src={slide?.Asset?.url || ''} type={`${slide?.Asset?.mimeType}`.trim()}/>
        </video>
      )
    }
    return <ImageWithPlaceholder
      className={className}
      src={url}
      alt="Slide"
      placeholder={getImagePlaceHolder()}
    />
  }

  const getContent = () => {
    const url =
      thumbnail === true
        ? CloudinaryHelper.getThumbnailUrl(slide?.Asset?.url || "")
        : CloudinaryHelper.getImgUrl(slide?.Asset?.url || "");
    if (!slide || url === "") {
      return (
        <CampusDisplayDefaultSlide
          onSaved={() => onSaved && onSaved()}
          campusDisplay={campusDisplay}
        />
      );
    }

    if (isFullScreen() === true) {
      return getImgDiv(url, slide.settings?.displayMode || '');
    }

    return (
      <>
        <div
          className={"bg-blurry"}
          style={{
            backgroundImage: `url(${url})`
          }}
        />
        {getImgDiv(url)}
      </>
    );
  };

  return (
    <Wrapper
      className={`showing-slide ${className || ""} ${
        thumbnail === true ? "thumbnail" : ""
      } ${isFullScreen() === true ? "fullscreen" : ""}`}
    >
      {getContent()}
    </Wrapper>
  );
};

export default CampusDisplayShowSlide;
