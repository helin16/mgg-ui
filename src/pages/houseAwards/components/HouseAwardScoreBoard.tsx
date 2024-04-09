import iSynLuHouse from "../../../types/Synergetic/Lookup/iSynLuHouse";
import iHouseAwardEventType from "../../../types/HouseAwards/iHouseAwardEventType";
import styled from "styled-components";
import {
  HOUSE_COLOR_GR,
  HOUSE_COLOR_KT,
  HOUSE_COLOR_MC,
  HOUSE_COLOR_SM
} from "../../../components/HouseAwards/styles";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/makeReduxStore";
import { useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import Toaster from "../../../services/Toaster";
import { CAMPUS_CODE_SENIOR } from "../../../types/Synergetic/Lookup/iSynLuCampus";
import ISynLuYearLevel from "../../../types/Synergetic/Lookup/iSynLuYearLevel";
import SynLuYearLevelService from "../../../services/Synergetic/Lookup/SynLuYearLevelService";
import HouseAwardScoreTable from "./HouseAwardScoreTable";
import HouseAwardEventService from "../../../services/HouseAwards/HouseAwardEventService";
import iHouseAwardEvent from "../../../types/HouseAwards/iHouseAwardEvent";
import moment from "moment-timezone";
import { FlexContainer } from "../../../styles";
import UserService from "../../../services/UserService";
import { MGGS_MODULE_ID_HOUSE_AWARDS } from "../../../types/modules/iModuleUser";
import { ROLE_ID_ADMIN } from "../../../types/modules/iRole";
import YearLevelSelector from "../../../components/student/YearLevelSelector";
import FileYearSelector from "../../../components/student/FileYearSelector";
import IconDisplay from "../../../components/IconDisplay";
import ExplanationPanel from "../../../components/ExplanationPanel";

type iHouseAwardScoreBoard = {
  house: iSynLuHouse;
  type: iHouseAwardEventType;
  campusCodes?: string[];
  onCancel: () => void;
};
const Wrapper = styled.div`
  .title-row {
    font-size: 23px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
    padding-left: calc(var(--bs-gutter-x) * 0.5);
    &.gr {
      background-color: ${HOUSE_COLOR_GR};
    }
    &.kt {
      background-color: ${HOUSE_COLOR_KT};
    }
    &.mc {
      background-color: ${HOUSE_COLOR_MC};
    }
    &.sm {
      background-color: ${HOUSE_COLOR_SM};
    }
    .menu-div {
      display: flex;
      gap: 0.4rem;
      padding-left: 0px;
      .icon-btn {
        cursor: pointer;
      }
    }
    div[class^="col-"] {
      padding-left: 0px;
    }
  }

  .summary-row {
    font-weight: bold;
    padding: 1rem 0 0.3rem;
    display: flex;
    gap: 0.4rem;
  }

  .selector {
    font-size: 14px;
    color: #1a1e21;
  }

  .fileYear-selector {
    font-size: 11px;
    [class$="-Input"],
    [class$="-indicatorContainer"],
    [class$="-ValueContainer"] {
      padding: 0px;
      margin: 0px;
    }
    [class$="-indicatorSeparator"] {
      display: none;
    }
    [class$="-control"] {
      min-height: auto;
    }
  }

  .students-table {
    max-height: calc(100vh - 10rem);
  }
`;
const HouseAwardScoreBoard = ({
  house,
  type,
  campusCodes = [CAMPUS_CODE_SENIOR],
  onCancel
}: iHouseAwardScoreBoard) => {
  const { user } = useSelector((root: RootState) => root.auth);
  const currentFileYear = Number(
    user?.SynCurrentFileSemester?.FileYear || moment().year()
  );

  const [isLoading, setIsLoading] = useState(false);
  const [
    selectedYearLevel,
    setSelectedYearLevel
  ] = useState<ISynLuYearLevel | null>(null);
  const [events, setEvents] = useState<iHouseAwardEvent[]>([]);
  const [selectedFileYear, setSelectedFileYear] = useState(currentFileYear);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let isCanceled = false;

    setIsLoading(true);
    Promise.all([
      SynLuYearLevelService.getAllYearLevels({
        where: JSON.stringify({
          Campus: campusCodes
        }),
        sort: "YearLevelSort:ASC"
      }),
      HouseAwardEventService.getEvents({
        where: JSON.stringify({
          active: 1
        }),
        sort: "Name:ASC"
      }),
      UserService.getUsers({
        where: JSON.stringify({
          Active: true,
          ModuleID: MGGS_MODULE_ID_HOUSE_AWARDS,
          RoleID: ROLE_ID_ADMIN,
          SynergeticID: user?.synergyId || 0
        })
      })
    ])
      .then(resp => {
        if (isCanceled) return;
        if (resp[0].length > 0) {
          setSelectedYearLevel(resp[0][0]);
        }
        setEvents(resp[1]);
        setIsAdmin(resp[2].length > 0);
      })
      .catch(err => {
        if (isCanceled) return;
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) return;
        setIsLoading(false);
      });

    return () => {
      isCanceled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [house, type, JSON.stringify(campusCodes), user]);

  const getIsDisabled = () => {
    if (!user) {
      return true;
    }

    if (selectedFileYear < currentFileYear) {
      return true;
    }

    if (isAdmin) {
      return false;
    }

    if (Number(user?.synergyId || 0) !== house.HeadOfHouseID) {
      return true;
    }

    return false;
  };

  const getDisabledMsg = () => {
    if (getIsDisabled() !== true) {
      return null;
    }
    return (
      <ExplanationPanel
        variant={"danger"}
        className={"full-width"}
        text={
          <>
            <b>Boarded in view only.</b>
            <ul>
              {((user?.synergyId || 0) !== house.HeadOfHouseID && isAdmin !== true) ? (
                <li>
                  Board can ONLY be updated by Head of House:{" "}
                  <b>{house.HeadOfHouse}</b> ({house.HeadOfHouseID}) or an admin
                  of this module.
                </li>
              ) : null}
              {selectedFileYear < currentFileYear ? (
                <li>
                  Selected year({selectedFileYear}) in the past.
                </li>
              ) : null}
            </ul>
          </>
        }
      />
    );
  };

  if (isLoading) {
    return <Spinner animation={"border"} />;
  }

  return (
    <Wrapper>
      <Row className={`title-row ${house.Code.toLowerCase()}`}>
        <Col className={"menu-div"} md={8}>
          <div
            className={"icon-btn"}
            onClick={() => onCancel()}
            title={"back to house selection"}
          >
            <IconDisplay name={"ArrowLeft"} />
          </div>
          <div>
            <IconDisplay name={"Speedometer2"} />
          </div>
          <div>
            Board for <i>{type.name}</i> in House: <u>{house.Description}</u>
          </div>
        </Col>
        <Col md={3}>
          <FlexContainer className={"justify-content-end with-gap lg-gap"}>
            <FileYearSelector
              className={"selector year-selector"}
              onSelect={newYear =>
                setSelectedFileYear(newYear || moment().year())
              }
              value={selectedFileYear}
              min={moment()
                .subtract(5, "year")
                .year()}
            />
            <YearLevelSelector
              campusCodes={[CAMPUS_CODE_SENIOR]}
              classname={"selector"}
              values={selectedYearLevel ? [`${selectedYearLevel?.Code}`] : []}
              onSelect={options => {
                // @ts-ignore
                setSelectedYearLevel(options?.data || null);
              }}
            />
          </FlexContainer>
        </Col>
      </Row>
      {getDisabledMsg()}
      {selectedYearLevel && (
        <HouseAwardScoreTable
          house={house}
          type={type}
          yearLevel={selectedYearLevel}
          events={events}
          fileYear={selectedFileYear}
          isDisabled={getIsDisabled()}
          isAwardable={(type.points_to_be_awarded || 0) > 0}
        />
      )}
    </Wrapper>
  );
};

export default HouseAwardScoreBoard;
