import React from "react";
import { iRecordType } from "../../../types/StudentAbsence/iStudentAbsence";
import { useEffect, useState } from "react";
import iPaginatedResult from "../../../types/iPaginatedResult";
import Toaster from "../../../services/Toaster";
import PageLoadingSpinner from "../../../components/common/PageLoadingSpinner";
import StudentScheduledAbsenceService from "../../../services/StudentAbsences/StudentScheduledAbsenceService";
import iStudentAbsenceSchedule from "../../../types/StudentAbsence/iStudentAbsenceSchedule";
import Table, { iTableColumn } from "../../../components/common/Table";
import { Badge, Image } from "react-bootstrap";
import styled from "styled-components";
import * as Icons from "react-bootstrap-icons";
import moment from "moment-timezone";
import { FlexContainer } from "../../../styles";
import DeleteConfirmPopupBtn from "../../../components/common/DeleteConfirm/DeleteConfirmPopupBtn";
import StudentScheduledAbsenceEditPopupBtn from "./StudentScheduledAbsenceEditPopupBtn";
import MathHelper from "../../../helper/MathHelper";

type iStudentScheduledAbsenceListPanel = {
  type: iRecordType;
};

const Wrapper = styled.div`
  td {
    &.photo {
      width: 10%;
      img {
        min-width: 32px;
        max-width: 80px;
      }
    }
    &.operations {
      .btn {
        width: 100%;
      }
    }
    .edit-btn {
      padding: 0px;
    }
  }
`;
const StudentScheduledAbsenceListPanel = ({
  type
}: iStudentScheduledAbsenceListPanel) => {
  const [records, setRecords] = useState<
    iPaginatedResult<iStudentAbsenceSchedule>
  >();
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let isCanceled = false;

    setIsLoading(true);
    StudentScheduledAbsenceService.getAll({
      where: JSON.stringify({
        eventType: type,
        active: true
      }),
      perPage: 999999,
      include: `Event.Student,Event.AbsenceReason,CreatedBy`,
      sort: "id:DESC"
    })
      .then(resp => {
        if (isCanceled) return;
        setRecords(resp);
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
  }, [type, count]);

  const getColumns = <T extends {}>() => [
    {
      key: "photo",
      header: (col: iTableColumn<T>) => {
        return (
          <th key={col.key}>
            {isLoading === true ? null : <>Total: {records?.total || 0}</>}
          </th>
        );
      },
      cell: (col: iTableColumn<T>, data: iStudentAbsenceSchedule) => {
        return (
          <td key={col.key} className={col.key}>
            <Image src={data.Event?.Student?.profileUrl} />
          </td>
        );
      }
    },
    {
      key: "student",
      header: "Student",
      cell: (col: iTableColumn<T>, data: iStudentAbsenceSchedule) => {
        return (
          <td key={col.key} className={col.key}>
            <div>
              <StudentScheduledAbsenceEditPopupBtn
                className={'edit-btn'}
                variant={'link'}
                size={'sm'}
                recordType={type}
                onSaved={() => setCount(MathHelper.add(count, 1))}
                studentScheduledAbsence={data}
              >
                {data.Event?.Student?.StudentNameInternal || ""}{`${data.Event?.StudentID || ""}`.trim() !== '' ? ` [${`${data.Event?.StudentID || ""}`.trim()}]` : ''}
              </StudentScheduledAbsenceEditPopupBtn>
            </div>
            <div>Comments: {data.Event?.Comments || ""}</div>
          </td>
        );
      }
    },
    {
      key: "reason",
      header: "Reason",
      cell: (col: iTableColumn<T>, data: iStudentAbsenceSchedule) => {
        return (
          <td key={col.key} className={col.key}>
            {data.Event?.AbsenceCode || ""} -{" "}
            {data.Event?.AbsenceReason?.Description || ""}
          </td>
        );
      }
    },
    {
      key: "parentSlip",
      header: "ParentSlip?",
      cell: (col: iTableColumn<T>, data: iStudentAbsenceSchedule) => {
        return (
          <td key={col.key} className={col.key}>
            <div>
              {data.Event?.hasNote ? (
                <span className={"text-success"} title={"parent knows"}>
                  <Icons.CheckSquareFill />
                </span>
              ) : null}
            </div>
          </td>
        );
      }
    },
    {
      key: "Scheduled",
      header: "Scheduled",
      cell: (col: iTableColumn<T>, data: iStudentAbsenceSchedule) => {
        return (
          <td key={col.key} className={col.key}>
            <FlexContainer className={"with-gap"}>
              <div>{moment(data.startDate).format("DD MMM YYYY")}</div>
              <div>~</div>
              <div>{moment(data.endDate).format("DD MMM YYYY")}</div>
            </FlexContainer>
            <FlexContainer className={"with-gap"}>
              <div>{moment(`${data.time || ""}`).utc().format("hh:mm a")}</div>
              <div>
                <b>ON</b>
              </div>
            </FlexContainer>
            <FlexContainer className={"with-gap"}>
              {data.monday === true ? (
                <Badge bg={"secondary"}>MON</Badge>
              ) : null}
              {data.tuesday === true ? (
                <Badge bg={"secondary"}>TUE</Badge>
              ) : null}
              {data.wednesday === true ? (
                <Badge bg={"secondary"}>WED</Badge>
              ) : null}
              {data.thursday === true ? (
                <Badge bg={"secondary"}>THU</Badge>
              ) : null}
              {data.friday === true ? (
                <Badge bg={"secondary"}>FRI</Badge>
              ) : null}
            </FlexContainer>
          </td>
        );
      }
    },
    {
      key: "created",
      header: "Created",
      cell: (col: iTableColumn<T>, data: iStudentAbsenceSchedule) => {
        return (
          <td key={col.key} className={col.key}>
            <div>
              <b>By: </b>
              {data.CreatedBy?.NameInternal || ""}
            </div>
            <div>
              <b>@: </b>
              {`${data.created_at}`.trim() === ""
                ? ""
                : moment(`${data.created_at}`.trim()).format(
                    "DD MMM YYYY HH:mm a"
                  )}
            </div>
          </td>
        );
      }
    },
    {
      key: "operations",
      header: "",
      cell: (col: iTableColumn<T>, data: iStudentAbsenceSchedule) => {
        return (
          <td key={col.key} className={col.key}>
            <DeleteConfirmPopupBtn
              variant={"danger"}
              deletingFn={() => StudentScheduledAbsenceService.remove(data.id)}
              deletedCallbackFn={() => setCount(MathHelper.add(count, 1))}
              size={"sm"}
              description={
                <>
                  You are about to delete a scheduled event for{" "}
                  <b>{data.Event?.Student?.StudentNameInternal || ""}</b>
                </>
              }
              confirmString={`${data.id}`}
            >
              <Icons.Trash />
            </DeleteConfirmPopupBtn>
          </td>
        );
      }
    }
  ];

  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  return (
    <Wrapper>
      <Table
        responsive
        columns={getColumns<iStudentAbsenceSchedule>()}
        rows={(records?.data || []).sort((rec1, rec2) =>
          `${rec1.Event?.Student?.StudentNameInternal || ""}` <
          `${rec2.Event?.Student?.StudentNameInternal || ""}`
            ? -1
            : 1
        )}
      />
    </Wrapper>
  );
};

export default StudentScheduledAbsenceListPanel;
