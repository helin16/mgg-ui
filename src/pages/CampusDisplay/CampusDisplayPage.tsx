import { useState } from "react";
import CampusDisplayLocationSelector from "../../components/CampusDisplay/DisplayLocation/CampusDisplayLocationSelector";
import styled from "styled-components";
import { FlexContainer } from "../../styles";
import FormLabel from "../../components/form/FormLabel";
import SchoolLogo from "../../components/SchoolLogo";
import SectionDiv from "../../components/common/SectionDiv";
import CampusDisplaySlideShow from '../../components/CampusDisplay/DisplaySlide/CampusDisplaySlideShow';

const Wrapper = styled.div`
  height: 100vh;
  .location-selector {
    height: 100vh;
    .logo-wrapper {
      img {
        width: 300px;
        height: auto;
      }
    }
  }
`;
const CampusDisplayPage = () => {
  const [locationId, setLocationId] = useState<string | null>(null);

  const getContent = () => {
    if (!locationId || `${locationId || ""}`.trim() === "") {
      return (
        <FlexContainer
          className={
            "location-selector justify-content-center align-content-center align-items-center"
          }
        >
          <div>
            <SectionDiv className={"logo-wrapper space-below"}>
              <SchoolLogo />
            </SectionDiv>
            <FormLabel
              label={"Please select a location to display:"}
              isRequired
            />
            <CampusDisplayLocationSelector
              values={
                `${locationId || ""}`.trim() !== ""
                  ? [`${locationId || ""}`.trim()]
                  : undefined
              }
              onSelect={option => {
                setLocationId(
                  // @ts-ignore
                  `${option?.value || ""}`.trim() === ""
                    ? null
                    : // @ts-ignore
                      option.data.id
                );
              }}
            />
          </div>
        </FlexContainer>
      );
    }

    return <CampusDisplaySlideShow locationId={locationId} onCancel={() => setLocationId(null)}/>;
  };

  return <Wrapper>{getContent()}</Wrapper>;
};

export default CampusDisplayPage;
