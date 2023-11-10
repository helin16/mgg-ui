import styled from "styled-components";
import { useEffect, useState } from "react";
import PageLoadingSpinner from "../../common/PageLoadingSpinner";
import ConfirmationOfDetailsResponseService from "../../../services/ConfirmationOfDetails/ConfirmationOfDetailsResponseService";
import { OP_BETWEEN, OP_GTE, OP_LTE, OP_NOT } from "../../../helper/ServiceHelper";
import iPaginatedResult from "../../../types/iPaginatedResult";
import iConfirmationOfDetailsResponse from "../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse";
import Toaster from "../../../services/Toaster";
import Table, { iTableColumn } from "../../common/Table";
import moment from "moment-timezone";
import SynCommunityService from "../../../services/Synergetic/Community/SynCommunityService";
import * as _ from "lodash";
import iSynCommunity from "../../../types/Synergetic/iSynCommunity";
import iVStudent from "../../../types/Synergetic/iVStudent";
import SynVStudentService from "../../../services/Synergetic/Student/SynVStudentService";
import ConfirmationOfDetailsListSearchPanel, {
  iConfirmationOfDetailsListSearchCriteria
} from "./ConfirmationOfDetailsListSearchPanel";
import { FlexContainer } from "../../../styles";
import { Button } from "react-bootstrap";
import * as Icons from "react-bootstrap-icons";
import MathHelper from "../../../helper/MathHelper";
import DeleteConfirmPopupBtn from "../../common/DeleteConfirm/DeleteConfirmPopupBtn";
import CODAdminDetailsPopupBtn from "./CODAdminDetailsPopupBtn";

const Wrapper = styled.div`
  .result-title-row {
    margin-top: 2rem;
    .title-col,
    .refresh-btn {
      margin: 0px;
      padding: 0px;
    }
  }

  .edit-link {
    margin: 0px;
    padding: 0px;
    height: auto;
  }
`;
const ConfirmationOfDetailsListPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(1);
  const [searchCriteria, setSearchCriteria] = useState<
    iConfirmationOfDetailsListSearchCriteria
  >({
    isSubmitted: true,
    isSyncd: false
  });
  const [responseList, setResponseList] = useState<iPaginatedResult<
    iConfirmationOfDetailsResponse
  > | null>(null);

  useEffect(() => {
    const getSubmittedDateObj = () => {
      const start = `${searchCriteria.SubmittedDateRange?.start || ""}`.trim();
      const end = `${searchCriteria.SubmittedDateRange?.end || ""}`.trim();
      if (start === "" && end === "") {
        return {};
      }

      if (start !== "" && end !== "") {
        return { submittedAt: { [OP_BETWEEN]: [start, end] } };
      }

      if (start !== "") {
        return { submittedAt: { [OP_GTE]: start } };
      }

      return { submittedAt: { [OP_LTE]: end } };
    };
    const getData = async () => {
      const responseResults = await ConfirmationOfDetailsResponseService.getAll(
        {
          where: JSON.stringify({
            active: true,
            isCurrent: true,
            ...getSubmittedDateObj(),
            syncToSynById:
              searchCriteria.isSyncd === true ? { [OP_NOT]: null } : null,
            ...((searchCriteria.StudentIds || []).length > 0
              ? { StudentID: searchCriteria.StudentIds }
              : {}),
            ...(searchCriteria.isSubmitted === undefined
              ? {}
              : {
                  submittedById:
                    searchCriteria.isSubmitted === true
                      ? { [OP_NOT]: null }
                      : null
                })
          }),
          currentPage,
          sort: "id:DESC"
        }
      );
      const responses = responseResults.data || [];
      const communityIds = _.uniq(
        // @ts-ignore
        responses.reduce((ids: number[], response) => {
          return [
            ...ids,
            response.AuthorID,
            response.submittedById,
            response.canceledById,
            response.submittedById,
            response.syncToSynById
          ].filter(id => `${id || ""}`.trim() !== "");
        }, [])
      );
      const studentIds = _.uniq(responses.map(response => response.StudentID));
      const results = await Promise.all([
        SynCommunityService.getCommunityProfiles({
          where: JSON.stringify({ ID: communityIds }),
          perPage: 999999
        }),
        SynVStudentService.getVPastAndCurrentStudentAll({
          where: JSON.stringify({ StudentID: studentIds }),
          perPage: 99999999,
          sort: "StudentID:ASC,StudentYearLevel:ASC"
        })
      ]);

      const communityMap: { [key: number]: iSynCommunity } = (
        results[0].data || []
      ).reduce((map, community) => {
        return {
          ...map,
          [community.ID]: community
        };
      }, {});
      const studentMap: { [key: number]: iVStudent } = (
        results[1].data || []
      ).reduce((map, student) => {
        return {
          ...map,
          [student.StudentID]: student
        };
      }, {});

      return {
        ...responseResults,
        data: (responseResults.data || []).map(response => {
          return {
            ...response,
            Student:
              response.StudentID in studentMap
                ? studentMap[response.StudentID]
                : null,
            CreatedBy:
              response.createdById in communityMap
                ? communityMap[response.createdById]
                : null,
            UpdatedBy:
              response.updatedById in communityMap
                ? communityMap[response.updatedById]
                : null,
            SubmittedBy:
              response.submittedById in communityMap
                ? communityMap[response.submittedById]
                : null,
            CanceledBy:
              response.canceledById && response.canceledById in communityMap
                ? communityMap[response.canceledById]
                : null,
            SyncToSynBy:
              response.syncToSynById && response.syncToSynById in communityMap
                ? communityMap[response.syncToSynById]
                : null
          };
        })
      };
    };

    let isCanceled = false;
    setIsLoading(true);
    getData()
      .then(resp => {
        if (isCanceled) {
          return;
        }
        setResponseList(resp);
      })
      .catch(err => {
        if (isCanceled) {
          return;
        }
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) {
          return;
        }
        setIsLoading(false);
      });

    return () => {
      isCanceled = true;
    };
  }, [searchCriteria, currentPage, count]);

  const getColumns = () => {
    return [
      {
        key: "Student",
        header: "Student",
        cell: (col: iTableColumn, data: iConfirmationOfDetailsResponse) => {
          return (
            <td key={col.key}>
              <CODAdminDetailsPopupBtn
                response={data}
                variant="link"
                size="sm"
                className="edit-link"
                onRefreshList={() => setCount(MathHelper.add(count, 1))}
              >
                {data.Student?.StudentNameExternal}
                {`${data.Student?.StudentPreferred || ""}`.trim() !== ""
                  ? ` (${data.Student?.StudentPreferred})`
                  : ""}{" "}
                [{data.StudentID}]
              </CODAdminDetailsPopupBtn>
            </td>
          );
        }
      },
      {
        key: "StudentYearLevel",
        header: "Year Lvl.",
        cell: (col: iTableColumn, data: iConfirmationOfDetailsResponse) => {
          return (
            <td key={col.key}>
              {data.response?.student?.StudentEntryYearLevel}
            </td>
          );
        }
      },
      {
        key: "EntryDate",
        header: "Entry Date",
        cell: (col: iTableColumn, data: iConfirmationOfDetailsResponse) => {
          return (
            <td key={col.key}>
              {`${data.response?.student?.StudentEntryDate || ""}`.trim() === ""
                ? ""
                : moment(data.response?.student?.StudentEntryDate).format(
                    "D MMM YYYY"
                  )}
            </td>
          );
        }
      },
      {
        key: "HasCourtOrder",
        header: "Court Order?",
        cell: (col: iTableColumn, data: iConfirmationOfDetailsResponse) => {
          return (
            <td key={col.key}>
              {data.response?.courtOrder.hasCourtOrders === true ? <Icons.CheckSquareFill className={'text-danger'} style={{fontSize: '1.2rem'}} /> : null}
            </td>
          );
        }
      },
      {
        key: "Created",
        header: "Created",
        cell: (col: iTableColumn, data: iConfirmationOfDetailsResponse) => {
          return (
            <td key={col.key}>
              <div>
                <small>
                  By: {data.CreatedBy?.Title || ""}{" "}
                  {data.CreatedBy?.Given1 || ""} {data.CreatedBy?.Surname || ""}
                </small>
              </div>
              <div>
                <small>@: {moment(data.createdAt).format("lll")}</small>
              </div>
            </td>
          );
        }
      },
      {
        key: "Submitted",
        header: "Submitted",
        cell: (col: iTableColumn, data: iConfirmationOfDetailsResponse) => {
          if (
            `${data?.submittedById || ""}`.trim() === "" ||
            `${data?.submittedAt || ""}`.trim() === ""
          ) {
            return <td key={col.key}></td>;
          }

          return (
            <td key={col.key}>
              <div>
                <small>
                  By: {data.SubmittedBy?.Title || ""}{" "}
                  {data.SubmittedBy?.Given1 || ""}{" "}
                  {data.SubmittedBy?.Surname || ""}
                </small>
              </div>
              <div>
                <small>@: {moment(data.submittedAt).format("lll")}</small>
              </div>
            </td>
          );
        }
      },
      {
        key: "Syncd",
        header: "Sync'd",
        cell: (col: iTableColumn, data: iConfirmationOfDetailsResponse) => {
          if (
            `${data?.syncToSynById || ""}`.trim() === "" ||
            `${data?.syncToSynAt || ""}`.trim() === ""
          ) {
            return <td key={col.key}></td>;
          }

          return (
            <td key={col.key}>
              <div>
                <small>
                  By: {data.SyncToSynBy?.Title || ""}{" "}
                  {data.SyncToSynBy?.Given1 || ""}{" "}
                  {data.SyncToSynBy?.Surname || ""}
                </small>
              </div>
              <div>
                <small>@: {moment(data.syncToSynAt).format("lll")}</small>
              </div>
            </td>
          );
        }
      },
      {
        key: "Operations",
        header: "",
        cell: (col: iTableColumn, data: iConfirmationOfDetailsResponse) => {
          return (
            <td key={col.key} className={"text-right"}>
              <DeleteConfirmPopupBtn
                variant={"danger"}
                deletingFn={() =>
                  ConfirmationOfDetailsResponseService.deactivate(data.id)
                }
                deletedCallbackFn={() => setCount(MathHelper.add(count, 1))}
                size={"sm"}
                confirmString={`${data.id}`}
              >
                <Icons.Trash />
              </DeleteConfirmPopupBtn>
            </td>
          );
        }
      }
    ];
  };

  if (isLoading === true && currentPage <= 1) {
    return <PageLoadingSpinner />;
  }

  return (
    <Wrapper>
      <ConfirmationOfDetailsListSearchPanel
        isSearching={isLoading}
        defaultSearchCriteria={searchCriteria}
        onSearch={criteria => {
          setSearchCriteria(criteria);
          setCurrentPage(1);
          setCount(MathHelper.add(count, 1));
        }}
      />
      <FlexContainer
        className={
          "justify-content-start with-gap lg-gap space-above align-items-center result-title-row"
        }
      >
        <h6 className={"title-col"}>
          Found {(responseList?.data || []).length} response(s):
        </h6>
        <Button
          variant={"link"}
          className={"refresh-btn"}
          size={"sm"}
          title={"reload"}
          onClick={() => {
            setCurrentPage(1);
            setCount(MathHelper.add(count, 1));
          }}
        >
          <Icons.Recycle /> Refresh
        </Button>
      </FlexContainer>
      <Table
        hover
        striped
        isLoading={isLoading === true && currentPage > 1}
        pagination={{
          currentPage,
          totalPages: responseList?.pages || 0,
          onSetCurrentPage: (pageNo: number) => setCurrentPage(pageNo),
          perPage: responseList?.perPage || 10
        }}
        columns={getColumns()}
        rows={responseList?.data || []}
      />
    </Wrapper>
  );
};

export default ConfirmationOfDetailsListPanel;
