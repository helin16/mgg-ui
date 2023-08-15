import iSynGeneralLedger from "../../../types/Synergetic/Finance/iSynGeneralLedager";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import BTItemService from "../../../services/BudgetTracker/BTItemService";
import Toaster, { TOAST_TYPE_ERROR } from "../../../services/Toaster";
import iBTItem, {
  BT_ITEM_STATUS_APPROVED,
  BT_ITEM_STATUS_DECLINED,
  BT_ITEM_STATUS_NEW
} from "../../../types/BudgetTacker/iBTItem";
import PageLoadingSpinner from "../../../components/common/PageLoadingSpinner";
import { Button, FormControl, Spinner, Table } from "react-bootstrap";
import moment from "moment-timezone";
import FileYearSelector from "../../../components/student/FileYearSelector";
import MathHelper from "../../../helper/MathHelper";
import UtilsService from "../../../services/UtilsService";
import * as _ from "lodash";
import * as Icons from "react-bootstrap-icons";
import SynCommunityService from "../../../services/Synergetic/Community/SynCommunityService";
import iSynCommunity from "../../../types/Synergetic/iSynCommunity";
import BTItemExportBtn from "./BTItemExportBtn";
import { FlexContainer } from "../../../styles";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/makeReduxStore";
import iBTLockDown from "../../../types/BudgetTacker/iBTLockDown";
import BTLockdownPanel from "./BTLockdownPanel";
import BTItemsTable from "./BTItemsTable";
import iBTItemCategory from "../../../types/BudgetTacker/iBTItemCategory";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import PopupModal from "../../../components/common/PopupModal";
import FormLabel from "../../../components/form/FormLabel";
import LoadingBtn from "../../../components/common/LoadingBtn";
import AuthService from '../../../services/AuthService';
import {MGGS_MODULE_ID_BUDGET_TRACKER} from '../../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN} from '../../../types/modules/iRole';

type iBTGLDetailsPanel = {
  gl: iSynGeneralLedger;
  showingYear: number;
  forceReloadCount?: number;
  onChangeYear: (year: number) => void;
  isReadOnly?: boolean;
  lockDown?: iBTLockDown;
};

type iBTItemMap = {
  requested: iBTItem[];
  approved: iBTItem[];
  pending: iBTItem[];
  declined: iBTItem[];
  requestedByMe: iBTItem[];
  requestedNotByMe: iBTItem[];
};

const initialBTItemMap: iBTItemMap = {
  requested: [],
  approved: [],
  pending: [],
  declined: [],
  requestedByMe: [],
  requestedNotByMe: []
};
const Wrapper = styled.div`
  .year-selector-wrapper {
    display: inline-block;
    margin-left: 10px;
    [class$="-control"] {
      min-height: 30px;
      [class$="-indicatorContainer"] {
        padding-top: 0px;
        padding-bottom: 0px;
      }
    }
  }

  .summary-table-wrapper {
    border: 1px #ccc solid;
    padding: 1rem 1rem 0 1rem;
    border-radius: 0.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    font-size: 12px;
    position: relative;

    .summary-table-title {
      position: absolute;
      font-weight: bold;
      top: -10px;
      background-color: white;
      padding: 1px 3px;
    }

    .summary-table {
      th,
      td {
        text-align: right;
        border-left: 1px #bbb solid;
        padding: 4px 8px;
        &:first-child {
          border-left: none;
        }
        .btn {
          padding: 0px;
        }
      }
      thead {
        th {
          background-color: #cccc;
        }
      }
      tfoot {
        font-weight: bold;
        tr {
          background-color: #cccc;
        }
      }
    }
  }
`;

type iBTCategoryMap = { [key: string]: iBTItemCategory };
const BTGLDetailsPanel = ({
  gl,
  showingYear,
  onChangeYear,
  forceReloadCount = 0,
  isReadOnly = false,
  lockDown
}: iBTGLDetailsPanel) => {
  const [isLoading, setIsLoading] = useState(false);
  const [btItemMap, setBtItemMap] = useState<iBTItemMap>(initialBTItemMap);
  const [btItems, setBtItems] = useState<iBTItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<iBTItem[]>([]);
  const [btCategoryMap, setBtCategoryMap] = useState<iBTCategoryMap>({});
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);
  const [isModuleAdmin, setIsModuleAdmin] = useState(false);
  const [showingBulkPopupType, setShowingBulkPopupType] = useState<
    string | null
  >(null);
  const [bulkDeclineReason, setBulkDeclineReason] = useState<string | null>(
    null
  );
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  const [showingFilter, setShowingFilter] = useState({
    categoryGuid: "",
    status: ""
  });

  const [count, setCount] = useState(0);
  const [isLoadingCommunityInfo, setIsLoadingCommunityInfo] = useState(false);
  const [communityMap, setCommunityMap] = useState<{
    [key: number]: iSynCommunity;
  }>({});

  useEffect(() => {
    let isCanceled = false;
    setIsLoading(true);
    setSelectedItems([]);
    setBulkDeclineReason(null);
    setIsBulkSubmitting(false);
    Promise.all([
      BTItemService.getAll({
        where: JSON.stringify({
          year: showingYear,
          gl_code: gl.GLCode
        }),
        include: "BTItemCategory",
        perPage: 999999
      }),
      AuthService.isModuleRole(MGGS_MODULE_ID_BUDGET_TRACKER, ROLE_ID_ADMIN),
    ])
      .then(resp => {
        if (isCanceled) return;
        const btItems = resp[0].data || [];
        setIsModuleAdmin(resp[1] === true)
        setBtItems(btItems);
        setBtCategoryMap(
          btItems.reduce((map: iBTCategoryMap, btItem: iBTItem) => {
            if (`${btItem.budget_item_category_guid || ""}`.trim() === "") {
              return map;
            }
            return {
              ...map,
              // @ts-ignore
              [btItem.budget_item_category_guid]: btItem.BTItemCategory
            };
          }, {})
        );
        setBtItemMap(
          btItems.reduce((map, item) => {
            const {
              requested,
              pending,
              approved,
              declined
            } = BTItemService.getAmountByType(item);
            return {
              ...map,
              requested: UtilsService.uniqByObjectKey(
                [...(map.requested || []), ...(requested > 0 ? [item] : [])],
                "id"
              ),
              approved: UtilsService.uniqByObjectKey(
                [...(map.approved || []), ...(approved > 0 ? [item] : [])],
                "id"
              ),
              pending: UtilsService.uniqByObjectKey(
                [...(map.pending || []), ...(pending > 0 ? [item] : [])],
                "id"
              ),
              declined: UtilsService.uniqByObjectKey(
                [...(map.declined || []), ...(declined > 0 ? [item] : [])],
                "id"
              ),
              requestedByMe: UtilsService.uniqByObjectKey(
                [
                  ...(map.requestedByMe || []),
                  ...(item.creator_id === currentUser?.synergyId ? [item] : [])
                ],
                "id"
              ),
              requestedNotByMe: UtilsService.uniqByObjectKey(
                [
                  ...(map.requestedNotByMe || []),
                  ...(item.creator_id !== currentUser?.synergyId ? [item] : [])
                ],
                "id"
              )
            };
          }, initialBTItemMap)
        );
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
  }, [gl.GLCode, showingYear, count, forceReloadCount, currentUser?.synergyId]);

  useEffect(() => {
    if (btItems.length <= 0) {
      return;
    }
    let ids: number[] = [];
    btItems.forEach(item => {
      if (`${item.creator_id || ""}` !== "") {
        ids.push(item.creator_id || 0);
      }
      if (`${item.author_id || ""}` !== "") {
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
        ID: ids
      }),
      perPage: 9999
    })
      .then(resp => {
        if (isCanceled) return;
        setCommunityMap(
          resp.data.reduce((map, com) => {
            return {
              ...map,
              [com.ID]: com
            };
          }, {})
        );
      })
      .catch(err => {
        Toaster.showApiError(err);
      })
      .finally(() => {
        setIsLoadingCommunityInfo(false);
      });
    //eslint-disable-next-line
  }, [JSON.stringify(btItems)]);

  const getLockDownPanel = () => {
    if (!lockDown) {
      return null;
    }
    return <BTLockdownPanel btLockDown={lockDown} />;
  };

  const getCategoryItems = (
    items: iBTItem[],
    category?: iBTItemCategory,
    status?: string
  ) => {
    const number = items
      .filter(btItem => {
        if (!category) {
          return true;
        }
        return btItem.budget_item_category_guid === category.guid;
      })
      .reduce(
        (sumNum, item) =>
          MathHelper.add(
            sumNum,
            MathHelper.mul(item.item_cost || 0, item.item_quantity || 0)
          ),
        0
      );

    if (number > 0) {
      return (
        <Button
          variant={"link"}
          size={"sm"}
          onClick={() => {
            setSelectedItems([]);
            setShowingFilter({
              categoryGuid: `${category?.guid || ""}`,
              status: `${status || ""}`
            });
          }}
        >
          {UtilsService.formatIntoCurrency(number)}
        </Button>
      );
    }
    return "";
  };

  const getSummaryPanel = () => {
    return (
      <div className={"summary-table-wrapper"}>
        <span className={"summary-table-title"}>
          Summary -{" "}
          <small className={"text-muted"}>
            <i>click the number to view details</i>
          </small>
        </span>
        <Table className={"summary-table"}>
          <thead>
            <tr>
              <th></th>
              <th>Approved</th>
              <th>Declined</th>
              <th>Requested</th>
              <th>Pending</th>
              <th>Request by me</th>
              <th>Request by Others</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(btCategoryMap).map(btCategory => {
              return (
                <tr key={btCategory.id}>
                  <td>{btCategory.name}</td>
                  <td>
                    {getCategoryItems(
                      btItemMap.approved,
                      btCategory,
                      "approved"
                    )}
                  </td>
                  <td>
                    {getCategoryItems(
                      btItemMap.declined,
                      btCategory,
                      "declined"
                    )}
                  </td>
                  <td>
                    {getCategoryItems(
                      btItemMap.requested,
                      btCategory,
                      "requested"
                    )}
                  </td>
                  <td>
                    {getCategoryItems(btItemMap.pending, btCategory, "pending")}
                  </td>
                  <td>
                    {getCategoryItems(
                      btItemMap.requestedByMe,
                      btCategory,
                      "requestedByMe"
                    )}
                  </td>
                  <td>
                    {getCategoryItems(
                      btItemMap.requestedNotByMe,
                      btCategory,
                      "requestedNotByMe"
                    )}
                  </td>
                  <td>{getCategoryItems(btItems, btCategory)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td>
                {getCategoryItems(btItemMap.approved, undefined, "approved")}
              </td>
              <td>
                {getCategoryItems(btItemMap.declined, undefined, "declined")}
              </td>
              <td>
                {getCategoryItems(btItemMap.requested, undefined, "requested")}
              </td>
              <td>
                {getCategoryItems(btItemMap.pending, undefined, "pending")}
              </td>
              <td>
                {getCategoryItems(
                  btItemMap.requestedByMe,
                  undefined,
                  "requestedByMe"
                )}
              </td>
              <td>
                {getCategoryItems(
                  btItemMap.requestedNotByMe,
                  undefined,
                  "requestedNotByMe"
                )}
              </td>
              <td>{getCategoryItems(btItems)}</td>
            </tr>
          </tfoot>
        </Table>
      </div>
    );
  };

  const getOperationBtns = () => {
    const hasFilter =
      `${showingFilter.categoryGuid || ""}`.trim() !== "" ||
      `${showingFilter.status || ""}`.trim() !== "";
    if (isModuleAdmin !== true || (!hasFilter && selectedItems.length <= 0)) {
      return null;
    }
    return (
      <ButtonGroup className={"op-btns"} size={"sm"}>
        {hasFilter === true ? (
          <Button
            variant={"outline-secondary"}
            onClick={() => {
              setSelectedItems([]);
              setShowingFilter({ categoryGuid: "", status: "" });
            }}
          >
            <Icons.X /> Reset Filter
          </Button>
        ) : null}
        {isReadOnly === true || selectedItems.length <= 0 ? null : (
          <ButtonGroup size={"sm"}>
            <Button
              variant={"secondary"}
              onClick={() =>
                setShowingBulkPopupType(BT_ITEM_STATUS_NEW.toUpperCase())
              }
            >
              Set {selectedItems.length} Item(s) to{" "}
              {BT_ITEM_STATUS_NEW.toUpperCase()}
            </Button>
            <Button
              variant={"success"}
              onClick={() =>
                setShowingBulkPopupType(BT_ITEM_STATUS_APPROVED.toUpperCase())
              }
            >
              {BT_ITEM_STATUS_APPROVED.toUpperCase()} {selectedItems.length}{" "}
              Item(s)
            </Button>
            <Button
              variant={"danger"}
              onClick={() =>
                setShowingBulkPopupType(BT_ITEM_STATUS_DECLINED.toUpperCase())
              }
            >
              {BT_ITEM_STATUS_DECLINED.toUpperCase()} {selectedItems.length}{" "}
              Item(s)
            </Button>
          </ButtonGroup>
        )}
      </ButtonGroup>
    );
  };

  const bulkSubmit = () => {
    if (selectedItems.length <= 0) {
      Toaster.showToast(
        `Please select at least one item to proceed further.`,
        TOAST_TYPE_ERROR
      );
      return;
    }

    if (
      `${bulkDeclineReason || ""}`.trim() === "" &&
      showingBulkPopupType === BT_ITEM_STATUS_DECLINED.toUpperCase()
    ) {
      Toaster.showToast(
        `Please provide a reason for decline selected request(s)`,
        TOAST_TYPE_ERROR
      );
      return;
    }

    setIsBulkSubmitting(true);
    Promise.all(
      selectedItems
        .filter(selectedItem => `${selectedItem.id || ""}`.trim() !== "")
        .map(selectedItem => {
          let data: any = {
            approved: null,
            declined: null,
            approved_amount: null,
            approver_comments: null,
            author_id: null
          };

          if (showingBulkPopupType === BT_ITEM_STATUS_DECLINED.toUpperCase()) {
            data = {
              approved: null,
              declined: true,
              author_id: currentUser?.synergyId || null,
              approved_amount: null,
              approver_comments: `${bulkDeclineReason || ""}`.trim()
            };
          } else if (
            showingBulkPopupType === BT_ITEM_STATUS_APPROVED.toUpperCase()
          ) {
            data = {
              approved: true,
              declined: null,
              author_id: currentUser?.synergyId || null,
              approved_amount: MathHelper.mul(
                selectedItem.item_quantity || 0,
                selectedItem.item_cost || 0
              ),
              approver_comments: null
            };
          }
          // @ts-ignore
          return BTItemService.update(selectedItem.id, data);
        })
    )
      .then(resp => {
        setBulkDeclineReason(null);
        setShowingBulkPopupType(null);
        setCount(MathHelper.add(count, 1));
      })
      .catch(err => {
        Toaster.showApiError(err);
      })
      .finally(() => {
        setIsBulkSubmitting(false);
      });
    return;
  };

  const getBulkPopupPanel = () => {
    if (showingBulkPopupType === null) {
      return null;
    }
    const type =
      showingBulkPopupType === BT_ITEM_STATUS_DECLINED.toUpperCase()
        ? "danger"
        : showingBulkPopupType === BT_ITEM_STATUS_APPROVED.toUpperCase()
        ? "success"
        : "secondary";
    return (
      <PopupModal
        show={true}
        size={"lg"}
        dialogClassName={"modal-80w"}
        handleClose={() => {
          if (!isBulkSubmitting) {
            setShowingBulkPopupType(null)
          }
        }}
        title={
          <FlexContainer className={"with-gap lg-gap align-content-end"}>
            <div>Set selected {selectedItems.length} item(s) to </div>
            <small className={`text-${type}`}>{showingBulkPopupType}</small>
            <small>
              (Total:{" "}
              <i>
                {UtilsService.formatIntoCurrency(
                  selectedItems.reduce(
                    (sum, item) =>
                      MathHelper.add(
                        sum,
                        MathHelper.mul(
                          item.item_quantity || 0,
                          item.item_cost || 0
                        )
                      ),
                    0
                  )
                )}
              </i>
              )
            </small>
          </FlexContainer>
        }
        footer={
          <FlexContainer className={"justify-content-between"}>
            <div>
              {showingBulkPopupType ===
              BT_ITEM_STATUS_DECLINED.toUpperCase() ? (
                <FlexContainer className={"with-gap"}>
                  <FormLabel label={"Decline Reason"} isRequired />
                  <FormControl
                    value={bulkDeclineReason || ""}
                    onChange={event =>
                      setBulkDeclineReason(event.target.value || "")
                    }
                  />
                </FlexContainer>
              ) : null}
            </div>
            <div>
              <LoadingBtn
                variant={"link"}
                isLoading={isBulkSubmitting}
                onClick={() => {
                  if (!isBulkSubmitting) {
                    setShowingBulkPopupType(null)
                  }
                }}
              >
                <Icons.X /> Cancel
              </LoadingBtn>
              <LoadingBtn
                isLoading={isBulkSubmitting}
                variant={type}
                onClick={() => bulkSubmit()}
              >
                <Icons.Send /> Mark them as {showingBulkPopupType}
              </LoadingBtn>
            </div>
          </FlexContainer>
        }
      >
        <BTItemsTable
          items={selectedItems}
          forYear={showingYear}
          gl={gl}
          communityMap={communityMap}
          readyOnly={true}
        />
      </PopupModal>
    );
  };

  const getBTItemsTable = () => {
    if (isLoadingCommunityInfo) {
      return <Spinner animation={"border"} />;
    }

    const items = (`${showingFilter.status || ""}`.trim() !== "" &&
    `${showingFilter.status || ""}`.trim() in btItemMap
      ? // @ts-ignore
        btItemMap[`${showingFilter.status || ""}`.trim()]
      : btItems
    ).filter((btItem: iBTItem) => {
      if (`${showingFilter.categoryGuid || ""}`.trim() === "") {
        return true;
      }
      return (
        btItem.budget_item_category_guid ===
        `${showingFilter.categoryGuid || ""}`.trim()
      );
    });
    return (
      <>
        {getSummaryPanel()}
        <div className={"details-table"}>
          <h5>
            {items.length} Item(s):{" "}
            {`${showingFilter.status || ""}`.trim().toUpperCase()}
            {`${showingFilter.categoryGuid || ""}`.trim() !== "" &&
            `${showingFilter.categoryGuid || ""}`.trim() in btCategoryMap ? (
              <>
                {" "}
                in{" "}
                <u>
                  {
                    btCategoryMap[`${showingFilter.categoryGuid || ""}`.trim()]
                      .name
                  }
                </u>
              </>
            ) : (
              ""
            )}
          </h5>
          {getOperationBtns()}
          <BTItemsTable
            items={items}
            selectedItems={selectedItems}
            onItemSelected={isModuleAdmin !== true ? undefined : (items: iBTItem[], selected: boolean) => {
              const newItems =
                selected === true
                  ? [...selectedItems, ...items]
                  : selectedItems.filter(
                    ite =>
                      items.map(item => item.id).indexOf(Number(ite.id)) < 0
                  );

              setSelectedItems(UtilsService.uniqByObjectKey(newItems, "id"));
            }}
            forYear={showingYear}
            gl={gl}
            onItemSaved={() => setCount(MathHelper.add(count, 1))}
            communityMap={communityMap}
          />
        </div>
      </>
    );
  };

  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  return (
    <Wrapper>
      <FlexContainer className={"justify-content-between align-content-center"}>
        <FlexContainer className={"with-gap"}>
          <h3>
            {gl.GLCode} - {gl.GLDescription} for
          </h3>

          <span className={"year-selector-wrapper"}>
            <FileYearSelector
              value={showingYear}
              className={"year-selector"}
              showIndicatorSeparator={false}
              min={moment()
                .subtract("5", "year")
                .year()}
              max={moment()
                .add("1", "year")
                .year()}
              onSelect={newYear => onChangeYear(newYear || showingYear)}
            />
          </span>
        </FlexContainer>
        <div>
          <BTItemExportBtn
            items={btItems}
            size={"sm"}
            isLoading={isLoading || isLoadingCommunityInfo}
            year={showingYear}
            gl={gl}
            communityMap={communityMap}
          />
        </div>
      </FlexContainer>
      {getLockDownPanel()}
      {getBTItemsTable()}
      {getBulkPopupPanel()}
    </Wrapper>
  );
};

export default BTGLDetailsPanel;
