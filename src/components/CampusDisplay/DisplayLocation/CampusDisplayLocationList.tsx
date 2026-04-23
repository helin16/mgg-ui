import styled from "styled-components";
import iCampusDisplayLocation from "../../../types/CampusDisplay/iCampusDisplayLocation";
import Toaster, { TOAST_TYPE_SUCCESS } from "../../../services/Toaster";
import { iTableColumn } from "../../common/Table";
import * as Icons from "react-bootstrap-icons";
import DeleteConfirmPopupBtn from "../../common/DeleteConfirm/DeleteConfirmPopupBtn";
import moment from "moment-timezone";
import CampusDisplayLocationService from "../../../services/CampusDisplay/CampusDisplayLocationService";
import UserAndDateTimePanel from "../../common/UserAndDateTimePanel";
import CampusDisplayLocationEditPopupBtn from "./CampusDisplayLocationEditPopupBtn";
import useListCrudHook from "../../hooks/useListCrudHook/useListCrudHook";
import PageLoadingSpinner from '../../common/PageLoadingSpinner';
import {useCallback} from 'react';

const Wrapper = styled.div``;
const CampusDisplayLocationList = () => {
  const {
    state,
    renderDataTable,
    onRefreshOnCurrentPage,
    onRefresh
  } = useListCrudHook<iCampusDisplayLocation>({
    perPage: 99999,
    getFn: useCallback(config => {
      const { filter, sort, ...props } = config || {};
      return CampusDisplayLocationService.getAll({
        where: JSON.stringify({ ...filter, isActive: true }),
        include: "CampusDisplay,CreatedBy,UpdatedBy",
        sort: sort || "createdAt:DESC",
        ...props
      });
    }, []),
  });

  const getColumns = <T extends {}>(): iTableColumn<T>[] => {
    return [
      {
        key: "location",
        header: "Location",
        cell: (column: iTableColumn<T>, data: iCampusDisplayLocation) => {
          return <td key={column.key}>{data.name}</td>;
        }
      },
      {
        key: "playList",
        header: "Playing List",
        cell: (column: iTableColumn<T>, data: iCampusDisplayLocation) => {
          return <td key={column.key}>{data.CampusDisplay?.name || ""}</td>;
        }
      },
      {
        key: "version",
        header: "Current Version",
        cell: (column: iTableColumn<T>, data: iCampusDisplayLocation) => {
          return <td key={column.key}>{data.version || "0"}</td>;
        }
      },
      {
        key: "created",
        header: "Created",
        cell: (column: iTableColumn<T>, data: iCampusDisplayLocation) => {
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
        cell: (column: iTableColumn<T>, data: iCampusDisplayLocation) => {
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
      {
        key: "operations",
        header: (column: iTableColumn<T>) => {
          return (
            <td key={column.key} className={"text-right"}>
              <CampusDisplayLocationEditPopupBtn
                variant={"success"}
                size={"sm"}
                onSaved={() => onRefreshOnCurrentPage()}
              >
                <Icons.Plus /> New
              </CampusDisplayLocationEditPopupBtn>
            </td>
          );
        },
        cell: (column: iTableColumn<T>, data: iCampusDisplayLocation) => {
          return (
            <td key={column.key} className={"text-right"}>
              <CampusDisplayLocationEditPopupBtn
                variant={"secondary"}
                campusDisplayLocation={data}
                size={"sm"}
                onSaved={() => onRefreshOnCurrentPage()}
              >
                <Icons.Pencil />
              </CampusDisplayLocationEditPopupBtn>{" "}
              <DeleteConfirmPopupBtn
                variant={"danger"}
                deletingFn={() =>
                  CampusDisplayLocationService.deactivate(data.id || "")
                }
                deletedCallbackFn={() => {
                  Toaster.showToast("Display Deleted.", TOAST_TYPE_SUCCESS);
                  onRefresh();
                }}
                size={"sm"}
                description={
                  <>
                    You are about to delete the location <u>{data.name}</u>
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

  return (
    <Wrapper>
      {state.isLoading === true ? (
        <PageLoadingSpinner />
      ) : (
        renderDataTable({
          columns: getColumns<iCampusDisplayLocation>()
        })
      )}
    </Wrapper>
  );
};

export default CampusDisplayLocationList;
