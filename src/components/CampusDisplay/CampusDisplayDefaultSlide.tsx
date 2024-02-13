import SchoolLogo from '../SchoolLogo';
import CampusDisplaySlideEditPopupBtn from './CampusDisplaySlideEditPopupBtn';
import * as Icons from 'react-bootstrap-icons';
import styled from 'styled-components';
import iCampusDisplaySlide from '../../types/CampusDisplay/iCampusDisplaySlide';
import iCampusDisplay from '../../types/CampusDisplay/iCampusDisplay';


const Wrapper = styled.div`
    padding: 13.4rem 0;
    text-align: center;
    background: radial-gradient(circle at center, #a5a6ab 50%, #fefefe);

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
`;
type iCampusDisplayDefaultSlide = {
  onSaved?: (saved: iCampusDisplaySlide[]) => void;
  campusDisplay: iCampusDisplay;
}
const CampusDisplayDefaultSlide = ({onSaved, campusDisplay} : iCampusDisplayDefaultSlide) => {

  const getNewBtn = () => {
    if (!onSaved) {
      return null;
    }
    return (
      <CampusDisplaySlideEditPopupBtn
        variant={"success"}
        onSaved={onSaved}
        display={campusDisplay}
      >
        <Icons.Plus/> New
      </CampusDisplaySlideEditPopupBtn>
    )
  }

  return (
    <Wrapper className={"default-slide"}>
      <div className={"logo-wrapper"}>
        <SchoolLogo className={"logo"}/>
      </div>
      <h5 className={"text-muted"}>This is the default slide</h5>
      {getNewBtn()}
    </Wrapper>
  )
}

export default CampusDisplayDefaultSlide;
