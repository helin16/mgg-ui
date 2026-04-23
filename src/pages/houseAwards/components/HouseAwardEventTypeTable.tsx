import React, {useCallback} from "react";
import styled from "styled-components";
import { Button } from "react-bootstrap";
import HouseAwardEventTypeService from "../../../services/HouseAwards/HouseAwardEventTypeService";
import iHouseAwardEventType from "../../../types/HouseAwards/iHouseAwardEventType";
import moment from "moment-timezone";
import useListCrudHook from "../../../components/hooks/useListCrudHook/useListCrudHook";
import HouseAwardEventTypeAddOrEditPopup from "./HouseAwardEventTypeAddOrEditPopup";
import { FlexContainer } from "../../../styles";
import * as Icons from "react-bootstrap-icons";
import DeleteConfirmPopup from "../../../components/common/DeleteConfirm/DeleteConfirmPopup";
import AppService from "../../../services/AppService";
import { iTableColumn } from "../../../components/common/Table";
import IconDisplay from '../../../components/IconDisplay';
import PageLoadingSpinner from '../../../components/common/PageLoadingSpinner';

const Wrapper = styled.div``;
type iHouseAwardEventTypeTable = {};
const HouseAwardEventTypeTable = (props: iHouseAwardEventTypeTable) => {
  const {
    state,
    viewingState,
    onOpenAddModal,
    onOpenEditModal,
    onCloseModal,
    onSubmit,
    onDelete,
    renderDataTable,
    onRefreshWhenCreated,
    onRefreshOnCurrentPage,
    onRefresh,
  } = useListCrudHook<iHouseAwardEventType>({
    perPage: 99999,
    getFn: useCallback(async (config) => {
      const { filter, ...props } = config || {};
      return HouseAwardEventTypeService.getEventTypes({
        where: JSON.stringify({ ...filter, active: true }),
        ...props
      }).then(res => AppService.convertArrToPaginatedArr(res));
    }, []),
    createFn: data => HouseAwardEventTypeService.createEventType(data),
    updateFn: (model, data) =>
      HouseAwardEventTypeService.updateEventType(model.id, data || {}),
    deleteFn: model => HouseAwardEventTypeService.deleteEventType(model.id)
  });

  const getPopup = () => {
    if (!viewingState.isModalOpen) {
      return null;
    }

    // creating
    if (!viewingState.editingModel) {
      return (
        <HouseAwardEventTypeAddOrEditPopup
          isShowing={viewingState.isModalOpen}
          handleClose={() => onCloseModal()}
          onSubmit={(data) => onSubmit(data)?.then(res => {
            onRefreshWhenCreated();
            return res;
          })}
          isSubmitting={viewingState.isSaving}
        />
      )
    }

    // deleting
    if (viewingState.isShowingDeleting === true) {
      return (
        <DeleteConfirmPopup
          confirmString={`${viewingState.editingModel.name}`}
          isOpen={viewingState.isModalOpen}
          onClose={() => onCloseModal()}
          // @ts-ignore
          onConfirm={() => onDelete(viewingState.editingModel).then(res => {
            onRefresh();
            return res
          })}
        />
      )
    }

    // editing
    return (
      <HouseAwardEventTypeAddOrEditPopup
        eventType={viewingState.editingModel}
        isShowing={viewingState.isModalOpen}
        handleClose={() => onCloseModal()}
        onSubmit={(data) => onSubmit(data)?.then(res => {
          onRefreshOnCurrentPage();
          return res;
        })}
        isSubmitting={viewingState.isSaving}
      />
    )
  };

  const getColumns = <T extends {}>() => [
    {
      key: "name",
      header: "Name",
      cell: (col: iTableColumn<T>, data: iHouseAwardEventType) => {
        return (
          <td key={col.key}>
            <Button
              size={"sm"}
              variant={"link"}
              onClick={() => onOpenEditModal(data)}
            >
              {data.name}
            </Button>
          </td>
        );
      }
    },
    {
      key: "PointsToBeAwarded",
      header: "Points to be awarded",
      cell: (col: iTableColumn<T>, data: iHouseAwardEventType) => {
        return <td key={col.key}>{data.points_to_be_awarded}</td>;
      }
    },
    {
      key: "icon",
      header: "Icon",
      cell: (col: iTableColumn<T>, data: iHouseAwardEventType) => {
        return <td key={col.key}><IconDisplay name={data.icon || ''} /></td>;
      }
    },
    {
      key: "comments",
      header: "Comments",
      cell: (col: iTableColumn<T>, data: iHouseAwardEventType) => {
        return <td key={col.key}>{data.comments}</td>;
      }
    },
    {
      key: "created",
      header: "Created",
      cell: (col: iTableColumn<T>, data: iHouseAwardEventType) => {
        return (
          <td key={col.key}>{moment(data.created_at).format("lll")}</td>
        );
      }
    },
    {
      key: "updated",
      header: "Updated",
      cell: (col: iTableColumn<T>, data: iHouseAwardEventType) => {
        return (
          <td key={col.key}>{moment(data.updated_at).format("lll")}</td>
        );
      }
    }
  ]

  if (state.isLoading) {
    return <PageLoadingSpinner />;
  }

  return (
    <Wrapper>
      <FlexContainer
        className={"justify-content-start gap-2 align-items-center"}
      >
        <h5>Event Types</h5>
        <Button
          variant={"success"}
          size={"sm"}
          onClick={() => onOpenAddModal()}
        >
          <Icons.Plus />
        </Button>
      </FlexContainer>
      {
        renderDataTable({
          columns: getColumns<iHouseAwardEventType>(),
          striped: true,
          hover: true,
          responsive: true,
        })
      }
      {getPopup()}
    </Wrapper>
  );
};

export default HouseAwardEventTypeTable;
