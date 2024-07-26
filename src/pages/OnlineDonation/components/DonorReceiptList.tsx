import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import SynVDonorReceiptService from "../../../services/Synergetic/Finance/SynVDonorReceiptService";
import iSynVDonorReceipt from "../../../types/Synergetic/Finance/iSynVDonorReceipt";
import { FlexContainer } from "../../../styles";
import FormLabel from "../../../components/form/FormLabel";
import DateRangeSelector from "../../../components/common/DateRangeSelector";
import moment from "moment-timezone";
import LoadingBtn from "../../../components/common/LoadingBtn";
import useListCrudHook from "../../../components/hooks/useListCrudHook/useListCrudHook";
import * as Icons from "react-bootstrap-icons";
import {
  OP_AND,
  OP_BETWEEN,
  OP_GTE,
  OP_LIKE,
  OP_LT,
  OP_OR
} from "../../../helper/ServiceHelper";
import Table, { iTableColumn } from "../../../components/common/Table";
import * as _ from "lodash";
import UtilsService from "../../../services/UtilsService";
import { FormControl } from "react-bootstrap";
import FlagSelector from "../../../components/form/FlagSelector";
import SynLuFundSelector from "../../../components/lookup/SynLuFundSelector";
import SynLuAppealSelector from "../../../components/lookup/SynLuAppealSelector";
import DonorReceiptsSendingPopup from "./DonorReceiptsSendingPopup";

const Wrapper = styled.div`
  .form-control {
    margin-bottom: 0px;
  }
  .donor {
    width: 230px;
  }
  .fund-name {
    width: 275px;
  }
  .select-box {
    width: 30px;
    .check-box {
      font-size: 17px;
    }
  }
  .receipt-number,
  .receipt-paymentMethod,
  .receipt-date {
    width: 110px;
  }
  .receipt-amt {
    width: 135px;
  }
  .receipt-appeal {
    width: 250px;
  }
  .fund-table {
    width: 100%;
    th.fund-name,
    td.fund-name {
      width: 250px;
    }
  }

  .receipts-table,
  .fund-table {
    th,
    td {
      text-align: left;
      padding: 0px;
    }
    tr:last-child td {
      border-bottom: 0px;
    }
    tbody {
      > tr td {
        padding-bottom: 0.5rem;
      }

      > tr:last-child > td {
        padding-bottom: 0px;
      }
    }
  }
`;
type iSearchCriteria = {
  dates: {
    startDate: string;
    endDate: string;
  };
  showAmtFlag: boolean | null;
  fundCodes: string[];
  appealCodes: string[];
  searchNameOrEmail: string;
};
type iMap = { [key: number]: { [key: string]: iSynVDonorReceipt[] } };

const DonorReceiptList = () => {
  const [searchCriteria, setSearchCriteria] = useState<iSearchCriteria | null>(
    null
  );
  const [showingConfirmModal, setShowingConfirmModal] = useState(false);
  const [selectedDonorIds, setSelectedDonorIds] = useState<number[]>([]);
  const [resultMap, setResultMap] = useState<iMap>({});
  const { onSearch, state, renderDataTable } = useListCrudHook<
    iSynVDonorReceipt
  >({
    loadOnInit: false,
    perPage: 99999999,
    getFn: useCallback(config => {
      const { filter, ...props } = config || {};
      return SynVDonorReceiptService.getAll({
        where: JSON.stringify({
          ...filter,
          [OP_AND]: [
            {
              ReceiptFundTaxDeductableFlag: true
            },
            {
              [OP_OR]: [
                { ReceiptAnonymousFlag: null },
                { ReceiptAnonymousFlag: false }
              ]
            }
          ]
        }),
        sort: "DonorMailName:ASC",
        ...props
      });
    }, [])
  });

  useEffect(() => {
    if (searchCriteria !== null) {
      return;
    }

    const currentMonth = moment().month();
    setSearchCriteria({
      ...(searchCriteria || {}),
      searchNameOrEmail: "",
      appealCodes: [],
      fundCodes: [],
      showAmtFlag: null,
      dates: {
        startDate:
          currentMonth > 6
            ? moment(
                moment()
                  .quarter(3)
                  .startOf("quarter")
              ).toISOString()
            : moment(
                moment()
                  .quarter(3)
                  .startOf("quarter")
              )
                .subtract(1, "year")
                .toISOString(),
        endDate:
          currentMonth > 6
            ? moment(
                moment()
                  .quarter(2)
                  .endOf("quarter")
              )
                .add(1, "year")
                .toISOString()
            : moment(
                moment()
                  .quarter(2)
                  .endOf("quarter")
              ).toISOString()
      }
    });
  }, [searchCriteria]);

  useEffect(() => {
    const data = state.data?.data || [];

    setResultMap(
      data.reduce((map, item) => {
        const donorId = item.DonorID;
        const fund = item.ReceiptFund || "";

        // @ts-ignore
        const donorMap = donorId in map ? map[donorId] : {};
        const fundArr = fund in donorMap ? donorMap[fund] : [];
        return {
          ...map,
          [donorId]: {
            ...donorMap,
            [fund]: _.uniqBy([...fundArr, item], receipt => receipt.ReceiptSeq)
          }
        };
      }, {})
    );
  }, [state.data]);

  const getColumns = <T extends number>() => {
    return [
      {
        key: "selectbox",
        header: (col: iTableColumn<T>) => {
          const allDonorIds = Object.keys(resultMap).map(id => Number(id));
          const leftIds = allDonorIds.filter(
            id => selectedDonorIds.indexOf(id) < 0
          );
          const allSelected = leftIds.length <= 0;
          return (
            <th key={col.key} className={"select-box"}>
              <span
                className={"cursor-pointer check-box"}
                onClick={() => {
                  setSelectedDonorIds(allSelected === true ? [] : allDonorIds);
                }}
              >
                {allSelected === true ? (
                  <Icons.CheckSquareFill />
                ) : selectedDonorIds.length <= 0 ? (
                  <Icons.Square />
                ) : (
                  <Icons.CheckSquare />
                )}
              </span>
            </th>
          );
        },
        cell: (col: iTableColumn<T>, dId: T) => {
          const donorId = Number(dId);
          return (
            <td key={col.key} className={"select-box"}>
              <span
                className={"cursor-pointer check-box"}
                onClick={() => {
                  if (selectedDonorIds.indexOf(donorId) >= 0) {
                    setSelectedDonorIds(
                      selectedDonorIds.filter(id => id !== donorId)
                    );
                    return;
                  }

                  setSelectedDonorIds(_.uniq([...selectedDonorIds, donorId]));
                }}
              >
                {selectedDonorIds.indexOf(donorId) >= 0 ? (
                  <Icons.CheckSquareFill />
                ) : (
                  <Icons.Square />
                )}
              </span>
            </td>
          );
        }
      },
      {
        key: "donor",
        header: "Donor",
        cell: (col: iTableColumn<T>, donorId: T) => {
          const fundMap = donorId in resultMap ? resultMap[donorId] : {};
          const keys = Object.keys(fundMap);
          const record =
            keys.length <= 0
              ? null
              : keys[0] in fundMap
              ? // @ts-ignore
                fundMap[keys[0]].length <= 0
                ? null
                : // @ts-ignore
                  fundMap[keys[0]][0]
              : null;
          return (
            <td key={col.key} className={"donor"}>
              <div>
                <b>{record?.DonorMailName}</b>
              </div>
              <div>
                <small className={"text-muted"}>
                  <i>{record?.DonorDefaultEmail}</i>
                </small>
              </div>
            </td>
          );
        }
      },
      {
        key: "fund",
        header: (col: iTableColumn<T>) => {
          return (
            <th key={col.key}>
              <table className={"fund-table"}>
                <thead>
                  <tr>
                    <th className={"fund-name"}>Fund</th>
                    <th className={"receipts"}>
                      <table className={"receipts-table"}>
                        <thead>
                          <tr>
                            <th className={"receipt-number"}>Receipt No.</th>
                            <th className={"receipt-date"}>Date</th>
                            <th className={"receipt-amt"}>Amt</th>
                            <th className={"receipt-paymentMethod"}>Method</th>
                            <th className={"receipt-appeal"}>Appeal</th>
                            <th className={"receipt-comments"}>Comments</th>
                          </tr>
                        </thead>
                      </table>
                    </th>
                  </tr>
                </thead>
              </table>
            </th>
          );
        },
        cell: (col: iTableColumn<T>, donorId: T) => {
          const fundMap = donorId in resultMap ? resultMap[donorId] : {};
          return (
            <td key={col.key}>
              <Table
                className={"no-margin no-padding fund-table"}
                showHeader={false}
                columns={[
                  {
                    key: "fund",
                    header: "Fund",
                    cell: (col: iTableColumn<string>, fund: string) => {
                      return (
                        <td key={col.key} className={"fund-name"}>
                          <div>
                            {fund in fundMap
                              ? // @ts-ignore
                                fundMap[fund][0].ReceiptFundDescription
                              : ""}
                          </div>
                          <small className={"text-muted"}>{fund}</small>
                        </td>
                      );
                    }
                  },
                  {
                    key: "receipts",
                    header: "Fund",
                    cell: (col: iTableColumn<string>, fund: string) => {
                      const receipts =
                        fund in fundMap
                          ? // @ts-ignore
                            fundMap[fund]
                          : [];
                      return (
                        <td key={col.key} className={"receipts"}>
                          <Table
                            showHeader={false}
                            rows={receipts}
                            className={"receipts-table no-margin no-padding "}
                            columns={[
                              {
                                key: "receiptNumber",
                                header: "Receipt No.",
                                cell: (
                                  col: iTableColumn<iSynVDonorReceipt>,
                                  data: iSynVDonorReceipt
                                ) => {
                                  return (
                                    <td
                                      key={col.key}
                                      className={"receipt-number"}
                                    >
                                      {data.ReceiptNo || ""}
                                    </td>
                                  );
                                }
                              },
                              {
                                key: "date",
                                header: "Date",
                                cell: (
                                  col: iTableColumn<iSynVDonorReceipt>,
                                  data: iSynVDonorReceipt
                                ) => {
                                  return (
                                    <td
                                      key={col.key}
                                      className={"receipt-date"}
                                    >
                                      {`${data.ReceiptDate || ""}`.replace(
                                        "T00:00:00.000Z",
                                        ""
                                      )}
                                    </td>
                                  );
                                }
                              },
                              {
                                key: "amount",
                                header: "Amt",
                                cell: (
                                  col: iTableColumn<iSynVDonorReceipt>,
                                  data: iSynVDonorReceipt
                                ) => {
                                  return (
                                    <td
                                      key={col.key}
                                      className={`receipt-amt ${
                                        data.ReceiptAmount <= 0
                                          ? "text-white bg-danger"
                                          : ""
                                      }`}
                                    >
                                      {UtilsService.formatIntoCurrency(
                                        data.ReceiptAmount
                                      )}
                                    </td>
                                  );
                                }
                              },
                              {
                                key: "paymentMethod",
                                header: "Method",
                                cell: (
                                  col: iTableColumn<iSynVDonorReceipt>,
                                  data: iSynVDonorReceipt
                                ) => {
                                  return (
                                    <td
                                      key={col.key}
                                      className={"receipt-paymentMethod"}
                                    >
                                      {data.ReceiptPaymentMethodCode || ""}
                                    </td>
                                  );
                                }
                              },
                              {
                                key: "appeal",
                                header: "appeal",
                                cell: (
                                  col: iTableColumn<iSynVDonorReceipt>,
                                  data: iSynVDonorReceipt
                                ) => {
                                  return (
                                    <td
                                      key={col.key}
                                      className={"receipt-appeal"}
                                    >
                                      {data.ReceiptAppealDescription || ""}
                                    </td>
                                  );
                                }
                              },
                              {
                                key: "comments",
                                header: "Comments",
                                cell: (
                                  col: iTableColumn<iSynVDonorReceipt>,
                                  data: iSynVDonorReceipt
                                ) => {
                                  return (
                                    <td
                                      key={col.key}
                                      className={"receipt-comments"}
                                    >
                                      {data.ReceiptComments || ""}
                                    </td>
                                  );
                                }
                              }
                            ]}
                          />
                        </td>
                      );
                    }
                  }
                ]}
                rows={Object.keys(fundMap)}
              />
            </td>
          );
        }
      }
    ];
  };

  const handleClose = () => {
    setShowingConfirmModal(false);
  };

  const doSearch = () => {
    const searchNameStr = `${searchCriteria?.searchNameOrEmail || ""}`.trim();
    const newFilter = {
      ReceiptDate: {
        [OP_BETWEEN]: [
          moment(searchCriteria?.dates.startDate).format("YYYY-MM-DD"),
          moment(searchCriteria?.dates.endDate).format("YYYY-MM-DD")
        ]
      },
      ...(searchCriteria?.showAmtFlag === null
        ? {}
        : {
            ReceiptAmount: {
              [searchCriteria?.showAmtFlag ? OP_GTE : OP_LT]: 0
            }
          }),
      ...((searchCriteria?.fundCodes || []).length <= 0
        ? {}
        : {
            ReceiptFund: searchCriteria?.fundCodes || []
          }),
      ...((searchCriteria?.appealCodes || []).length <= 0
        ? {}
        : {
            ReceiptAppeal: searchCriteria?.appealCodes || []
          }),
      ...(searchNameStr === ""
        ? {}
        : {
            [OP_OR]: [
              { DonorName: { [OP_LIKE]: `%${searchNameStr}%` } },
              { DonorNameRaw: { [OP_LIKE]: `%${searchNameStr}%` } },
              { DonorMailName: { [OP_LIKE]: `%${searchNameStr}%` } },
              {
                DonorMailSalutation: {
                  [OP_LIKE]: `%${searchNameStr}%`
                }
              },
              {
                DonorNameInternal: { [OP_LIKE]: `%${searchNameStr}%` }
              },
              {
                DonorNameExternal: { [OP_LIKE]: `%${searchNameStr}%` }
              },
              {
                DonorLegalFullName: {
                  [OP_LIKE]: `%${searchNameStr}%`
                }
              },
              { DonorSurname: { [OP_LIKE]: `%${searchNameStr}%` } },
              { DonorPreferred: { [OP_LIKE]: `%${searchNameStr}%` } },
              {
                DonorPreferredFormal: {
                  [OP_LIKE]: `%${searchNameStr}%`
                }
              },
              { DonorGiven1: { [OP_LIKE]: `%${searchNameStr}%` } },
              { DonorGiven2: { [OP_LIKE]: `%${searchNameStr}%` } },
              { DonorHomeEmail: { [OP_LIKE]: `%${searchNameStr}%` } },
              {
                DonorOccupEmail: { [OP_LIKE]: `%${searchNameStr}%` }
              },
              {
                DonorSpouseSurname: {
                  [OP_LIKE]: `%${searchNameStr}%`
                }
              },
              {
                DonorSpousePreferred: {
                  [OP_LIKE]: `%${searchNameStr}%`
                }
              },
              {
                DonorSpouseGiven1: { [OP_LIKE]: `%${searchNameStr}%` }
              },
              {
                DonorSpouseGiven2: { [OP_LIKE]: `%${searchNameStr}%` }
              },
              {
                DonorDefaultEmail: { [OP_LIKE]: `%${searchNameStr}%` }
              }
            ]
          })
    };
    onSearch(newFilter);
  };

  return (
    <Wrapper>
      <FlexContainer
        className={"search-wrapper gap-3 align-items-end flex-wrap"}
      >
        <div>
          <FormLabel label={"Receipt dates"} />
          <DateRangeSelector
            dateFormat={"DD MMM YYYY"}
            timeFormat={false}
            onStartDateSelected={date =>
              setSearchCriteria({
                ...(searchCriteria || {}),
                // @ts-ignore
                dates: {
                  ...(searchCriteria?.dates || {}),
                  startDate: date.toISOString()
                }
              })
            }
            onEndDateSelected={date =>
              setSearchCriteria({
                ...(searchCriteria || {}),
                // @ts-ignore
                dates: {
                  ...(searchCriteria?.dates || {}),
                  endDate: date.toISOString()
                }
              })
            }
            startDate={searchCriteria?.dates.startDate}
            endDate={searchCriteria?.dates.endDate}
          />
        </div>
        <div>
          <FormLabel label={"Donor name"} />
          <FormControl
            placeholder={"donor name or email"}
            onKeyUp={event => {
              UtilsService.handleEnterKeyPressed(event, () => doSearch());
            }}
            onChange={event => {
              // @ts-ignore
              setSearchCriteria({
                ...(searchCriteria || {}),
                searchNameOrEmail: event.target.value || ""
              });
            }}
          />
        </div>
        <div>
          <FormLabel label={"Amt"} />
          <FlagSelector
            AllLabel={"Ignore"}
            YesLabel={"Positive Only"}
            NoLabel={"Negative Only"}
            value={
              searchCriteria?.showAmtFlag === null ||
              searchCriteria?.showAmtFlag === undefined
                ? null
                : searchCriteria?.showAmtFlag
            }
            onSelect={value => {
              // @ts-ignore
              setSearchCriteria({
                ...(searchCriteria || {}),
                showAmtFlag:
                  value === null || value.value === ""
                    ? null
                    : Boolean(value.value)
              });
            }}
          />
        </div>
        <div style={{ minWidth: "300px" }}>
          <FormLabel label={"Fund"} />
          <SynLuFundSelector
            values={searchCriteria?.fundCodes || []}
            allowClear
            isMulti
            onSelect={values => {
              // @ts-ignore
              setSearchCriteria({
                ...(searchCriteria || {}),
                fundCodes:
                  values === null
                    ? []
                    : (Array.isArray(values) ? values : [values]).map(v =>
                        `${v.value || ""}`.trim()
                      )
              });
            }}
          />
        </div>
        <div style={{ minWidth: "300px" }}>
          <FormLabel label={"Appeal"} />
          <SynLuAppealSelector
            values={searchCriteria?.appealCodes || []}
            allowClear
            isMulti
            onSelect={values => {
              // @ts-ignore
              setSearchCriteria({
                ...(searchCriteria || {}),
                appealCodes:
                  values === null
                    ? []
                    : (Array.isArray(values) ? values : [values]).map(v =>
                        `${v.value || ""}`.trim()
                      )
              });
            }}
          />
        </div>
        <div>
          <LoadingBtn
            isLoading={state.isLoading}
            size={"sm"}
            onClick={() => doSearch()}
          >
            <Icons.Search /> Search
          </LoadingBtn>
        </div>
        <div>
          <LoadingBtn
            isLoading={state.isLoading}
            disabled={selectedDonorIds.length <= 0}
            size={"sm"}
            variant={
              selectedDonorIds.length > 0
                ? "outline-success"
                : "outline-secondary"
            }
            onClick={() => setShowingConfirmModal(true)}
          >
            <Icons.Send /> Send Receipts to {selectedDonorIds.length} of{" "}
            {Object.keys(resultMap).length}
          </LoadingBtn>
        </div>
      </FlexContainer>
      <div className={"result-wrapper"}>
        {Object.keys(resultMap).length > 0
          ? renderDataTable({
              responsive: true,
              hover: true,
              columns: getColumns<number>(),
              // @ts-ignore
              rows: Object.keys(resultMap)
            })
          : null}
      </div>
      <DonorReceiptsSendingPopup
        handleClose={handleClose}
        show={showingConfirmModal}
        receiptMap={_.pickBy(
          resultMap,
          (value, key) => selectedDonorIds.indexOf(Number(key)) >= 0
        )}
      />
    </Wrapper>
  );
};

export default DonorReceiptList;
