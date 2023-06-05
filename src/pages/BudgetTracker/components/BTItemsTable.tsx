import iBTItem from '../../../types/BudgetTacker/iBTItem';
import MathHelper from '../../../helper/MathHelper';
import UtilsService from '../../../services/UtilsService';
import styled from 'styled-components';
import BTItemCreatePopupBtn from './BTItemCreatePopupBtn';
import iSynGeneralLedger from '../../../types/Synergetic/Finance/iSynGeneralLedager';
import {FlexContainer} from '../../../styles';
import iSynCommunity from '../../../types/Synergetic/iSynCommunity';

type iBTGLItemsTable = {
  items: iBTItem[];
  gl: iSynGeneralLedger;
  forYear: number;
  className?: string;
  onItemSaved: (newItem: iBTItem) => void;
  communityMap?: {[key: number]: iSynCommunity};
  readyOnly?: boolean;
}

const Wrapper = styled.div`
  font-size: 11px;
  overflow: auto;
  .items-table {
    .header {
      font-weight: bold;
      border-bottom: 1px #999 solid;
    }
    
    .item-description {
      flex: auto;
      min-width: 150px;
    }

    .category {
      width: 300px;
      max-width: 300px;
      min-width: 150px;
    }
    
    .item-row {
      &:hover {
        background-color: #ccc;
        cursor: pointer;
      }
      > div {
        padding: 6px 4px;
      }
    }
    
    .req-amt,
    .req-by,
    .approved-amt {
      text-align: right;
      width: 120px;
      min-width: 120px;
      max-width: 120px;
    }
    
    .status {
      width: 100px;
      max-width: 100px;
      min-width: 100px;
      &.approved {
        background-color: green;
        color: white;
      }

      &.declined {
        background-color: red;
        color: white;
      }
    }
  }
`;
const BTItemsTable = ({className, items, gl, forYear, onItemSaved, communityMap = {}, readyOnly = false}: iBTGLItemsTable) => {

  return (
    <Wrapper className={className}>
      <div className={'items-table'}>
        <FlexContainer className={'header with-gaps'}>
          <div className={'category'}>Category</div>
          <div className={'item-description'}>Item</div>
          <div className={'status'}>Status</div>
          <div className={'req-by'}>Req. By</div>
          <div className={'req-amt'}>Req. Amt</div>
          <div className={'approved-amt'}>Appr. Amt</div>
        </FlexContainer>
        {
          items.sort((item1, item2) => `${item1.BTItemCategory?.name || ''}` > `${item2.BTItemCategory?.name || ''}` ? -1 : 1)
            .map(item => {
            return (
              <BTItemCreatePopupBtn key={item.id} forYear={forYear} btItem={item} gl={gl} onItemSaved={onItemSaved} forceReadyOnly={readyOnly}>
                <FlexContainer className={'item-row with-gaps'}>
                  <div className={'category'}>
                    {item.BTItemCategory?.name}
                  </div>
                  <div className={'item-description'}>
                    {item.description}
                  </div>
                  <div className={`status ${(item.status || '').toLowerCase()}`}>
                    {item.status?.toUpperCase()}
                  </div>
                  <div className={'req-by'}>{(item.creator_id && (item.creator_id in communityMap)) ? `${communityMap[item.creator_id].Given1} ${communityMap[item.creator_id].Surname}` : ''}</div>
                  <div className={'req-amt'}>
                    {UtilsService.formatIntoCurrency(MathHelper.mul(item.item_cost || 0, item.item_quantity || 0))}
                  </div>
                  <div className={'approved-amt'}>
                    {UtilsService.formatIntoCurrency(item.approved_amount || 0)}
                  </div>
                </FlexContainer>
              </BTItemCreatePopupBtn>
            )
          })
        }
      </div>
    </Wrapper>
  )
}

export default BTItemsTable;
