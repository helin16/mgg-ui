import iCampusDisplaySlide from "../../../types/CampusDisplay/iCampusDisplaySlide";
import { FlexContainer } from "../../../styles";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import CampusDisplaySlideEditPopupBtn from "./CampusDisplaySlideCreatePopupBtn";
import * as Icons from "react-bootstrap-icons";
import React from "react";
import iCampusDisplay from "../../../types/CampusDisplay/iCampusDisplay";
import styled from "styled-components";
import AssetThumbnail from '../../Asset/AssetThumbnail';

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
    
  .slide-list-div {
    .slide-div {
      height: 6rem;
      width: 10rem;
      background-color: transparent;
      margin-right: 0.6rem;
      position: relative;

      &.selected {
        border: 4px #ffe55a solid;
      }

      .options-wrapper {
        position: absolute;
        top: 2px;
        left: 2px;
        z-index: 1000;
      }
        
      .thumbnail {
          min-height: auto;
          min-width: auto;
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
      campusDisplay,
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
        <AssetThumbnail asset={slide.Asset} className={'thumbnail'}/>
        {showOptions === true ? (
          <div className={`options-wrapper`}>
            {isSelected === true ? <Icons.CheckSquareFill className={'bg-primary'}/> : <Icons.Square style={{backgroundColor: 'white'}}/>}
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
                        campusDisplay={campusDisplay}
                        index={index}
                        showOptions={showOptions}
                        isSelected={selectedSlideIds.indexOf(slide.id) >= 0}
                        onSelected={handleChecked}
                        onClick={() => {
                          onSlideClick && onSlideClick(slide);
                          handleChecked && handleChecked(slide, selectedSlideIds.indexOf(slide.id) < 0)
                        }}
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
