import iCampusDisplaySlide from "../../types/CampusDisplay/iCampusDisplaySlide";
import { FlexContainer } from "../../styles";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import CampusDisplaySlideEditPopupBtn from "./CampusDisplaySlideEditPopupBtn";
import * as Icons from "react-bootstrap-icons";
import React from "react";
import iCampusDisplay from "../../types/CampusDisplay/iCampusDisplay";
import ImageWithPlaceholder from "../common/ImageWithPlaceholder";
import styled from "styled-components";
import PageLoadingSpinner from "../common/PageLoadingSpinner";
import VideoWithPlaceholder from '../common/VideoWithPlaceholder';

type iCampusDisplayDraggableSlides = {
  className?: string;
  showOptions?: boolean;
  showCreateBtn?: boolean;
  campusDisplay: iCampusDisplay;
  slides: iCampusDisplaySlide[];
  selectedSlides?: iCampusDisplaySlide[];
  showingSlide?: iCampusDisplaySlide | null;
  onSlideClick?: (slide: iCampusDisplaySlide) => void;
  onNewSlidesCreated?: (slides: iCampusDisplaySlide[]) => void;
  onSlidesReordered: (slides: iCampusDisplaySlide[]) => void;
  onSlidesSelected?: (slides: iCampusDisplaySlide[]) => void;
};

const Wrapper = styled.div`
  padding: 0.6rem;
  overflow-x: auto;
  position: relative;
    
  .video-thumbnail-wrapper {
      position: relative;
      .video-thumbnail-indicator {
          position: absolute;
          left: 0px;
          top: 0px;
          bottom: 0px;
          right: 0px;
          height: 100%;
          width: 100%;
          text-align: center;
          font-size: 38px;
          display: flex;
          justify-content: center;
          align-items: center;
      }
  }

  .slide-list-div {
    .slide-div {
      height: 6rem;
      width: 10rem;
      background-color: white;
      border-width: 4px;
      border-style: solid;
      border-color: white;
      margin-right: 0.4rem;
      position: relative;

      .img-placeholder {
        text-align: center;
        margin-top: 0.4rem;

        .title {
          font-size: 12px;
        }
      }

      img {
        height: 100%;
        width: 100%;
        object-fit: contain;
        border: none;
        padding: 0px;
      }

      &.selected {
        border: 4px #ffe55a solid;
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

      .options-wrapper {
        position: absolute;
        top: 2px;
        left: 2px;
      }
    }
  }
`;

const DraggableItem = React.forwardRef(
  (
    {
      // @ts-ignore
      slide,
      // @ts-ignore
      className,
      // @ts-ignore
      provided,
      // @ts-ignore
      onClick,
      // @ts-ignore
      showOptions,
      // @ts-ignore
      isSelected,
      // @ts-ignore
      onSelected
    },
    ref
  ) => {
    return (
      <div
        // @ts-ignore
        ref={ref}
        className={className}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        onClick={onClick}
      >
        {`${slide.Asset?.mimeType || ''}`.trim().startsWith('video/') ? (
          <VideoWithPlaceholder
            src={slide.Asset?.url || ""}
            thumbnail
            coverImg={
              <div className={'video-thumbnail-wrapper'}>
                <ImageWithPlaceholder
                  thumbnail
                  src={`${slide.Asset?.url || ""}`.trim().replace('.mp4', '.jpg')}
                  placeholder={<PageLoadingSpinner className={"img-placeholder"} />}
                />
                <div className={'video-thumbnail-indicator'}>
                  <Icons.Play className={'thumbnail-indicator'} />
                </div>
              </div>
            }
          />
        ) : (
          <ImageWithPlaceholder
            thumbnail
            src={slide.Asset?.url || ""}
            placeholder={<PageLoadingSpinner className={"img-placeholder"} />}
          />
        )}
        {showOptions === true ? (
          <div className={"options-wrapper"}>
            <input
              type={"checkbox"}
              checked={isSelected}
              onChange={event => onSelected(slide, event.target.checked)}
            />
          </div>
        ) : null}
      </div>
    );
  }
);

const CampusDisplayDraggableSlides = ({
  className,
  onSlidesReordered,
  onSlidesSelected,
  showOptions = false,
  showCreateBtn = false,
  selectedSlides = [],
  campusDisplay,
  slides,
  showingSlide,
  onSlideClick,
  onNewSlidesCreated
}: iCampusDisplayDraggableSlides) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return; // dropped outside the list
    const reorderedSlides = [...slides];
    const [removed] = reorderedSlides.splice(result.source.index, 1);
    reorderedSlides.splice(result.destination.index, 0, removed);
    onSlidesReordered(reorderedSlides);
  };

  const selectedSlideIds = selectedSlides.map(slide => slide.id);

  const handleChecked = (slide: iCampusDisplaySlide, checked: boolean) => {
    if (checked === true) {
      if (selectedSlideIds.indexOf(slide.id) >= 0) {
        onSlidesSelected && onSlidesSelected(selectedSlides);
        return;
      }

      onSlidesSelected && onSlidesSelected([...selectedSlides, slide]);
      return;
    }

    if (selectedSlideIds.indexOf(slide.id) < 0) {
      onSlidesSelected && onSlidesSelected(selectedSlides);
      return;
    }

    onSlidesSelected && onSlidesSelected(selectedSlides?.filter(selectedSlide => selectedSlide.id !== slide.id));
    return;
  };

  const getCreateBtn = () => {
    if (showCreateBtn !== true) {
      return null;
    }
    return (
      <CampusDisplaySlideEditPopupBtn
        display={campusDisplay}
        className={"slide-div new-slide"}
        variant={"outline-secondary"}
        onSaved={(sls: iCampusDisplaySlide[]) =>
          onNewSlidesCreated && onNewSlidesCreated(sls)
        }
      >
        <div className={"icon"}>
          <Icons.Plus />
        </div>
        <div>New</div>
      </CampusDisplaySlideEditPopupBtn>
    )
  }

  return (
    <Wrapper className={className}>
      <FlexContainer className={"slide-list-div"}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable" direction="horizontal">
            {(provided: any) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="d-flex"
              >
                {slides.map((slide, index) => (
                  <Draggable
                    key={slide.id}
                    draggableId={slide.id}
                    index={index}
                  >
                    {(provid: any) => (
                      <DraggableItem
                        ref={provid.innerRef}
                        provided={provid}
                        {...provid.draggableProps}
                        {...provid.dragHandleProps}
                        className={`cursor-pointer slide-div ${
                          `${showingSlide?.id || ""}`.trim() ===
                          `${slide.id}`.trim()
                            ? "selected"
                            : ""
                        }`}
                        slide={slide}
                        index={index}
                        showOptions={showOptions}
                        isSelected={selectedSlideIds.indexOf(slide.id) >= 0}
                        onSelected={handleChecked}
                        onClick={() => onSlideClick && onSlideClick(slide)}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {getCreateBtn()}
      </FlexContainer>
    </Wrapper>
  );
};

export default CampusDisplayDraggableSlides;
