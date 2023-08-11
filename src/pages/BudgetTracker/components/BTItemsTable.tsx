import iBTItem from '../../../types/BudgetTacker/iBTItem';
import MathHelper from '../../../helper/MathHelper';
import UtilsService from '../../../services/UtilsService';
import styled from 'styled-components';
import BTItemCreatePopupBtn from './BTItemCreatePopupBtn';
import iSynGeneralLedger from '../../../types/Synergetic/Finance/iSynGeneralLedager';
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
    display: table;
    .row {
      display: table-row;
      .col {
        display: table-cell;
        padding: 5px 10px;
      }
    }
    
    .header {
      font-weight: bold;
      .col {
        border-bottom: 1px #999 solid;
      }
    }
    
    .item-description {
      min-width: 150px;
    }

    .category {
      width: 20%;
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
      width: 12%;
      max-width: 130px;
      min-width: 90px;
    }
    
    .status {
      width: 10%;
      max-width: 100px;
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
        <div className={'header row'}>
          <div className={'category col'}>Category</div>
          <div className={'item-description col'}>Item</div>
          <div className={'status col'}>Status</div>
          <div className={'req-by col'}>Req. By</div>
          <div className={'req-amt col'}>Req. Amt</div>
          <div className={'approved-amt col'}>Appr. Amt</div>
        </div>
        {
          items.sort((item1, item2) => `${item1.BTItemCategory?.name || ''}` > `${item2.BTItemCategory?.name || ''}` ? -1 : 1)
            .map(item => {
            return (
              <BTItemCreatePopupBtn key={item.id} forYear={forYear} btItem={item} gl={gl} onItemSaved={onItemSaved} forceReadyOnly={readyOnly} className={'item-row with-gaps row'}>
                <div className={'category col'}>
                  {item.BTItemCategory?.name}
                </div>
                <div className={'item-description col'}>
                  {item.description}
                </div>
                <div className={`status ${(item.status || '').toLowerCase()} col`}>
                  {item.status?.toUpperCase()}
                </div>
                <div className={'req-by col'}>{(item.creator_id && (item.creator_id in communityMap)) ? `${communityMap[item.creator_id].Given1} ${communityMap[item.creator_id].Surname}` : ''}</div>
                <div className={'req-amt col'}>
                  {UtilsService.formatIntoCurrency(MathHelper.mul(item.item_cost || 0, item.item_quantity || 0))}
                </div>
                <div className={'approved-amt col'}>
                  {UtilsService.formatIntoCurrency(item.approved_amount || 0)}
                </div>
              </BTItemCreatePopupBtn>
            )
          })
        }
      </div>
    </Wrapper>
  )
}

export default BTItemsTable;
