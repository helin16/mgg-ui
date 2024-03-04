import styled from "styled-components";
import React, { useCallback, useEffect, useState } from "react";
import iCampusDisplaySlide from "../../../types/CampusDisplay/iCampusDisplaySlide";
import CampusDisplayDefaultSlide from "./CampusDisplayDefaultSlide";
import iCampusDisplay from "../../../types/CampusDisplay/iCampusDisplay";
import CampusDisplaySlideService from "../../../services/CampusDisplay/CampusDisplaySlideService";
import Toaster from "../../../services/Toaster";
import PageLoadingSpinner from "../../common/PageLoadingSpinner";
import { Button } from "react-bootstrap";
import MathHelper from "../../../helper/MathHelper";
import CampusDisplayLocationService from "../../../services/CampusDisplay/CampusDisplayLocationService";
import Page401 from "../../Page401";
import { FlexContainer } from "../../../styles";
import moment from "moment-timezone";
import iCampusDisplayLocation from "../../../types/CampusDisplay/iCampusDisplayLocation";
import SchoolLogo from "../../SchoolLogo";
import SectionDiv from "../../common/SectionDiv";
import CampusDisplaySlideShow from "./CampusDisplaySlideShow";
import LocalStorageService, {
  STORAGE_COLUMN_KEY_CAMPUS_DISPLAY_SLIDES
} from "../../../services/LocalStorageService";
import AssetService from "../../../services/Asset/AssetService";

type iCampusDisplaySlideShowPanel = {
  locationId: string;
  className?: string;
  onCancel?: () => void;
  onLocationLoaded?: (location: iCampusDisplayLocation | null) => void;
};

const Wrapper = styled.div`
  background-color: transparent;
  height: 100%;
  max-height: 100vh !important;

  .carousel-item {
    width: 100%;
    height: 100%;
  }

  .no-display {
    height: 100%;
    background-color: white;
  }
`;

type iCampusSlideMap = { [key: string]: iCampusDisplaySlide };
const CampusDisplaySlideShowByLocationId = ({
  locationId,
  onCancel,
  onLocationLoaded,
  className
}: iCampusDisplaySlideShowPanel) => {
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [cdSlides, setCdSlides] = useState<iCampusDisplaySlide[]>([]);
  const [campusDisplay, setCampusDisplay] = useState<iCampusDisplay | null>(
    null
  );
  const [
    displayLocation,
    setDisplayLocation
  ] = useState<iCampusDisplayLocation | null>(null);

  const getSlidesFromDB = useCallback(async () => {
    const result = await CampusDisplayLocationService.getAll({
      where: JSON.stringify({
        isActive: true,
        id: locationId
      }),
      perPage: 1,
      include: "CampusDisplay"
    });

    const locations = result.data || [];
    if (
      locations.length <= 0 ||
      `${locations[0].displayId || ""}`.trim() === ""
    ) {
      return;
    }

    const location = locations[0];
    const display = location.CampusDisplay;

    const slidesFromDB =
      (
        await CampusDisplaySlideService.getAll({
          where: JSON.stringify({
            isActive: true,
            displayId: `${display?.id || ""}`.trim()
          }),
          include: "Asset",
          perPage: 999999,
          sort: "sortOrder:ASC"
        })
      ).data || [];

    setCampusDisplay(display || null);
    setDisplayLocation(location || null);
    const slideIdsFromDB = slidesFromDB.map(slide => slide.id);

    const previousLocalSlides: iCampusSlideMap =
      LocalStorageService.getItem(STORAGE_COLUMN_KEY_CAMPUS_DISPLAY_SLIDES) ||
      {};

    const slidesFromDBWithLocalStorage = await Promise.all(
      slidesFromDB
        .filter(slideFromDB => {
          return !(
            !slideFromDB.Asset ||
            !slideFromDB.Asset?.externalId ||
            `${slideFromDB.Asset?.externalId || ""}`.trim() === "" ||
            `${slideFromDB.Asset?.externalId || ""}` in previousLocalSlides
          );
        })
        .map(async slideFromDB => {
          if (
            !slideFromDB.Asset ||
            !slideFromDB.Asset?.externalId ||
            `${slideFromDB.Asset?.externalId || ""}`.trim() === ""
          ) {
            return null;
          }
          try {
            return {
              [slideFromDB.Asset?.externalId]: {
                ...slideFromDB,
                Asset: {
                  ...(slideFromDB.Asset || {}),
                  url: await AssetService.downloadAssetToBeBase64(
                    slideFromDB.Asset?.url || ""
                  )
                }
              }
            };
          } catch (error) {
            console.error("Error fetching image:", error);
            return null;
          }
        })
    );

    const localSlides = {
      ...Object.keys(previousLocalSlides)
        .filter(id => slideIdsFromDB.indexOf(id) >= 0)
        .reduce((map: iCampusSlideMap, key) => {
          return {
            ...map,
            [key]: previousLocalSlides[key],
          };
        }, {}),
      ...slidesFromDBWithLocalStorage
        .filter(slide => slide !== null)
        .reduce((map: iCampusSlideMap, arr) => {
          return {
            ...map,
            ...arr
          };
        }, {})
    };

    LocalStorageService.setItem(STORAGE_COLUMN_KEY_CAMPUS_DISPLAY_SLIDES, localSlides);
    setCdSlides(prevSlides => {
      const currentSlideIds = prevSlides.map(slide => slide.id);
      if (currentSlideIds !== slideIdsFromDB) {
        return Object.values(localSlides)
          .filter(slide => slide)
          .sort((slide1: iCampusDisplaySlide, slide2: iCampusDisplaySlide) =>
            (slide1.sortOrder || 0) > (slide2.sortOrder || 0) ? 1 : -1
          );
      }
      return prevSlides;
    });
  }, []);

  useEffect(() => {
    let isCanceled = false;

    if (count <= 0) {
      setIsLoading(true);
    }
    getSlidesFromDB()
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
  }, [locationId, count, getSlidesFromDB]);

  useEffect(() => {
    onLocationLoaded && onLocationLoaded(displayLocation);
  }, [displayLocation, onLocationLoaded]);

  useEffect(() => {
    let reloadTimeOut: NodeJS.Timeout | null = null;
    const calculateTimeUntilMidnight = () => {
      const now = moment();
      const midnight = moment().endOf("day");

      return midnight.diff(now);
    };

    const reloadAtMidnight = () => {
      const timeUntilMidnight = calculateTimeUntilMidnight();

      reloadTimeOut = setTimeout(() => {
        window.location.reload(); // Reload the page
      }, timeUntilMidnight);
    };

    reloadAtMidnight(); // Initial schedule

    return () => {
      reloadTimeOut && clearTimeout(reloadTimeOut);
    };
  }, []);

  useEffect(() => {
    if (!displayLocation) {
      return;
    }
    let isCanceled = false;
    let timeout: NodeJS.Timeout | null = null;
    const getData = () => {
      return CampusDisplayLocationService.getById(displayLocation.id)
        .then(resp => {
          if (isCanceled) {
            return;
          }
          if (
            `${resp.id || ""}`.trim() === "" ||
            resp.isActive !== true ||
            (resp?.version || 0) <= (displayLocation?.version || 0)
          ) {
            return;
          }

          setCount(prev => MathHelper.add(prev, 1));
          return;
        })
        .catch(() => {
          // don't do anything when you catch an error
        })
        .finally(() => {
          if (isCanceled) {
            return;
          }
          timeout = setTimeout(() => getData(), 30000);
        });
    };

    getData();

    return () => {
      timeout && clearTimeout(timeout);
      isCanceled = true;
    };
  }, [displayLocation]);

  const getContent = () => {
    if (isLoading === true) {
      return (
        <FlexContainer
          className={
            "no-display justify-content-center align-items-center flex-column"
          }
        >
          <SchoolLogo />
          <SectionDiv>
            <PageLoadingSpinner />
          </SectionDiv>
        </FlexContainer>
      );
    }

    if (!campusDisplay || `${campusDisplay?.id || ""}`.trim() === "") {
      return (
        <FlexContainer
          className={"no-display justify-content-center align-items-center"}
        >
          <Page401
            title={"Can NOT find the campus display related to this location"}
            btns={
              <Button
                variant={"primary"}
                onClick={() => onCancel && onCancel()}
              >
                Select again
              </Button>
            }
          />
        </FlexContainer>
      );
    }

    if (cdSlides.length <= 0) {
      return <CampusDisplayDefaultSlide campusDisplay={campusDisplay} />;
    }

    return (
      <CampusDisplaySlideShow slides={cdSlides} playList={campusDisplay} />
    );
  };

  return (
    <Wrapper className={`slide-wrapper ${className || ""}`}>
      {getContent()}
    </Wrapper>
  );
};

export default CampusDisplaySlideShowByLocationId;
