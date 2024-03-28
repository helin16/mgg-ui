import Page from "../../layouts/Page";
import CampusDisplayManagementAdminPage from "./CampusDisplayManagementAdminPage";
import { MGGS_MODULE_ID_CAMPUS_DISPLAY } from "../../types/modules/iModuleUser";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import * as Icons from "react-bootstrap-icons";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { Button } from "react-bootstrap";
import UtilsService from "../../services/UtilsService";
import { URL_CAMPUS_DISPLAY_PAGE } from "../../Url";
import PlayListEditPanel from "../../components/CampusDisplay/Playlist/PlayListEditPanel";
import iCampusDisplayLocation from "../../types/CampusDisplay/iCampusDisplayLocation";
import PageLoadingSpinner from "../../components/common/PageLoadingSpinner";
import { FlexContainer } from "../../styles";
import CampusDisplayLocationSelector from "../../components/CampusDisplay/DisplayLocation/CampusDisplayLocationSelector";
import PageNotFound from "../../components/PageNotFound";
import CampusDisplayLocationService from "../../services/CampusDisplay/CampusDisplayLocationService";
import Toaster from "../../services/Toaster";
import iCampusDisplay from "../../types/CampusDisplay/iCampusDisplay";
import PanelTitle from "../../components/PanelTitle";
import Table, { iTableColumn } from "../../components/common/Table";
import MathHelper from "../../helper/MathHelper";
import CampusDisplayLocationEditPopupBtn from "../../components/CampusDisplay/DisplayLocation/CampusDisplayLocationEditPopupBtn";
import CampusDisplayScheduleList from "../../components/CampusDisplay/DisplaySchedule/CampusDisplayScheduleList";

const Wrapper = styled.div`
  .init-page {
    width: 40%;
    min-width: 400px;
    margin: 2rem auto;
    padding-left: 0px;
    padding-right: 0px;
  }
  .location-list-panel {
    flex: 1;
  }

  .playlist-panel {
    flex: auto;
    padding-left: 1rem;
    max-width: 80%;
  }

  .location-selector {
    min-width: 280px;
    [class$="-menu"] {
      color: black;
    }
  }

  .playlist-panel {
    .panel-title {
      background-color: rgb(90, 90, 90);
    }
    .content-wrapper {
      margin-top: 4px;
    }
  }
`;
const CampusDisplayManagementPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<iCampusDisplayLocation | null>(null);
  const [count, setCount] = useState(0);
  const [defaultPlayList, setDefaultPlayList] = useState<iCampusDisplay | null>(
    null
  );
  const [
    selectedPlayList,
    setSelectedPlayList
  ] = useState<iCampusDisplay | null>(null);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    CampusDisplayLocationService.getAll({
      where: JSON.stringify({
        id: location?.id,
        isActive: true
      }),
      include: "CampusDisplay"
    })
      .then(resp => {
        if (isCancelled === true) {
          return;
        }
        const data = resp.data || [];
        const lists = (data.length > 0 ? [data[0].CampusDisplay] : []).filter(
          list => list !== null
        );
        setSelectedPlayList(null);
        // @ts-ignore
        setDefaultPlayList(lists.length > 0 ? lists[0] : null);
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
  }, [location?.id, count]);

  const getLocationSelector = () => {
    return (
      <CampusDisplayLocationSelector
        className={"location-selector"}
        values={
          // @ts-ignore
          `${location?.id || ""}`.trim() !== ""
            ? // @ts-ignore
              [`${location?.id || ""}`.trim()]
            : undefined
        }
        onSelect={option => {
          setLocation(
            // @ts-ignore
            `${option?.value || ""}`.trim() === ""
              ? null
              : // @ts-ignore
                option.data
          );
        }}
      />
    );
  };

  const handleSelectAPlayList = (selected: iCampusDisplay) => {
    setSelectedPlayList(selected.id === selectedPlayList?.id ? null : selected);
  }

  const getContent = () => {
    if (isLoading === true) {
      return <PageLoadingSpinner />;
    }

    if (location === null) {
      return (
        <PageNotFound
          className={"init-page"}
          title={"select a location"}
          description={"Please select a location below:"}
          primaryBtn={getLocationSelector()}
          secondaryBtn={<div />}
        />
      );
    }

    return (
      <FlexContainer className={"justify-content-between"}>
        <div className={"location-list-panel"}>
          <PanelTitle>
            <FlexContainer className={"align-items-center with-gap lg-gap"}>
              <div>Location: </div>
              {getLocationSelector()}
              {location ? (
                <CampusDisplayLocationEditPopupBtn
                  variant={"secondary"}
                  campusDisplayLocation={location}
                  size={"sm"}
                  onSaved={() => setCount(MathHelper.add(count, 1))}
                >
                  <Icons.Pencil /> Edit
                </CampusDisplayLocationEditPopupBtn>
              ) : null}
            </FlexContainer>
          </PanelTitle>
          <CampusDisplayScheduleList
            locationId={location.id}
            onSelected={playList => handleSelectAPlayList(playList)}
          />
          <Table
            hover
            rows={defaultPlayList ? [defaultPlayList] : []}
            columns={[
              {
                key: "playlist",
                header: (col: iTableColumn) => {
                  return (
                    <th key={col.key}>
                      Default{" "}
                      <small className={"text-muted"}>
                        Change it via Edit btn above
                      </small>
                    </th>
                  );
                },
                cell: (col, data: iCampusDisplay) => {
                  return (
                    <td key={col.key}>
                      <Button
                        variant={"link"}
                        size={"sm"}
                        onClick={() => handleSelectAPlayList(data)}
                      >
                        {data.name}
                      </Button>{" "}
                    </td>
                  );
                }
              }
            ]}
          />
        </div>
        {selectedPlayList === null ? null : (
          <PlayListEditPanel
            className={"playlist-panel"}
            playList={selectedPlayList}
            extraBtns={
              <>
                <Button
                  variant={"secondary"}
                  size={"sm"}
                  title={"Close"}
                  onClick={() => setSelectedPlayList(null)}
                >
                  <Icons.X />
                </Button>
              </>
            }
          />
        )}
      </FlexContainer>
    );
  };

  return (
    <Page
      title={<h3>Campus Display Management</h3>}
      AdminPage={CampusDisplayManagementAdminPage}
      moduleId={MGGS_MODULE_ID_CAMPUS_DISPLAY}
      extraBtns={
        <ButtonGroup>
          <Button
            variant={"link"}
            size={"sm"}
            target={"__BLANK"}
            href={UtilsService.getFullUrl(URL_CAMPUS_DISPLAY_PAGE)}
          >
            <Icons.PlayBtnFill /> Player
          </Button>
        </ButtonGroup>
      }
    >
      <Wrapper>{getContent()}</Wrapper>
    </Page>
  );
};

export default CampusDisplayManagementPage;
