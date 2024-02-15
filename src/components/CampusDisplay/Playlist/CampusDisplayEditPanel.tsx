import iCampusDisplay from "../../../types/CampusDisplay/iCampusDisplay";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import iCampusDisplaySlide from "../../../types/CampusDisplay/iCampusDisplaySlide";
import iPaginatedResult from "../../../types/iPaginatedResult";
import CampusDisplaySlideService from "../../../services/CampusDisplay/CampusDisplaySlideService";
import Toaster from "../../../services/Toaster";
import PageLoadingSpinner from "../../common/PageLoadingSpinner";
import MathHelper from "../../../helper/MathHelper";
import CampusDisplayDraggableSlides from "../DisplaySlide/CampusDisplayDraggableSlides";
import CampusDisplayDefaultSlide from "../DisplaySlide/CampusDisplayDefaultSlide";
import CampusDisplayShowSlide from "../DisplaySlide/CampusDisplayShowSlide";
import CampusDisplaySlideEditPopupBtn from "../DisplaySlide/CampusDisplaySlideEditPopupBtn";
import * as Icons from 'react-bootstrap-icons'

type iCampusDisplayEditPanel = {
  campusDisplay: iCampusDisplay;
  showingBulkOptions?: boolean;
  onSetShowingBulkOptions?: (showing: boolean) => void;
  selectedSlides?: iCampusDisplaySlide[];
  onSlidesSelected: (slides: iCampusDisplaySlide[]) => void;
  onSlidesLoaded?: (slides: iCampusDisplaySlide[]) => void;
  forceReload?: number;
};

const Wrapper = styled.div`
  .displaying-div {
    position: relative;
    height: 50rem;
    border: 0.6rem solid #333;
    background-color: black;

    .edit-btn {
      position: absolute;
      right: 0.6rem;
      top: 0.6rem;
      z-index: 1000;
    }
  }

  .slide-list-div-wrapper {
    border-top: 0px;
    background-color: #333;
  }
`;

const CampusDisplayEditPanel = ({
  campusDisplay,
  onSlidesSelected,
  onSlidesLoaded,
  onSetShowingBulkOptions,
  selectedSlides = [],
  showingBulkOptions = false,
  forceReload = 0
}: iCampusDisplayEditPanel) => {
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
        onSlidesLoaded && onSlidesLoaded(slides);
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
    setSlideList({ ...(slideList || {}), data: reorderedSlides });
    Promise.all(
      reorderedSlides.map((slide, index) => {
        return CampusDisplaySlideService.update(slide.id, { sortOrder: index });
      })
    ).catch(err => {
      setSlideList(slideList);
      Toaster.showApiError(err);
    });
  };

  const getDraggableSlides = () => {
    const slides = slideList?.data || [];
    if (slides.length <= 0) {
      return null;
    }

    return (
      <CampusDisplayDraggableSlides
        className={"slide-list-div-wrapper"}
        showOptions={showingBulkOptions === true}
        campusDisplay={campusDisplay}
        slides={slides}
        onSlidesReordered={handleSlidesReorder}
        showingSlide={showingSlide}
        onSlideClick={slide => setShowingSlide(slide)}
        onNewSlidesCreated={() => setCount(MathHelper.add(count, 1))}
        selectedSlides={selectedSlides}
        onSlidesSelected={slides => onSlidesSelected(slides)}
      />
    );
  };

  const getSlide = () => {
    if (!showingSlide) {
      return (
        <CampusDisplayDefaultSlide
          onSaved={() => setCount(MathHelper.add(count, 1))}
          campusDisplay={campusDisplay}
        />
      );
    }

    return (
      <>
        <CampusDisplaySlideEditPopupBtn
          slides={[showingSlide]}
          display={campusDisplay}
          divClassName={"edit-btn"}
          variant={'secondary'}
          closeOnSaved
          onSaved={(updatedSlides) => {
            const updatedSlide = {
              ...updatedSlides[0],
              Asset: showingSlide?.Asset
            };
            setShowingSlide(updatedSlide);
            // @ts-ignore
            setSlideList({
              ...(slideList || {}),
              data: (slideList?.data || []).map(slide => slide.id === updatedSlide.id ? updatedSlide : slide),
            })
          }}
        >
          <Icons.Pencil /> Edit
        </CampusDisplaySlideEditPopupBtn>
        <CampusDisplayShowSlide
          slide={showingSlide}
          campusDisplay={campusDisplay}
        />
      </>
    );
  };

  const getContent = () => {
    if (isLoading) {
      return <PageLoadingSpinner />;
    }

    return (
      <>
        <div className={"displaying-div"}>{getSlide()}</div>
        {getDraggableSlides()}
      </>
    );
  };

  return <Wrapper>{getContent()}</Wrapper>;
};

export default CampusDisplayEditPanel;
