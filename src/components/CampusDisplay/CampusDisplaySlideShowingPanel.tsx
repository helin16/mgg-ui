import iCampusDisplaySlide from '../../types/CampusDisplay/iCampusDisplaySlide';
import styled from 'styled-components';
import SchoolLogo from '../SchoolLogo';
import CampusDisplaySlideEditPopupBtn from './CampusDisplaySlideEditPopupBtn';
import * as Icons from 'react-bootstrap-icons';
import iCampusDisplay from '../../types/CampusDisplay/iCampusDisplay';
import ImageWithPlaceholder from '../common/ImageWithPlaceholder';
import PageLoadingSpinner from '../common/PageLoadingSpinner';
import {Image} from 'react-bootstrap';

type iCampusDisplaySlideShowingPanel = {
  className?: string;
  slide?: iCampusDisplaySlide | null;
  onSaved: (saved: iCampusDisplaySlide[]) => void;
  campusDisplay: iCampusDisplay;
}

const imgMargin = '4rem';
const Wrapper = styled.div`
  .slide-wrapper {
    height: 100%;
    position: relative;

    .default-slide {
      padding-top: 6rem;
      text-align: center;

      .logo-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 300px; /* Adjust the height as needed */
        perspective: 1000px; /* Set the perspective for 3D effect */
      }

      .logo {
        min-width: 100px;
        width: 50%;
        max-width: 270px;
        margin-bottom: 1rem;
        height: auto; /* Maintain image aspect ratio */
        animation: spin 5s linear infinite; /* Apply the spinning animation */
        transform-origin: center center;
      }

      @keyframes spin {
        0% {
          transform: rotateY(0deg);
        }
        100% {
          transform: rotateY(360deg);
        }
      }
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
      filter: blur(5rem); /* Adjust the blur radius as needed */
      -webkit-backdrop-filter: blur(5rem); /* For some older browsers (optional) */
      backdrop-filter: blur(5rem); /* For modern browsers */
    }

    .showing-slide {
      position: absolute;
      left: 0px;
      right: 0px;
      top: 0px;
      bottom: 0px;
      object-fit: contain;
      object-position: center center;
      width: auto;
      height: calc(100% - ${imgMargin} - ${imgMargin});
      filter: none; /* Reset the filter to its default value */
      -webkit-backdrop-filter: none; /* For some older browsers (optional) */
      backdrop-filter: none; /* For modern browsers */
      border: 1rem white solid;
      margin: ${imgMargin} auto;
    }
  }
`;
const CampusDisplaySlideShowingPanel = ({slide, className, onSaved, campusDisplay}: iCampusDisplaySlideShowingPanel) => {

  const getContent = () => {
    if (!slide) {
      return (
        <div className={'default-slide'}>
          <div className={'logo-wrapper'}>
            <SchoolLogo className={'logo'} />
          </div>
          <h5 className={'text-muted'}>This is the default slide</h5>
          <CampusDisplaySlideEditPopupBtn variant={'success'} onSaved={onSaved} display={campusDisplay}>
            <Icons.Plus /> New
          </CampusDisplaySlideEditPopupBtn>
        </div>
      )
    }
    return (
      <>
        <Image className={'showing-slide-mask'} src={slide.Asset?.url || ''} />
        <ImageWithPlaceholder className={'showing-slide'} src={slide.Asset?.url || ''} placeholder={<PageLoadingSpinner className={'showing-slide'} />}  />
      </>
    )
  }
  return (
    <Wrapper className={className}>
      <div className={'slide-wrapper'}>
        {getContent()}
      </div>
    </Wrapper>
  )
}

export default CampusDisplaySlideShowingPanel;
