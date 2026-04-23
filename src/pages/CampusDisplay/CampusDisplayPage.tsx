import { useEffect, useState } from "react";
import styled from "styled-components";
import { FlexContainer } from "../../styles";
import FormLabel from "../../components/form/FormLabel";
import SchoolLogo from "../../components/SchoolLogo";
import SectionDiv from "../../components/common/SectionDiv";
import { Button } from "react-bootstrap";
import CampusDisplayLocationService from "../../services/CampusDisplay/CampusDisplayLocationService";
import Toaster from "../../services/Toaster";
import iCampusDisplayLocation from "../../types/CampusDisplay/iCampusDisplayLocation";
import PageLoadingSpinner from "../../components/common/PageLoadingSpinner";
import UtilsService from '../../services/UtilsService';
import {URL_CAMPUS_DISPLAY_SLIDE_SHOW_BY_LOCATION_PAGE} from '../../Url';

const Wrapper = styled.div`
  height: 100vh;
  .logo-wrapper {
    width: 200px;
    img {
      width: 100% !important;
      height: auto;
    }
  }
  .location-selector {
    gap: 8px;
    .location-selector-item {
      display: flex;
      align-items: center;
      width: calc(50% - 8px);
      //min-width: 150px;
    }
  }
`;
const CampusDisplayPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<iCampusDisplayLocation[]>([]);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    CampusDisplayLocationService.getAll({
      where: JSON.stringify({
        isActive: true
      }),
      sort: "name:ASC",
      perPage: 999999,
      include: "CampusDisplay"
    })
      .then(resp => {
        if (isCancelled === true) {
          return;
        }
        setLocations(resp.data || []);
      })
      .catch(err => {
        if (isCancelled === true) {
          return;
        }
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCancelled === true) {
          return;
        }
        setIsLoading(false);
      });
    return () => {
      isCancelled = true;
    };
  }, []);

  const getLocationList = () => {
    if (isLoading === true) {
      return <PageLoadingSpinner />;
    }

    return (
      <>
        <FormLabel label={"Please select a location to display:"} isRequired />
        <FlexContainer
          className={
            "location-selector flex-wrap justify-content-between align-items-stretch"
          }
        >
          {locations.map(location => {
            return (
              <Button
                variant={"outline-secondary"}
                size={"lg"}
                key={location.id}
                className={"location-selector-item"}
                href={UtilsService.getFullUrl(URL_CAMPUS_DISPLAY_SLIDE_SHOW_BY_LOCATION_PAGE).replace(':locationId', location.id)}
              >
                {location.name}
              </Button>
            );
          })}
        </FlexContainer>
      </>
    );
  };

  return (
    <Wrapper className={'campus-display-page'}>
      <FlexContainer
        className={
          "justify-content-center align-content-center align-items-center flex-column h-100 gap-2 "
        }
      >
        <SectionDiv className={"logo-wrapper space-below"}>
          <SchoolLogo />
        </SectionDiv>
        {getLocationList()}
      </FlexContainer>
    </Wrapper>
  );
};

export default CampusDisplayPage;
