import iCampusDisplay from "../../types/CampusDisplay/iCampusDisplay";
import styled from "styled-components";
import { useEffect, useState } from "react";
import iCampusDisplaySlide from "../../types/CampusDisplay/iCampusDisplaySlide";
import iPaginatedResult from "../../types/iPaginatedResult";
import CampusDisplaySlideService from "../../services/CampusDisplay/CampusDisplaySlideService";
import Toaster from "../../services/Toaster";
import PageLoadingSpinner from "../common/PageLoadingSpinner";
import { FlexContainer } from "../../styles";
import * as Icons from "react-bootstrap-icons";
import CampusDisplaySlideShowingPanel from "./CampusDisplaySlideShowingPanel";
import CampusDisplaySlideEditPopupBtn from "./CampusDisplaySlideEditPopupBtn";
import MathHelper from "../../helper/MathHelper";
import ImageWithPlaceholder from '../common/ImageWithPlaceholder';

type iCampusDisplayEditPanel = {
  campusDisplay: iCampusDisplay;
};

const Wrapper = styled.div`
  .displaying-div {
    background-color: #cecece;
    margin-bottom: 1rem;
    padding: 1rem;
    position: relative;
    height: 50rem;
  }

  .slide-list-div-wrapper {
    background-color: #cecece;
    padding: 0.6rem;
    overflow-x: auto;
    position: relative;

    .slide-list-div {
      gap: 0.4rem;

      .slide-div {
        height: 6rem;
        width: 10rem;
        background-color: white;
        border-width: 4px;
        border-style: solid;
        border-color: white;
        object-fit: contain;

        &.selected {
          border: 4px #c2b409 solid;
        }

        &.new-slide {
          text-align: center;
          font-size: 18px;
          filter: none;
          -webkit-backdrop-filter: none;
          backdrop-filter: none;

          .icon {
            font-size: 26px;
          }

          &.btn:hover {
            color: black !important;
          }
        }
      }
    }
  }
`;
const CampusDisplayEditPanel = ({ campusDisplay }: iCampusDisplayEditPanel) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showingSlide, setShowingSlide] = useState<iCampusDisplaySlide | null>(
    null
  );
  const [count, setCount] = useState(0);
  const [slideList, setSlideList] = useState<iPaginatedResult<
    iCampusDisplaySlide
  > | null>(null);

  useEffect(() => {
    let isCanceled = false;

    setIsLoading(true);
    CampusDisplaySlideService.getAll({
      where: JSON.stringify({ isActive: true, displayId: campusDisplay.id }),
      include: "Asset",
      sort: "sortOrder:DESC",
      perPage: 9999999
    })
      .then(resp => {
        if (isCanceled) {
          return;
        }
        const slides = resp.data || [];
        setSlideList(resp);
        setShowingSlide(slides.length > 0 ? slides[0] : null);
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
  }, [campusDisplay, count]);

  const getContent = () => {
    if (isLoading) {
      return <PageLoadingSpinner />;
    }

    return (
      <>
        <CampusDisplaySlideShowingPanel
          className={"displaying-div"}
          slide={showingSlide}
          campusDisplay={campusDisplay}
          onSaved={() => setCount(MathHelper.add(count, 1))}
        />
        <div className={"slide-list-div-wrapper"}>
          <FlexContainer className={"slide-list-div"}>
            {(slideList?.data || []).map(slide => {
              return (
                <ImageWithPlaceholder
                  thumbnail
                  className={`cursor-pointer slide-div ${
                    `${showingSlide?.id || ""}`.trim() === `${slide.id}`.trim()
                      ? "selected"
                      : ""
                  }`}
                  key={slide.id}
                  src={slide.Asset?.url || ''}
                  onClick={() => setShowingSlide(slide)}
                />
              );
            })}
            <CampusDisplaySlideEditPopupBtn
              display={campusDisplay}
              className={"slide-div new-slide"}
              variant={"outline-secondary"}
              onSaved={() => setCount(MathHelper.add(count, 1))}
            >
              <div className={"icon"}>
                <Icons.Plus />
              </div>
              <div>New</div>
            </CampusDisplaySlideEditPopupBtn>
          </FlexContainer>
        </div>
      </>
    );
  };

  return <Wrapper>{getContent()}</Wrapper>;
};

export default CampusDisplayEditPanel;
