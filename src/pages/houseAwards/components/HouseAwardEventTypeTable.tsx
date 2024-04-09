import React, { useCallback } from "react";
import styled from "styled-components";
import { Button, Spinner } from "react-bootstrap";
import HouseAwardEventTypeService from "../../../services/HouseAwards/HouseAwardEventTypeService";
import iHouseAwardEventType from "../../../types/HouseAwards/iHouseAwardEventType";
import moment from "moment-timezone";
import useListCrudHook from "../../../components/hooks/useListCrudHook/useListCrudHook";
import HouseAwardEventTypeAddOrEditPopup from "./HouseAwardEventTypeAddOrEditPopup";
import { FlexContainer } from "../../../styles";
import * as Icons from "react-bootstrap-icons";
import DeleteConfirmPopup from "../../../components/common/DeleteConfirm/DeleteConfirmPopup";
import { iConfigParams } from "../../../services/AppService";
import Table, { iTableColumn } from "../../../components/common/Table";
import IconDisplay from '../../../components/IconDisplay';

const Wrapper = styled.div``;
type iHouseAwardEventTypeTable = {};
const HouseAwardEventTypeTable = (props: iHouseAwardEventTypeTable) => {
  const {
    state,
    edit,
    onOpenAddModal,
    onOpenEditModal,
    onCloseModal,
    onSubmit,
    onDelete
  } = useListCrudHook<iHouseAwardEventType>({
    getFn: useCallback((config?: iConfigParams) => {
      const where = config ? JSON.parse(config?.where || "{}") : {};
      return HouseAwardEventTypeService.getEventTypes({
        where: JSON.stringify({ ...where, active: true })
      });
    }, []),
    createFn: HouseAwardEventTypeService.createEventType,
    updateFn: HouseAwardEventTypeService.updateEventType,
    deleteFn: HouseAwardEventTypeService.deleteEventType
  });

  const getPopup = () => {
    if (edit.target) {
      if (!edit.delTargetId) {
        return (
          <HouseAwardEventTypeAddOrEditPopup
            eventType={edit.target}
            isShowing={edit.isModalOpen}
            handleClose={onCloseModal}
            onSubmit={onSubmit}
            isSubmitting={state.isConfirming}
          />
        );
      }

      return (
        <DeleteConfirmPopup
          confirmString={`${edit.target.name}`}
          isOpen={edit.isModalOpen}
          onClose={onCloseModal}
          onConfirm={() => onDelete(edit.delTargetId || 0)}
        />
      );
    }
    return (
      <HouseAwardEventTypeAddOrEditPopup
        isShowing={edit.isModalOpen}
        handleClose={onCloseModal}
        onSubmit={onSubmit}
        isSubmitting={state.isConfirming}
      />
    );
  };

  if (state.isLoading) {
    return <Spinner animation={"border"} />;
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

      <Table
        columns={[
          {
            key: "name",
            header: "Name",
            cell: (col: iTableColumn, data: iHouseAwardEventType) => {
              return (
                <td key={col.key}>
                  <Button
                    size={"sm"}
                    variant={"link"}
                    onClick={() => onOpenEditModal(data.id)}
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
            cell: (col: iTableColumn, data: iHouseAwardEventType) => {
              return <td key={col.key}>{data.points_to_be_awarded}</td>;
            }
          },
          {
            key: "icon",
            header: "Icon",
            cell: (col: iTableColumn, data: iHouseAwardEventType) => {
              return <td key={col.key}><IconDisplay name={data.icon || ''} /></td>;
            }
          },
          {
            key: "comments",
            header: "Comments",
            cell: (col: iTableColumn, data: iHouseAwardEventType) => {
              return <td key={col.key}>{data.comments}</td>;
            }
          },
          {
            key: "created",
            header: "Created",
            cell: (col: iTableColumn, data: iHouseAwardEventType) => {
              return (
                <td key={col.key}>{moment(data.created_at).format("lll")}</td>
              );
            }
          },
          {
            key: "updated",
            header: "Updated",
            cell: (col: iTableColumn, data: iHouseAwardEventType) => {
              return (
                <td key={col.key}>{moment(data.updated_at).format("lll")}</td>
              );
            }
          }
        ]}
        rows={state.data || []}
        striped
        hover
        responsive
      />
      {getPopup()}
    </Wrapper>
  );
};

export default HouseAwardEventTypeTable;
