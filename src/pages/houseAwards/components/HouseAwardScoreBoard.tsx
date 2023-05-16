import iSynLuHouse from '../../../types/Synergetic/iSynLuHouse';
import iHouseAwardEventType from '../../../types/HouseAwards/iHouseAwardEventType';
import styled from 'styled-components';
import {HOUSE_COLOR_GR, HOUSE_COLOR_KT, HOUSE_COLOR_MC, HOUSE_COLOR_SM} from '../../../components/HouseAwards/styles';
import * as Icon from 'react-bootstrap-icons';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/makeReduxStore';
import {useEffect, useState} from 'react';
import {Alert, Col, Row, Spinner} from 'react-bootstrap';
import Toaster from '../../../services/Toaster';
import {CAMPUS_CODE_SENIOR} from '../../../types/Synergetic/iLuCampus';
import iLuYearLevel from '../../../types/Synergetic/iLuYearLevel';
import SynLuYearLevelService from '../../../services/Synergetic/SynLuYearLevelService';
import HouseAwardScoreTable from './HouseAwardScoreTable';
import HouseAwardEventService from '../../../services/HouseAwards/HouseAwardEventService';
import iHouseAwardEvent from '../../../types/HouseAwards/iHouseAwardEvent';
import moment from 'moment-timezone';
import {FlexContainer} from '../../../styles';
import UserService from '../../../services/UserService';
import {MGGS_MODULE_ID_HOUSE_AWARDS} from '../../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN} from '../../../types/modules/iRole';
import YearLevelSelector from '../../../components/student/YearLevelSelector';
import FileYearSelector from '../../../components/student/FileYearSelector';

type iHouseAwardScoreBoard = {
  house: iSynLuHouse;
  type: iHouseAwardEventType;
  campusCodes?: string[];
  onCancel: () => void;
}
const Wrapper = styled.div`
  .title-row {
    font-size: 23px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
    padding-left: calc(var(--bs-gutter-x) * .5);
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
    padding: 1rem 0 2rem;
    display: flex;
    gap: 0.4rem;
  }
  
  .selector,
  .selector {
    z-index: 9999;
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
  
  .table {
    &.sticky {
      .body {
        .tr {
          &:hover {
            .td {
              background-color: #ddd !important;
            }
          }
          .td:last-child,
          .td:nth-last-child(2),
          .td:nth-last-child(3) {
            background-color: #ededed;
          }
        }
      }

      [data-sticky-td] {
        position: sticky;
        background-color: #ededed;
      }

      [data-sticky-last-left-td] {
        box-shadow: 2px 0px 3px #ccc;
      }

      [data-sticky-first-right-td] {
        box-shadow: -2px 0px 3px #ccc;
      }
    }
  }
`;
const HouseAwardScoreBoard = ({
  house,
  type,
  campusCodes = [CAMPUS_CODE_SENIOR],
  onCancel
}: iHouseAwardScoreBoard) => {
  const {user} = useSelector((root: RootState) => root.auth);
  const currentFileYear = Number(user?.SynCurrentFileSemester?.FileYear || moment().year());

  const [isLoading, setIsLoading] = useState(false);
  const [selectedYearLevel, setSelectedYearLevel] = useState<iLuYearLevel | null>(null);
  const [events, setEvents] = useState<iHouseAwardEvent[]>([]);
  const [selectedFileYear, setSelectedFileYear] = useState(currentFileYear);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let isCanceled = false;

    setIsLoading(true);
    Promise.all([
      SynLuYearLevelService.getAllYearLevels({
        where: JSON.stringify({
          Campus: campusCodes,
        }),
        sort: 'YearLevelSort:ASC'
      }),
      HouseAwardEventService.getEvents({
        where: JSON.stringify({
          active: 1,
        }),
        sort: 'Name:ASC',
      }),
      UserService.getUsers({
        where: JSON.stringify({
          Active: true,
          ModuleID: MGGS_MODULE_ID_HOUSE_AWARDS,
          RoleID: ROLE_ID_ADMIN,
          SynergeticID: user?.synergyId || 0,
        }),
      })
    ]).then(resp => {
      if (isCanceled) return;
      if (resp[0].length > 0) {
        setSelectedYearLevel(resp[0][0])
      }
      setEvents(resp[1]);
      setIsAdmin(resp[2].length > 0);
    }).catch(err => {
      if (isCanceled) return;
      Toaster.showApiError(err)
    }).finally(() => {
      if (isCanceled) return;
      setIsLoading(false);
    });

    return () => {
      isCanceled = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [house, type, JSON.stringify(campusCodes), user]);

  const getIsDisabled = () => {
    if (!user) {
      return true;
    }

    if (isAdmin) {
      return false
    }

    if (selectedFileYear < currentFileYear) {
      return true;
    }

    if (Number(user?.synergyId || 0) !== house.HeadOfHouseID) {
      return true;
    }

    return false;
  }

  const getDisabledMsg = () => {
    if (!user || isAdmin) {
      return null;
    }
    if (user.synergyId === house.HeadOfHouseID) {
      return null;
    }
    return (
      <FlexContainer className={'space-below'}>
        <Alert variant={'danger'} className={'full-width'}>
          Board can ONLY be updated by Head of House: <b>{house.HeadOfHouse}</b> ({house.HeadOfHouseID})
        </Alert>
      </FlexContainer>
    )
  }

  if (isLoading) {
    return <Spinner animation={'border'} />
  }

  return (
    <Wrapper>
      <Row className={`title-row ${house.Code.toLowerCase()}`}>
        <Col className={'menu-div'} md={8}>
          <div className={'icon-btn'} onClick={() => onCancel()} title={'back to house selection'}><Icon.ArrowLeft /></div>
          <div><Icon.Speedometer2 /></div>
          <div>{`Board for ${type.name} in House: ${house.Description}`}</div>
        </Col>
        <Col md={2} sm={6} xs={6}>
          <FileYearSelector
            className={'selector'}
            onSelect={(newYear) => setSelectedFileYear(newYear || moment().year())}
            value={selectedFileYear}
            min={moment().subtract(5, 'year').year()}
          />
        </Col>
        <Col md={2} sm={6} xs={6}>
          <YearLevelSelector
            campusCodes={[CAMPUS_CODE_SENIOR]}
            classname={'selector'}
            values={selectedYearLevel ? [`${selectedYearLevel?.Code}`] : []}
            onSelect={(options) => {
              // @ts-ignore
              setSelectedYearLevel(options?.data || null)
            }}
          />
        </Col>
      </Row>
      <div className={`summary-row ${house.Code.toLowerCase()}`}>
      </div>
      {getDisabledMsg()}
      {selectedYearLevel && (
        <HouseAwardScoreTable
          house={house}
          type={type}
          yearLevel={selectedYearLevel}
          events={events}
          fileYear={selectedFileYear}
          isDisabled={getIsDisabled()}
        />
      )}
    </Wrapper>
  );
}

export default HouseAwardScoreBoard;
