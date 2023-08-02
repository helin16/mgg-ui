import iSynGeneralLedger from '../../../types/Synergetic/Finance/iSynGeneralLedager';
import styled from 'styled-components';
import React, {useEffect, useState} from 'react';
import BTItemService from '../../../services/BudgetTracker/BTItemService';
import Toaster from '../../../services/Toaster';
import iBTItem from '../../../types/BudgetTacker/iBTItem';
import PageLoadingSpinner from '../../../components/common/PageLoadingSpinner';
import {Accordion, Spinner} from 'react-bootstrap';
import BTGLItemsPanel from './BTItemsPanel';
import {mainRed} from '../../../AppWrapper';
import moment from 'moment-timezone';
import FileYearSelector from '../../../components/student/FileYearSelector';
import MathHelper from '../../../helper/MathHelper';
import UtilsService from '../../../services/UtilsService';
import * as _ from 'lodash';
import SynCommunityService from '../../../services/Synergetic/Community/SynCommunityService';
import iSynCommunity from '../../../types/Synergetic/iSynCommunity';
import BTItemExportBtn from './BTItemExportBtn';
import {FlexContainer} from '../../../styles';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/makeReduxStore';
import iBTLockDown from '../../../types/BudgetTacker/iBTLockDown';
import BTLockdownPanel from './BTLockdownPanel';

type iBTGLDetailsPanel = {
  gl: iSynGeneralLedger;
  showingYear: number;
  forceReloadCount?: number;
  onChangeYear: (year: number) => void;
  isReadOnly?: boolean;
  lockDown?: iBTLockDown;
}

type iBTItemMap = {
  requested: iBTItem[];
  approved: iBTItem[];
  pending: iBTItem[];
  declined: iBTItem[];
  requestedByMe: iBTItem[];
  requestedNotByMe: iBTItem[];
}

const initialBTItemMap: iBTItemMap = {
  requested: [],
  approved: [],
  pending: [],
  declined: [],
  requestedByMe: [],
  requestedNotByMe: [],
}
const Wrapper = styled.div`

  .year-selector-wrapper {
    display: inline-block;
    margin-left: 10px;
  }
  .accordion {
    margin-bottom: 1.3rem;
    
    .accordion-item {
      background-color: transparent;
      border: none;
      .accordion-header {
        button {
          background-color: transparent;
          font-size: 16px;
          font-weight: bold;
          font-style: italic;
          border: none;
          border-radius: 0px;
          box-shadow: none;
          color: black;
          padding-bottom:0px;
          padding-top:0px;
        }
      }
      
      &.type-item-panel {
        .accordion-header {
          button {
            color: ${mainRed};
            margin: 0px;
          }
        }
      }

      &.items-requested-user {
        .accordion-header {
          button {
            font-size: 20px;
          }
        }
      }
      
      &.show-sum {
        .accordion-header {
          button {
            position: relative;
            ::after {
              margin-left: 5px;
            }
            
            .sum-div {
              position: absolute;
              right: 20px;
            }
          }
        }
      }
    }

    .accordion-body {
      padding-bottom: 0.4rem;
      padding-top: 0.4rem;
    }
  }
`
const BTGLDetailsPanel = ({gl, showingYear, onChangeYear, forceReloadCount = 0, isReadOnly = false, lockDown}: iBTGLDetailsPanel) => {
  const [isLoading, setIsLoading] = useState(false);
  const [btItemMap, setBtItemMap] = useState<iBTItemMap>(initialBTItemMap);
  const [btItems, setBtItems] = useState<iBTItem[]>([]);
  const {user} = useSelector((state: RootState) => state.auth);

  const [count, setCount] = useState(0);
  const [isLoadingCommunityInfo, setIsLoadingCommunityInfo] = useState(false);
  const [communityMap, setCommunityMap] = useState<{[key: number]: iSynCommunity}>({});

  useEffect(() => {
    let isCanceled = false;
    setIsLoading(true);
    BTItemService.getAll({
      where: JSON.stringify({
        year: showingYear,
        gl_code: gl.GLCode,
      }),
      include: 'BTItemCategory',
      perPage: '9999'
    }).then(resp => {
      if (isCanceled) return;
      setBtItems(resp.data || []);
      setBtItemMap(resp.data.reduce((map, item) => {
        const { requested, pending, approved, declined } = BTItemService.getAmountByType(item);
        return {
          ...map,
          requested: UtilsService.uniqByObjectKey([...(map.requested || []), ...(requested > 0 ? [item]: [])], 'id'),
          approved: UtilsService.uniqByObjectKey([...(map.approved || []), ...(approved > 0 ? [item]: [])], 'id'),
          pending: UtilsService.uniqByObjectKey([...(map.pending || []), ...(pending > 0 ? [item]: [])], 'id'),
          declined: UtilsService.uniqByObjectKey([...(map.declined || []), ...(declined > 0 ? [item]: [])], 'id'),
          requestedByMe: UtilsService.uniqByObjectKey([...(map.requestedByMe || []), ...(item.creator_id === user?.synergyId ? [item]: [])], 'id'),
          requestedNotByMe: UtilsService.uniqByObjectKey([...(map.requestedNotByMe || []), ...(item.creator_id !== user?.synergyId ? [item]: [])], 'id'),
        }
      }, initialBTItemMap));
    }).catch(err => {
      if (isCanceled) return;
      Toaster.showApiError(err);
    }).finally(() => {
      if (isCanceled) return;
      setIsLoading(false);
    });

    return () => {
      isCanceled = true;
    }
  }, [gl.GLCode, showingYear, count, forceReloadCount, user?.synergyId]);

  useEffect(() => {
    if (btItems.length <= 0) {
      return;
    }
    let ids: number[] = [];
    btItems.forEach((item) => {
      if (`${item.creator_id || ''}` !== '') {
        ids.push(item.creator_id || 0);
      }
      if (`${item.author_id || ''}` !== '') {
        ids.push(item.author_id || 0);
      }
    });
    ids = _.uniq(ids);
    if (ids.length <= 0) {
      return;
    }

    let isCanceled = false;
    setIsLoadingCommunityInfo(true);
    SynCommunityService.getCommunityProfiles({
      where: JSON.stringify({
        ID: ids,
      }),
      perPage: '9999'
    }).then(resp => {
        if (isCanceled) return;
        setCommunityMap(resp.data.reduce((map, com) => {
          return {
            ...map,
            [com.ID]: com,
          }
        }, {}))
      }).catch(err => {
        Toaster.showApiError(err);
      }).finally(() => {
        setIsLoadingCommunityInfo(false);
      })
    //eslint-disable-next-line
  }, [JSON.stringify(btItems)]);


  const getLockDownPanel = () => {
    if (!lockDown) {
      return null;
    }
    return <BTLockdownPanel btLockDown={lockDown} />
  }


  if (isLoading) {
    return <PageLoadingSpinner />
  }

  return (
    <Wrapper>
      <h3>
        <span>
          {gl.GLCode} - {gl.GLDescription} {' '} for
        </span>

        <span className={'year-selector-wrapper'}>
          <FileYearSelector
            value={showingYear}
            className={'year-selector'}
            min={moment().subtract('5', 'year').year()}
            max={moment().add('1', 'year').year()}
            onSelect={(newYear) => onChangeYear(newYear || showingYear) } />
        </span>

        <span className={'float-end'}>
          <FlexContainer className={'with-gap'}>
            <div>
              <BTItemExportBtn
                items={btItems}
                size={'sm'}
                isLoading={isLoading || isLoadingCommunityInfo}
                year={showingYear}
                gl={gl}
                communityMap={communityMap}
              />
            </div>
          </FlexContainer>
        </span>
      </h3>
      {getLockDownPanel()}
      {
        Object.keys(btItemMap).map(type => {
          if (isLoadingCommunityInfo) {
            return <Spinner animation={'border'} key={type} />
          }
          if (['requestedByMe', 'requestedNotByMe'].indexOf(type) < 0) {
            return (
              <Accordion key={type}>
                {/* @ts-ignore */}
                <BTGLItemsPanel items={btItemMap[type]}
                  title={`Total ${type}`}
                  type={type}
                  className={'type-item-panel'}
                  forYear={showingYear}
                  gl={gl}
                  communityMap={communityMap}
                  onItemSaved={() => setCount(MathHelper.add(count, 1))}
                  readOnly={isReadOnly}
                  showSum
                />
              </Accordion>
            )
          }
          return (
            <Accordion defaultActiveKey={type} key={type}>
              {/* @ts-ignore */}
              <BTGLItemsPanel items={btItemMap[type]}
                  title={type === 'requestedByMe' ? 'Items requested by me':  'Items requested by others'}
                  type={type}
                  forYear={showingYear}
                  gl={gl}
                  communityMap={communityMap}
                  onItemSaved={() => setCount(MathHelper.add(count, 1))}
                  className={'items-requested-user'}
                  readOnly={isReadOnly}
                  showSum
              />
            </Accordion>
          )
        })
      }
    </Wrapper>
  )
}

export default BTGLDetailsPanel;
