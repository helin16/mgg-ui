import styled from "styled-components";
import { useEffect, useState } from "react";
import iPaginatedResult from "../../../types/iPaginatedResult";
import iCampusDisplay from "../../../types/CampusDisplay/iCampusDisplay";
import CampusDisplayService from "../../../services/CampusDisplay/CampusDisplayService";
import Toaster, { TOAST_TYPE_SUCCESS } from "../../../services/Toaster";
import PageLoadingSpinner from "../../common/PageLoadingSpinner";
import Table, { iTableColumn } from "../../common/Table";
import CampusDisplayEditPopupBtn from "./CampusDisplayEditPopupBtn";
import * as Icons from "react-bootstrap-icons";
import MathHelper from "../../../helper/MathHelper";
import DeleteConfirmPopupBtn from "../../common/DeleteConfirm/DeleteConfirmPopupBtn";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/makeReduxStore";
import moment from "moment-timezone";
import UserAndDateTimePanel from "../../common/UserAndDateTimePanel";
import { Button, Spinner } from "react-bootstrap";
import iCampusDisplayLocation from "../../../types/CampusDisplay/iCampusDisplayLocation";
import CampusDisplayLocationService from "../../../services/CampusDisplay/CampusDisplayLocationService";

const Wrapper = styled.div``;

type iDisplayingLocation = {
  displayId: string;
};
const DisplayingLocation = ({ displayId }: iDisplayingLocation) => {
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<iCampusDisplayLocation[]>([]);

  useEffect(() => {
    let isCanceled = false;

    setIsLoading(true);
    CampusDisplayLocationService.getAll({
      where: JSON.stringify({ isActive: true, displayId }),
      sort: "createdAt:DESC",
      perPage: 999999
    })
      .then(resp => {
        if (isCanceled) {
          return;
        }
        setLocations(resp.data || []);
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
  }, [displayId]);

  if (isLoading === true) {
    return <Spinner animation={"border"} />;
  }

  return <div>{locations.map(location => location.name).join(", ")}</div>;
};

type iCampusDisplayList = {
  narrowMode?: boolean;
  onSelect?: (playList: iCampusDisplay) => void;
  onSaved?: (playList: iCampusDisplay) => void;
  onDeleted?: (playList: iCampusDisplay) => void;
};
const CampusDisplayList = ({ onSelect, onSaved, onDeleted, narrowMode = false }: iCampusDisplayList) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [displayList, setDisplayList] = useState<iPaginatedResult<
    iCampusDisplay
  > | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCanceled = false;

    setIsLoading(true);
    CampusDisplayService.getAll({
      where: JSON.stringify({ isActive: true }),
      include: `CreatedBy,UpdatedBy`,
      currentPage,
      perPage
    })
      .then(resp => {
        if (isCanceled) {
          return;
        }
        setDisplayList(resp);
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
  }, [currentPage, count, perPage]);

  const getColumns = (): iTableColumn[] => {
    return [
      {
        key: "name",
        header: "Name",
        cell: (column: iTableColumn, data: iCampusDisplay) => {
          return (
            <td key={column.key}>
              {onSelect ? (
                <Button
                  size={"sm"}
                  variant={"link"}
                  onClick={() => onSelect(data)}
                >
                  {data.name}
                </Button>
              ) : (
                `${data.name || ""}`
              )}
            </td>
          );
        }
      },
      ...(narrowMode === true ? [] : [
        {
          key: "location",
          header: "Default PlayList At",
          cell: (column: iTableColumn, data: iCampusDisplay) => {
            return (
              <td key={column.key}>
                <DisplayingLocation displayId={data.id} />
              </td>
            );
          }
        },
        {
          key: "created",
          header: "Created",
          cell: (column: iTableColumn, data: iCampusDisplay) => {
            return (
              <td key={column.key}>
                <small>
                  <UserAndDateTimePanel
                    userString={`${data.CreatedBy?.firstName || ""} ${data
                      .CreatedBy?.lastName || ""}`.trim()}
                    dateTimeString={moment(data.createdAt).format("lll")}
                  />
                </small>
              </td>
            );
          }
        },
        {
          key: "updated",
          header: "Updated",
          cell: (column: iTableColumn, data: iCampusDisplay) => {
            return (
              <td key={column.key}>
                <small>
                  <UserAndDateTimePanel
                    userString={`${data.UpdatedBy?.firstName || ""} ${data
                      .UpdatedBy?.lastName || ""}`.trim()}
                    dateTimeString={moment(data.updatedAt).format("lll")}
                  />
                </small>
              </td>
            );
          }
        },
      ]),
      {
        key: "operations",
        header: (column: iTableColumn) => {
          return (
            <td key={column.key} className={"text-right"}>
              <CampusDisplayEditPopupBtn
                variant={"success"}
                size={"sm"}
                onSaved={(saved) => {
                  if (onSaved) {
                    onSaved(saved);
                    return;
                  }
                  setCount(MathHelper.add(count, 1))
                }}
              >
                <Icons.Plus /> New
              </CampusDisplayEditPopupBtn>
            </td>
          );
        },
        cell: (column: iTableColumn, data: iCampusDisplay) => {
          return (
            <td key={column.key} className={"text-right"}>
              <CampusDisplayEditPopupBtn
                variant={"secondary"}
                campusDisplay={data}
                size={"sm"}
                onSaved={() => setCount(MathHelper.add(count, 1))}
              >
                <Icons.Pencil />
              </CampusDisplayEditPopupBtn>{" "}
              <DeleteConfirmPopupBtn
                variant={"danger"}
                deletingFn={() =>
                  CampusDisplayService.deactivate(data.id || "")
                }
                deletedCallbackFn={(deleted) => {
                  Toaster.showToast("Display Deleted.", TOAST_TYPE_SUCCESS);
                  setCount(MathHelper.add(count, 1));
                  onDeleted && onDeleted(deleted);
                }}
                size={"sm"}
                description={
                  <>
                    You are about to delete the display <u>{data.name}</u>
                  </>
                }
                confirmString={`${user?.synergyId || "na"}`}
              >
                <Icons.Trash />
              </DeleteConfirmPopupBtn>
            </td>
          );
        }
      }
    ];
  };

  const getContent = () => {
    if (isLoading) {
      return <PageLoadingSpinner />;
    }
    return (
      <Table
        columns={getColumns()}
        rows={displayList?.data || []}
        pagination={{
          totalPages: displayList?.pages || 0,
          currentPage: displayList?.currentPage || 0,
          onSetCurrentPage: (page: number) => setCurrentPage(page),
          perPage: displayList?.perPage || 0,
          onPageSizeChanged: (pageSize: number) => setPerPage(pageSize)
        }}
        responsive
        hover
        striped
      />
    );
  };

  return <Wrapper>{getContent()}</Wrapper>;
};

export default CampusDisplayList;
