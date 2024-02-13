import iCampusDisplaySlide from "../../types/CampusDisplay/iCampusDisplaySlide";
import styled from "styled-components";
import iCampusDisplay from "../../types/CampusDisplay/iCampusDisplay";
import ImageWithPlaceholder from "../common/ImageWithPlaceholder";
import PageLoadingSpinner from "../common/PageLoadingSpinner";
import VideoWithPlaceholder from "../common/VideoWithPlaceholder";
import CampusDisplayDefaultSlide from "./CampusDisplayDefaultSlide";

type iCampusDisplaySlideShowingPanel = {
  className?: string;
  slide?: iCampusDisplaySlide | null;
  onSaved: (saved: iCampusDisplaySlide[]) => void;
  campusDisplay: iCampusDisplay;
};

const imgMargin = "4rem";
const Wrapper = styled.div`
  .blury {
    filter: blur(3rem); /* Adjust the blur radius as needed */
    -webkit-backdrop-filter: blur(
      3rem
    ); /* For some older browsers (optional) */
    backdrop-filter: blur(3rem); /* For modern browsers */
  }

  .slide-wrapper {
    height: 100%;
    position: relative;

    .showing-slide-mask {
      height: 100%;
      width: 100%;
      object-fit: cover;
      object-position: center center;
      position: relative;
      left: 0px;
      right: 0px;
      top: 0px;
      bottom: 0px;
    }

    .loading-mask-bg {
      height: 100%;
      width: 100%;
      background-color: #aaaaaa;
    }

    .loading-showing-slide,
    .showing-slide {
      position: absolute;
      left: 0px;
      right: 0px;
      top: 0px;
      bottom: 0px;
      object-fit: contain;
      object-position: center center;
      width: auto;
      background-color: white;
      height: calc(100% - ${imgMargin} - ${imgMargin});
      filter: none; /* Reset the filter to its default value */
      -webkit-backdrop-filter: none; /* For some older browsers (optional) */
      backdrop-filter: none; /* For modern browsers */
      border: 1rem white solid;
      margin: ${imgMargin} auto;
    }

    .loading-showing-slide {
      width: calc(100% - 20rem);
      min-width: 200px;
    }
  }
`;
const CampusDisplaySlideShowingPanel = ({
  slide,
  className,
  onSaved,
  campusDisplay
}: iCampusDisplaySlideShowingPanel) => {
  const getContent = () => {
    if (!slide) {
      return (
        <CampusDisplayDefaultSlide
          onSaved={onSaved}
          campusDisplay={campusDisplay}
        />
      );
    }

    if (
      `${slide.Asset?.mimeType || ""}`
        .trim()
        .toLowerCase()
        .startsWith("video")
    ) {
      return (
        <>
          <ImageWithPlaceholder
            className={"showing-slide-mask blury"}
            src={`${slide.Asset?.url || ""}`
              .trim()
              .toLowerCase()
              .replace(".mp4", ".jpg")}
            placeholder={<div className={"loading-mask-bg blury"} />}
          />
          <VideoWithPlaceholder
            className={"showing-slide"}
            src={slide.Asset?.url || ""}
            autoPlay
          />
        </>
      );
    }

    return (
      <>
        <ImageWithPlaceholder
          className={"showing-slide-mask blury"}
          src={slide.Asset?.url || ""}
          placeholder={<div className={"loading-mask-bg blury"} />}
        />
        <ImageWithPlaceholder
          className={"showing-slide"}
          src={slide.Asset?.url || ""}
          placeholder={
            <PageLoadingSpinner className={"loading-showing-slide"} />
          }
        />
      </>
    );
  };
  return (
    <Wrapper className={className}>
      <div className={"slide-wrapper"}>{getContent()}</div>
    </Wrapper>
  );
};

export default CampusDisplaySlideShowingPanel;
