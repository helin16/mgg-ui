import React, {useCallback} from "react";
import iHouseAwardEvent from "../../../types/HouseAwards/iHouseAwardEvent";
import HouseAwardEventService from "../../../services/HouseAwards/HouseAwardEventService";
import styled from "styled-components";
import { Button, Spinner } from "react-bootstrap";
import * as Icons from "react-bootstrap-icons";
import moment from "moment-timezone";
import { FlexContainer } from "../../../styles";
import useListCrudHook from "../../../components/hooks/useListCrudHook/useListCrudHook";
import AppService from "../../../services/AppService";
import DeleteConfirmPopup from "../../../components/common/DeleteConfirm/DeleteConfirmPopup";
import HouseAwardEventAddOrEditPopup from "./HouseAwardEventAddOrEditPopup";
import { iTableColumn } from "../../../components/common/Table";

const Wrapper = styled.div``;
const HouseAwardEventTable = () => {
  const {
    state,
    viewingState,
    onOpenAddModal,
    onOpenEditModal,
    onCloseModal,
    onOpenDeleteModal,
    onSubmit,
    onDelete,
    renderDataTable,
    onRefreshWhenCreated,
    onRefreshOnCurrentPage,
    onRefresh,
  } = useListCrudHook<iHouseAwardEvent>({
    perPage: 99999,
    getFn: useCallback(async (config) => {
      const { filter, ...props } = config || {};
      return HouseAwardEventService.getEvents({
        where: JSON.stringify({ ...filter, active: true }),
        ...props
      }).then(res => AppService.convertArrToPaginatedArr(res));
    }, []),
    createFn: data => HouseAwardEventService.createEvent(data),
    updateFn: (model, data) =>
      HouseAwardEventService.updateEvent(model.id, data || {}),
    deleteFn: model => HouseAwardEventService.deleteEvent(model.id)
  });

  const getPopup = () => {
    if (viewingState.isModalOpen !== true) {
      return null;
    }

    if (!viewingState.editingModel) {
      return (
        <HouseAwardEventAddOrEditPopup
          isShowing={viewingState.isModalOpen}
          handleClose={() => onCloseModal()}
          onSubmit={(data) => onSubmit(data)?.then(res => {
            onRefreshOnCurrentPage();
            return res;
          })}
          isSubmitting={viewingState.isSaving}
        />
      );
    }

    if (viewingState.isShowingDeleting === true) {
      return (
        <DeleteConfirmPopup
          confirmString={`${viewingState.editingModel.name}`}
          isOpen={viewingState.isShowingDeleting}
          onClose={() => onCloseModal()}
          // @ts-ignore
          onConfirm={() => onDelete(viewingState.editingModel).then(res => {
            onRefresh();
            return res;
          })}
        />
      );
    }

    return (
      <HouseAwardEventAddOrEditPopup
        event={viewingState.editingModel}
        isShowing={viewingState.isModalOpen}
        handleClose={() => onCloseModal()}
        onSubmit={(data) => onSubmit(data)?.then(res => {
          onRefreshWhenCreated();
          return res;
        })}
        isSubmitting={viewingState.isSaving}
      />
    );
  };

  if (state.isLoading) {
    return <Spinner animation={"border"} />;
  }

  return (
    <Wrapper>
      <FlexContainer className={"withGap"}>
        <h5>Events</h5>
        <Button variant={"info"} size={"sm"} onClick={() => onOpenAddModal()}>
          <Icons.Plus />
        </Button>
      </FlexContainer>
      {renderDataTable({
        striped: true,
        hover: true,
        columns: [
          {
            key: "name",
            header: "Name",
            cell: (
              col: iTableColumn<iHouseAwardEvent>,
              event: iHouseAwardEvent
            ) => {
              return (
                <td key={col.key}>
                  <Button
                    variant={"link"}
                    size={"sm"}
                    onClick={() => onOpenEditModal(event)}
                  >
                    {event.name}
                  </Button>
                </td>
              );
            }
          },
          {
            key: "description",
            header: "Description",
            cell: (
              col: iTableColumn<iHouseAwardEvent>,
              event: iHouseAwardEvent
            ) => {
              return <td key={col.key}>{event.description}</td>;
            }
          },
          {
            key: "created",
            header: "Created",
            cell: (
              col: iTableColumn<iHouseAwardEvent>,
              event: iHouseAwardEvent
            ) => {
              return (
                <td key={col.key}>{moment(event.created_at).format("lll")}</td>
              );
            }
          },
          {
            key: "update",
            header: "Update",
            cell: (
              col: iTableColumn<iHouseAwardEvent>,
              event: iHouseAwardEvent
            ) => {
              return (
                <td key={col.key}>{moment(event.updated_at).format("lll")}</td>
              );
            }
          },
          {
            key: "btns",
            header: "",
            cell: (
              col: iTableColumn<iHouseAwardEvent>,
              event: iHouseAwardEvent
            ) => {
              return (
                <td key={col.key} className={"text-right"}>
                  <Button
                    variant={"danger"}
                    size={"sm"}
                    onClick={() => onOpenDeleteModal(event)}
                  >
                    <Icons.Trash />
                  </Button>
                </td>
              );
            }
          }
        ]
      })}
      {getPopup()}
    </Wrapper>
  );
};

export default HouseAwardEventTable;
