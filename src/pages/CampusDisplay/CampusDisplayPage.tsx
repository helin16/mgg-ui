import { useEffect, useState } from "react";
import CampusDisplayLocationSelector from "../../components/CampusDisplay/CampusDisplayLocationSelector";
import styled from "styled-components";
import { FlexContainer } from "../../styles";
import FormLabel from "../../components/form/FormLabel";
import SchoolLogo from "../../components/SchoolLogo";
import SectionDiv from "../../components/common/SectionDiv";
import CampusDisplayLocationService from "../../services/CampusDisplay/CampusDisplayLocationService";
import Toaster from "../../services/Toaster";
import PageLoadingSpinner from "../../components/common/PageLoadingSpinner";
import iCampusDisplay from "../../types/CampusDisplay/iCampusDisplay";
import Page401 from "../../components/Page401";
import CampusDisplaySlideShow from '../../components/CampusDisplay/CampusDisplaySlideShow';

const Wrapper = styled.div`
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
  const [isLoading, setIsLoading] = useState(false);
  const [campusDisplay, setCampusDisplay] = useState<iCampusDisplay | null>(
    null
  );

  useEffect(() => {
    let isCanceled = false;
    if (`${locationId || ""}`.trim() === "") {
      return;
    }
    setIsLoading(true);
    CampusDisplayLocationService.getAll({
      where: JSON.stringify({
        isActive: true,
        id: locationId
      }),
      perPage: 1,
      include: "CampusDisplay"
    })
      .then(resp => {
        const displays = resp.data || [];
        setCampusDisplay(displays.length > 0 ? (displays[0].CampusDisplay || null) : null);
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
  }, [locationId]);

  const getContent = () => {
    if (isLoading === true) {
      return (
        <FlexContainer
          className={
            "location-selector justify-content-center align-content-center align-items-center"
          }
        >
          <PageLoadingSpinner />
        </FlexContainer>
      );
    }

    if (`${locationId || ""}`.trim() === "") {
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

    if (campusDisplay === null) {
      return (
        <Page401
          title={"Can NOT find the campus display related to this location"}
          description={
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
          }
        />
      );
    }
    return <CampusDisplaySlideShow campusDisplay={campusDisplay} />;
  };

  return <Wrapper>{getContent()}</Wrapper>;
};

export default CampusDisplayPage;
