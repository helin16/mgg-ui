import iCampusDisplay from "../../types/CampusDisplay/iCampusDisplay";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import iCampusDisplaySlide from "../../types/CampusDisplay/iCampusDisplaySlide";
import iPaginatedResult from "../../types/iPaginatedResult";
import CampusDisplaySlideService from "../../services/CampusDisplay/CampusDisplaySlideService";
import Toaster from "../../services/Toaster";
import PageLoadingSpinner from "../common/PageLoadingSpinner";
import CampusDisplaySlideShowingPanel from "./CampusDisplaySlideShowingPanel";
import MathHelper from "../../helper/MathHelper";
import CampusDisplayDraggableSlides from "./CampusDisplayDraggableSlides";

type iCampusDisplayEditPanel = {
  campusDisplay: iCampusDisplay;
  showingBulkOptions?: boolean;
  onSetShowingBulkOptions?: (showing: boolean) => void;
  selectedSlides?: iCampusDisplaySlide[];
  onSlidesSelected: (slides: iCampusDisplaySlide[]) => void;
  forceReload?: number;
};

const Wrapper = styled.div`
  .displaying-div {
    margin-bottom: 1rem;
    padding: 1rem;
    position: relative;
    height: 50rem;
  }

  .slide-list-div-wrapper {
    background-color: #aaaaaa;
  }
`;

const CampusDisplayEditPanel = ({ campusDisplay, onSlidesSelected, onSetShowingBulkOptions, selectedSlides = [], showingBulkOptions = false, forceReload = 0 }: iCampusDisplayEditPanel) => {
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
      sort: "sortOrder:ASC",
      perPage: 9999999
    })
      .then(resp => {
        if (isCanceled) {
          return;
        }
        const slides = resp.data || [];
        setSlideList(resp);
        setShowingSlide(slides.length > 0 ? slides[0] : null);
        onSlidesSelected([]);
        onSetShowingBulkOptions && onSetShowingBulkOptions(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campusDisplay, count, forceReload]);

  const handleSlidesReorder = (reorderedSlides: iCampusDisplaySlide[]) => {

    // @ts-ignore
    setSlideList({...(slideList || {}), data: reorderedSlides})
    Promise.all(reorderedSlides.map((slide, index) => {
      return CampusDisplaySlideService.update(slide.id, {sortOrder: index})
    })).catch(err => {
      setSlideList(slideList);
      Toaster.showApiError(err);
    })
  }

  const getDraggableSlides = () => {
    const slides = slideList?.data || [];
    if (slides.length <= 0) {
      return null;
    }

    return <CampusDisplayDraggableSlides
      className={'slide-list-div-wrapper'}
      showOptions={showingBulkOptions === true}
      campusDisplay={campusDisplay}
      slides={slides}
      onSlidesReordered={handleSlidesReorder}
      showingSlide={showingSlide}
      onSlideClick={(slide) => setShowingSlide(slide)}
      onNewSlidesCreated={() => setCount(MathHelper.add(count, 1))}
      selectedSlides={selectedSlides}
      onSlidesSelected={(slides) => onSlidesSelected(slides)}
    />
  }

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
        {getDraggableSlides()}
      </>
    );
  };

  return <Wrapper>{getContent()}</Wrapper>;
};

export default CampusDisplayEditPanel;
