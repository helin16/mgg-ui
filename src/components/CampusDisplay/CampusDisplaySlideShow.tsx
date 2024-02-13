import styled from 'styled-components';
import {useEffect, useState} from 'react';
import iCampusDisplaySlide from '../../types/CampusDisplay/iCampusDisplaySlide';
import CampusDisplayDefaultSlide from './CampusDisplayDefaultSlide';
import iCampusDisplay from '../../types/CampusDisplay/iCampusDisplay';
import CampusDisplaySlideService from '../../services/CampusDisplay/CampusDisplaySlideService';
import Toaster from '../../services/Toaster';
import PageLoadingSpinner from '../common/PageLoadingSpinner';
import ImageWithPlaceholder from '../common/ImageWithPlaceholder';
import MathHelper from '../../helper/MathHelper';
import {mainBlue, mainRed} from '../../AppWrapper';

type iCampusDisplaySlideShowPanel = {
  campusDisplay: iCampusDisplay;
  className?: string;
}

const imgMargin = "4rem";
const Wrapper = styled.div`
    width: 100vw !important;
    height: 100vh !important;
    position: relative;
    
    .blury {
        filter: blur(3rem); /* Adjust the blur radius as needed */
        -webkit-backdrop-filter: blur(
                3rem
        ); /* For some older browsers (optional) */
        backdrop-filter: blur(3rem); /* For modern browsers */
    }

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
        height: 100%;
        width: 100%;
    }

    .loading-showing-slide {
        width: calc(100% - 20rem);
        min-width: 200px;
    }
    
    .showing-slide {
        display: flex;
        justify-items: center;
        align-items: center;
        justify-content: center;
        img {
            object-fit: contain;
            object-position: center center;
            background-color: black;
            width: auto;
            height: calc(70% - ${imgMargin} - ${imgMargin});
            min-height: 680px;
            filter: none; /* Reset the filter to its default value */
            -webkit-backdrop-filter: none; /* For some older browsers (optional) */
            backdrop-filter: none; /* For modern browsers */
        }
        &.fullscreen {
            img {
                object-fit: contain;
                height: 100vh;
                width: 100vw;
                border: none;
            }
        }
    }
    
    .slide-countdown-wrapper {
        position: absolute;
        bottom: 0px;
        left: 0px;
        width: 100%;
        background-color: ${mainBlue};
        .slide-countdown {
            height: 1px;
            background-color: ${mainRed};
        }
    }
`;
const CampusDisplaySlideShow = ({campusDisplay, className}: iCampusDisplaySlideShowPanel) => {

  const slideShowingTime = 5000;
  const slideShowingTimeStep = 100;
  const [isLoading, setIsLoading] = useState(false)
  const [cdSlides, setCdSlides] = useState<iCampusDisplaySlide[]>([])
  const [showingSlideIndex, setShowingSlideIndex] = useState(0)
  const [currentSlideDownCount, setCurrentSlideDownCount] = useState(0)


  useEffect(() => {
    let isCanceled = false;

    setIsLoading(true);
    CampusDisplaySlideService.getAll({
      where: JSON.stringify({
        isActive: true,
        displayId: campusDisplay.id,
      }),
      include: 'Asset',
      perPage: 999999,
      sort : 'sortOrder:ASC'
    }).then(resp => {
      if (isCanceled) { return }
      setCdSlides(resp.data || [])
    }).catch(err => {
      if (isCanceled) { return }
      Toaster.showApiError(err);
    }).finally(() => {
      if (isCanceled) { return }
      setIsLoading(false);
    })

    return () => {
      isCanceled = true;
    }
  }, [campusDisplay.id]);


  useEffect(() => {
    if (cdSlides.length <= 0) {
      setCurrentSlideDownCount(0);
      setShowingSlideIndex(0);
      return;
    }

    const rotateSlides = () => {
      if (currentSlideDownCount < slideShowingTime) {
        setCurrentSlideDownCount( MathHelper.add(currentSlideDownCount,slideShowingTimeStep));
        return;
      }

      setCurrentSlideDownCount(0);
      setShowingSlideIndex(prevIndex => (prevIndex + 1) % cdSlides.length);
      // setTimeout(() => {
      //   setShowingSlideIndex(prevIndex => (prevIndex + 1) % cdSlides.length);
      // }, 100); // Add a delay to ensure fadeOut animation finishes before changing slides
    };

    const rotationInterval = setInterval(rotateSlides, slideShowingTimeStep); // Interval for rotating slides

    return () => {
      clearInterval(rotationInterval);
    }
  }, [cdSlides, currentSlideDownCount]);

  const getSlideImage = (slide: iCampusDisplaySlide) => {
    if (slide.settings?.isFullScreen === true) {
      return (
        <div className={"showing-slide fullscreen"}>
          <ImageWithPlaceholder
            src={slide.Asset?.url || ""}
            placeholder={
              <PageLoadingSpinner className={"loading-showing-slide"}/>
            }
          />
        </div>
      )
    }
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
        <div className={"showing-slide"}>
          <ImageWithPlaceholder
            src={slide.Asset?.url || ""}
            placeholder={
              <PageLoadingSpinner className={"loading-showing-slide"} />
            }
          />
        </div>
      </>
    )
  }

  const getContent = () => {

    if (isLoading === true) {
      return <PageLoadingSpinner />
    }

    const slides = cdSlides.filter((cdSlide, index) => index === showingSlideIndex);
    if (slides.length <= 0) {
      return <CampusDisplayDefaultSlide campusDisplay={campusDisplay} />
    }

    const slide = slides[0];
    return (
      <>
        {getSlideImage(slide)}
        {cdSlides.length <= 1 ? null : (
          <div className={'slide-countdown-wrapper'}>
            <div className={'slide-countdown'} style={{width: `${MathHelper.mul(MathHelper.div(currentSlideDownCount, slideShowingTime), 100)}%`}}/>
          </div>
        )}
      </>
    );
  }

  return (
    <Wrapper className={`slide-wrapper ${className || ''}`}>
      {getContent()}
    </Wrapper>
  )
}

export default CampusDisplaySlideShow
