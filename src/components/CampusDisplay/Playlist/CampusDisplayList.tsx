import styled from "styled-components";
import {useCallback, useEffect, useState} from "react";
import iCampusDisplay from "../../../types/CampusDisplay/iCampusDisplay";
import CampusDisplayService from "../../../services/CampusDisplay/CampusDisplayService";
import Toaster, { TOAST_TYPE_SUCCESS } from "../../../services/Toaster";
import PageLoadingSpinner from "../../common/PageLoadingSpinner";
import { iTableColumn } from "../../common/Table";
import CampusDisplayEditPopupBtn from "./CampusDisplayEditPopupBtn";
import * as Icons from "react-bootstrap-icons";
import DeleteConfirmPopupBtn from "../../common/DeleteConfirm/DeleteConfirmPopupBtn";
import moment from "moment-timezone";
import UserAndDateTimePanel from "../../common/UserAndDateTimePanel";
import { Button, Spinner } from "react-bootstrap";
import iCampusDisplayLocation from "../../../types/CampusDisplay/iCampusDisplayLocation";
import CampusDisplayLocationService from "../../../services/CampusDisplay/CampusDisplayLocationService";
import useListCrudHook from '../../hooks/useListCrudHook/useListCrudHook';

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
  const {state, renderDataTable, onRefreshOnCurrentPage, onRefresh} = useListCrudHook<iCampusDisplay>({
    getFn: useCallback((config) => {
      const {filter, sort, ...props} = (config || {});
      return CampusDisplayService.getAll({
        perPage: 999999,
        where: JSON.stringify({ ...filter, isActive: true }),
        include: sort || `CreatedBy,UpdatedBy`,
        ...props,
      })
    }, []),
  })

  const getColumns = <T extends {}>() => {
    return [
      {
        key: "name",
        header: "Name",
        cell: (column: iTableColumn<T>, data: iCampusDisplay) => {
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
          cell: (column: iTableColumn<T>, data: iCampusDisplay) => {
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
          cell: (column: iTableColumn<T>, data: iCampusDisplay) => {
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
          cell: (column: iTableColumn<T>, data: iCampusDisplay) => {
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
        header: (column: iTableColumn<T>) => {
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
                  onRefreshOnCurrentPage()
                }}
              >
                <Icons.Plus /> New
              </CampusDisplayEditPopupBtn>
            </td>
          );
        },
        cell: (column: iTableColumn<T>, data: iCampusDisplay) => {
          return (
            <td key={column.key} className={"text-right"}>
              <CampusDisplayEditPopupBtn
                variant={"secondary"}
                campusDisplay={data}
                size={"sm"}
                onSaved={() => onRefreshOnCurrentPage() }
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
                  onRefresh();
                  onDeleted && onDeleted(deleted);
                }}
                size={"sm"}
                description={
                  <>
                    You are about to delete the display <u>{data.name}</u>
                  </>
                }
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
    if (state.isLoading) {
      return <PageLoadingSpinner />;
    }

    return renderDataTable({
      columns: getColumns<iCampusDisplay>(),
      responsive: true,
      hover: true,
      striped: true,
    })
  };

  return <Wrapper>{getContent()}</Wrapper>;
};

export default CampusDisplayList;
