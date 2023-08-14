import iBTItem from "../../../types/BudgetTacker/iBTItem";
import MathHelper from "../../../helper/MathHelper";
import UtilsService from "../../../services/UtilsService";
import styled from "styled-components";
import BTItemCreatePopupBtn from "./BTItemCreatePopupBtn";
import iSynGeneralLedger from "../../../types/Synergetic/Finance/iSynGeneralLedager";
import iSynCommunity from "../../../types/Synergetic/iSynCommunity";
import { useEffect, useState } from "react";
import * as Icons from "react-bootstrap-icons";

type iBTGLItemsTable = {
  items: iBTItem[];
  gl: iSynGeneralLedger;
  forYear: number;
  className?: string;
  onItemSaved?: (newItem: iBTItem) => void;
  onItemSelected?: (items: iBTItem[], selected: boolean) => void;
  communityMap?: { [key: number]: iSynCommunity };
  selectedItems?: iBTItem[];
  readyOnly?: boolean;
};

const Wrapper = styled.div`
  font-size: 12px;
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
      min-width: 120px;
      max-width: 300px;
      > div {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .category {
      width: 20%;
      max-width: 300px;
      min-width: 150px;
    }

    .item-row {
      &.cursor:hover {
        background-color: #ccc;
        cursor: pointer;
      }
      > div {
        padding: 6px 4px;
      }
    }

    .btns {
      width: 40px;
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
const BTItemsTable = ({
  className,
  items,
  gl,
  forYear,
  onItemSaved,
  communityMap = {},
  readyOnly = false,
  selectedItems,
  onItemSelected
}: iBTGLItemsTable) => {
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);

  useEffect(() => {
    setSelectedItemIds((selectedItems || []).map(item => Number(item.id)));
  }, [selectedItems]);

  const allSelected =
    items.filter(item => selectedItemIds.indexOf(Number(item.id)) < 0).length <=
    0;
  return (
    <Wrapper className={className}>
      <div className={"items-table"}>
        <div className={"header row"}>
          {(onItemSelected && readyOnly !== true) ? (
            <div
              className={"btns col"}
              onClick={() =>
                onItemSelected && onItemSelected(items, !allSelected)
              }
            >
              {allSelected === true ? (
                <span className={"text-success"}>
                  <Icons.CheckSquareFill />
                </span>
              ) : (
                <Icons.Square />
              )}
            </div>
          ) : null}
          <div className={"category col"}>Category</div>
          <div className={"item-description col"}>Item</div>
          <div className={"status col"}>Status</div>
          <div className={"req-by col"}>Req. By</div>
          <div className={"req-amt col"}>Req. Amt</div>
          <div className={"approved-amt col"}>Appr. Amt</div>
        </div>
        {items
          .sort((item1, item2) =>
            `${item1.BTItemCategory?.name || ""}` >
            `${item2.BTItemCategory?.name || ""}`
              ? -1
              : 1
          )
          .map(item => {
            const props = {
              forYear,
              btItem: item,
              gl,
              onItemSaved: onItemSaved ? onItemSaved : () => null,
              forceReadyOnly: readyOnly,
              hidePopup: onItemSaved === undefined,
            };

            const hasSelected = selectedItemIds.indexOf(Number(item.id)) >= 0;
            return (
              <div className={`item-row with-gaps row ${ onItemSaved ? 'cursor' : ''}`} key={item.id}>
                {(onItemSelected && readyOnly !== true) ? (
                  <div
                    className={"btns col"}
                    onClick={() =>
                      onItemSelected && onItemSelected([item], !hasSelected)
                    }
                  >
                    {hasSelected === true ? (
                      <span className={"text-success"}>
                        <Icons.CheckSquareFill />
                      </span>
                    ) : (
                      <Icons.Square />
                    )}
                  </div>
                ) : null}
                <BTItemCreatePopupBtn className={"category col"} {...props}>
                  {item.BTItemCategory?.name}
                </BTItemCreatePopupBtn>
                <BTItemCreatePopupBtn
                  className={"item-description col"}
                  {...props}
                >
                  <div><b>{item.name}</b></div>
                  <div>{item.description}</div>
                </BTItemCreatePopupBtn>
                <BTItemCreatePopupBtn
                  className={`status ${(item.status || "").toLowerCase()} col`}
                  {...props}
                >
                  {item.status?.toUpperCase()}
                </BTItemCreatePopupBtn>
                <BTItemCreatePopupBtn className={"req-by col"} {...props}>
                  {item.creator_id && item.creator_id in communityMap
                    ? `${communityMap[item.creator_id].Given1} ${
                        communityMap[item.creator_id].Surname
                      }`
                    : ""}
                </BTItemCreatePopupBtn>
                <BTItemCreatePopupBtn className={"req-amt col"} {...props}>
                  {UtilsService.formatIntoCurrency(
                    MathHelper.mul(item.item_cost || 0, item.item_quantity || 0)
                  )}
                </BTItemCreatePopupBtn>
                <BTItemCreatePopupBtn className={"approved-amt col"} {...props}>
                  {UtilsService.formatIntoCurrency(item.approved_amount || 0)}
                </BTItemCreatePopupBtn>
              </div>
            );
          })}
      </div>
    </Wrapper>
  );
};

export default BTItemsTable;
