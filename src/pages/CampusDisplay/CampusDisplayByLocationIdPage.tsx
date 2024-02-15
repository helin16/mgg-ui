import styled from "styled-components";
import CampusDisplaySlideShow from '../../components/CampusDisplay/DisplaySlide/CampusDisplaySlideShow';
import {useParams} from 'react-router-dom';
import {URL_CAMPUS_DISPLAY_PAGE} from '../../Url';

const Wrapper = styled.div`
  height: 100vh;
  background-color: black;
  .carousel-item {
      height: 100vh !important;
  }
`;
const CampusDisplayByLocationIdPage = () => {
  const { locationId } = useParams();
  return (
    <Wrapper>
      <CampusDisplaySlideShow
        locationId={locationId || ''}
        onCancel={() => {
          window.location.href = URL_CAMPUS_DISPLAY_PAGE
        }}
        onLocationLoaded={(location) => {
          const locationName = `${location?.name || ''}`.trim();
          document.title = `CD Location: ${locationName} (${location?.version || 0})`
        }}
      />
    </Wrapper>
  );
};

export default CampusDisplayByLocationIdPage;
