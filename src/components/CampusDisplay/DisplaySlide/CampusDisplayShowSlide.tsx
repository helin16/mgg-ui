import iCampusDisplaySlide from "../../../types/CampusDisplay/iCampusDisplaySlide";
import React from "react";
import styled from "styled-components";
import iCampusDisplay from "../../../types/CampusDisplay/iCampusDisplay";
import CampusDisplayDefaultSlide from "./CampusDisplayDefaultSlide";
import {CD_DISPLAY_MODE_FULL_SCREEN_FILL, CD_DISPLAY_MODE_FULL_SCREEN_FIT} from "./CDSlideDisplayModeSelector";
import ImageWithPlaceholder, {
  getImagePlaceHolder
} from "../../common/MultiMedia/ImageWithPlaceholder";
import VideoWithPlaceholder, {
  iVideoWithPlaceholder
} from "../../common/MultiMedia/VideoWithPlaceholder";
import AssetHelper from '../../../helper/AssetHelper';

type iCampusDisplayShowSlide = {
  slide?: iCampusDisplaySlide | null;
  campusDisplay: iCampusDisplay;
  thumbnail?: boolean;
  className?: string;
  videoProps?: iVideoWithPlaceholder;
  imageProps?: any;
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

  .slide-content {
    height: 90% !important;
    width: 90% !important;
    object-fit: contain;
    z-index: 999;
    position: absolute;
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
    .${CD_DISPLAY_MODE_FULL_SCREEN_FILL},
    .${CD_DISPLAY_MODE_FULL_SCREEN_FIT},
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
  imageProps
}: iCampusDisplayShowSlide) => {

  const isVideo = () => {
    return `${slide?.Asset?.mimeType}`
      .trim()
      .toLowerCase()
      .startsWith("video");
  };

  const isFullScreen = () => {
    return `${slide?.settings?.displayMode || ""}`
      .trim()
      .toLowerCase()
      .startsWith("fullscreen");
  };

  const getContentDiv = (url: string, className?: string) => {
    if (isVideo() === true) {
      return (
        <VideoWithPlaceholder
          className={`${className || ""} slide-content`}
          src={slide?.Asset?.url || ""}
          controls={true}
          {...videoProps}
        />
      );
    }
    return (
      <ImageWithPlaceholder
        className={`${className || ""} slide-content`}
        src={url}
        alt="Slide"
        placeholder={getImagePlaceHolder()}
        {...imageProps}
      />
    );
  };

  const getContent = () => {
    const url = slide?.Asset?.url || "";
    if (!slide || url === "") {
      return (
        <CampusDisplayDefaultSlide
          onSaved={() => onSaved && onSaved()}
          campusDisplay={campusDisplay}
        />
      );
    }

    if (isFullScreen() === true) {
      return getContentDiv(url, slide.settings?.displayMode || "");
    }

    return (
      <>
        <div
          className={"bg-blurry"}
          style={{
            backgroundImage: `url(${url}${isVideo() === true ? AssetHelper.getThumbnail(url) : ''})`
          }}
        />
        {getContentDiv(url)}
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
