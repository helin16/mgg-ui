import iHouseAwardEventType from '../../../types/HouseAwards/iHouseAwardEventType';
import React, {useEffect, useState} from 'react';
import HouseAwardEventTypeService from '../../../services/HouseAwards/HouseAwardEventTypeService';
import Toaster from '../../../services/Toaster';
import {Col, Container, Row, Spinner} from 'react-bootstrap';
import styled from 'styled-components';
import iSynLuHouse from '../../../types/Synergetic/Lookup/iSynLuHouse';
import SynLuHouseService from '../../../services/Synergetic/Lookup/SynLuHouseService';
import {CAMPUS_CODE_SENIOR} from '../../../types/Synergetic/Lookup/iSynLuCampus';
import {OP_NOT} from '../../../helper/ServiceHelper';
import * as Icon from 'react-bootstrap-icons';
import {HOUSE_COLOR_GR, HOUSE_COLOR_KT, HOUSE_COLOR_MC, HOUSE_COLOR_SM} from '../../../components/HouseAwards/styles';

type iHouseAwardEventTypes = {
  onSelect: (type: iHouseAwardEventType, luHouse: iSynLuHouse) => void;
  header?: React.ReactElement;
};
const Wrapper = styled.div`
  .house-list {
    
    .house-cell {
      text-align: center;
      padding: 1rem;
      
      .head-title {
        font-size: 16px;
        border: none;
      }

      &.gr {
        .types {
          .type {
            background-color: ${HOUSE_COLOR_GR};
          }
        }
      }
      &.kt {
        .types {
          .type {
            background-color: ${HOUSE_COLOR_KT};
          }
        }
      }
      &.mc {
        .types {
          .type {
            background-color: ${HOUSE_COLOR_MC};
          }
        }
      }
      &.sm {
        .types {
          .type {
            background-color: ${HOUSE_COLOR_SM};
          }
        }
      }
      
      .types {
        display: flex;
        justify-content: center;
        
        .type {
          cursor: pointer;
          color: white;
          padding: 0rem 0.1rem 0.7rem 0.1rem;
          width: 6.5rem;
          text-align: center;
          .icon {
            font-size: 54px;
            margin-bottom: 0.4rem;
          }
          border: 1px white solid;
        }
      }
    }
  }
`;
const HouseAwardEventTypes = ({onSelect, header}: iHouseAwardEventTypes) => {
  const [isLoading, setIsLoading] = useState(false);
  const [houseAwardEventTypes, setHouseAwardEventTypes] = useState<iHouseAwardEventType[]>([]);
  const [luHouses, setLuHouses] = useState<iSynLuHouse[]>([]);

  useEffect(() => {
    let isCanceled = false;
    setIsLoading(true);
    Promise.all([
        HouseAwardEventTypeService.getEventTypes({
          where: JSON.stringify({active: true})
        }),
        SynLuHouseService.getLuHouses({
          where: JSON.stringify({Campus: CAMPUS_CODE_SENIOR, Code: {[OP_NOT]: ''}, HeadOfHouseID: {[OP_NOT]: null}}),
        }),
      ])
      .then(resp => {
        if (isCanceled) return;
        setHouseAwardEventTypes(resp[0]);
        setLuHouses(resp[1]);
      })
      .catch(err => {
        if (isCanceled) return;
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) return;
        setIsLoading(false);
      })
    return () => {
      isCanceled = true;
    }
  }, []);

  const getTypeIcon = (index: number) => {
    if (index === 0) {
      return <Icon.TrophyFill />
    }
    return <Icon.LifePreserver />;
  }

  const getTypes = (house: iSynLuHouse) => {
    if (houseAwardEventTypes.length <= 0) {
      return null;
    }
    return (
      <div className={'types'}>
        {
          houseAwardEventTypes.map((type, index) => {
            return (
              <div className={`type ${type.name.toLowerCase()}`} key={type.id} onClick={() => onSelect(type, house)}>
                <div className={'icon'}>
                  {getTypeIcon(index)}
                </div>
                <div>{type.name}</div>
              </div>
            )
          })
        }
      </div>
    )
  }

  const getContent = () => {
    if (houseAwardEventTypes.length <= 0){
      return null;
    }

    return (
      <Container>
        <Row className={'house-list'}>
          {luHouses.map(house => {
            return (
              <Col md={6} className={`house-cell ${house.Code.toLowerCase()}`} key={house.Code.toLowerCase()}>
                <h6 className={'title'}>{house.Description}</h6>
                {getTypes(house)}
              </Col>
            )
          })}
        </Row>
      </Container>
    )
  }


  if (isLoading) {
    return <Spinner animation={'border'} />
  }
  return (
    <Wrapper>
      {header}
      {getContent()}
    </Wrapper>
  )
}

export default HouseAwardEventTypes;
