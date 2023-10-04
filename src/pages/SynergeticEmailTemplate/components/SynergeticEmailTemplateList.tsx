import ExplanationPanel from "../../../components/ExplanationPanel";
import React, { useEffect, useState } from "react";
import iPaginatedResult from "../../../types/iPaginatedResult";
import iSynCommunicationTemplate, {
  SYN_COMMUNICATION_TEMPLATE_TYPE_HTML
} from "../../../types/Synergetic/iSynCommunicationTemplate";
import SynCommunicationTemplateService from "../../../services/Synergetic/SynCommunicationTemplateService";
import Toaster, { TOAST_TYPE_SUCCESS } from "../../../services/Toaster";
import Table, { iTableColumn } from "../../../components/common/Table";
import moment from "moment-timezone";
import { FlexContainer } from "../../../styles";
import PageLoadingSpinner from "../../../components/common/PageLoadingSpinner";
import LoadingBtn from "../../../components/common/LoadingBtn";
import * as Icons from "react-bootstrap-icons";
import MathHelper from "../../../helper/MathHelper";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/makeReduxStore";
import { OP_OR } from "../../../helper/ServiceHelper";
import styled from "styled-components";
import UtilsService from "../../../services/UtilsService";
import DeleteConfirmPopupBtn from "../../../components/common/DeleteConfirm/DeleteConfirmPopupBtn";
import { Button } from "react-bootstrap";
import SynergeticEmailTemplateEditPanel from "./SynergeticEmailTemplateEditPanel";

const Wrapper = styled.div`
  .templates-table {
    .btn.btn-link {
      padding: 0px;
    }
    td.message {
      max-width: 300px;
    }
  }

  .edit-popup {
    .popup-panel {
      width: calc(100vw - 20%);
      margin: 1.2rem auto;
    }
  }
`;

const SynergeticEmailTemplateList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [templateList, setTemplateList] = useState<iPaginatedResult<
    iSynCommunicationTemplate
  > | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingTemplate, setEditingTemplate] = useState<
    iSynCommunicationTemplate | null | undefined
  >(null);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    let isCanceled = false;
    setIsLoading(true);

    SynCommunicationTemplateService.getAll({
      where: JSON.stringify({
        MessageType: SYN_COMMUNICATION_TEMPLATE_TYPE_HTML,
        [OP_OR]: [
          {
            PrivateFlag: false
          },
          {
            PrivateFlag: true,
            Owner: `MGG\\${user?.SynCommunity?.NetworkLogin || ""}`
          }
        ]
      }),
      sort: "CommunicationTemplatesSeq:DESC",
      currentPage
    })
      .then(resp => {
        if (isCanceled) {
          return;
        }
        setTemplateList(resp);
        setEditingTemplate(null);
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
  }, [currentPage, count, user?.SynCommunity]);

  const getColumns = () => [
    {
      key: "name",
      header: "Name",
      cell: (col: iTableColumn, data: iSynCommunicationTemplate) => {
        return (
          <td key={col.key}>
            <Button
              variant={"link"}
              size={"sm"}
              className={"ellipsis"}
              onClick={() => setEditingTemplate(data)}
            >
              {data.Name || ""}
            </Button>
            <div className={"ellipsis"}>
              <i>
                <small>{data.Description}</small>
              </i>
            </div>
          </td>
        );
      }
    },
    {
      key: "message",
      header: "Message",
      cell: (col: iTableColumn, data: iSynCommunicationTemplate) => {
        return (
          <td key={col.key} className={"message"}>
            <Button
              variant={"link"}
              size={"sm"}
              className={"ellipsis"}
              onClick={() => setEditingTemplate(data)}
            >
              {data.MessageSubject || ""}
            </Button>
            <div className={"ellipsis"}>
              <i>
                <small>
                  {UtilsService.stripHTMLTags(data.MessageBody || "")}
                </small>
              </i>
            </div>
          </td>
        );
      }
    },
    {
      key: "isPrivate",
      header: "is Private",
      cell: (col: iTableColumn, data: iSynCommunicationTemplate) =>
        `${data.PrivateFlag === true ? "Y" : ""}`
    },
    {
      key: "owner",
      header: "Owner",
      cell: (col: iTableColumn, data: iSynCommunicationTemplate) =>
        `${data.Owner}`
    },
    {
      key: "created",
      header: "Created",
      cell: (col: iTableColumn, data: iSynCommunicationTemplate) => {
        return (
          <td key={col.key}>
            <small>
              <div>
                <b>By:</b> {data.CreatedBy}
              </div>
              <div>
                <b>At:</b>{" "}
                {`${data.CreatedDate || ""}`.trim() === ""
                  ? ""
                  : moment(`${data.CreatedDate || ""}`.trim()).format(
                      "DD MMM YYYY"
                    )}
              </div>
            </small>
          </td>
        );
      }
    },
    {
      key: "updated",
      header: "Updated",
      cell: (col: iTableColumn, data: iSynCommunicationTemplate) => {
        return (
          <td key={col.key}>
            <small>
              <div>
                <b>By:</b> {data.ModifiedBy}
              </div>
              <div>
                <b>At:</b>{" "}
                {`${data.ModifiedDate || ""}`.trim() === ""
                  ? ""
                  : moment(`${data.ModifiedDate || ""}`.trim()).format(
                      "DD MMM YYYY"
                    )}
              </div>
            </small>
          </td>
        );
      }
    },
    {
      key: "operations",
      header: (col: iTableColumn) => {
        return (
          <th key={col.key} className={"text-right"}>
            <Button
              variant={"success"}
              size={"sm"}
              onClick={() => setEditingTemplate(undefined)}
            >
              <Icons.Plus /> New
            </Button>
          </th>
        );
      },
      cell: (col: iTableColumn, data: iSynCommunicationTemplate) => {
        return (
          <td key={col.key} className={"text-right"}>
            <Button
              variant={"outline-secondary"}
              size={"sm"}
              className={"ellipsis"}
              onClick={() => setEditingTemplate(data)}
            >
              <Icons.Pencil /> Edit
            </Button>{" "}
            <DeleteConfirmPopupBtn
              variant={"danger"}
              size={"sm"}
              deletingFn={() =>
                SynCommunicationTemplateService.update(
                  data.CommunicationTemplatesSeq,
                  {
                    PrivateFlag: true,
                    ...(`${data.Owner}`.trim() === "zSynergeticCoreAPI"
                      ? {}
                      : { Owner: `MGG\\cda` })
                  }
                )
              }
              deletedCallbackFn={() => {
                Toaster.showToast(
                  `Template Archived Successfully`,
                  TOAST_TYPE_SUCCESS
                );
                setCount(MathHelper.add(count, 1));
              }}
              confirmString={`${data.CommunicationTemplatesSeq}`}
            >
              <Icons.Trash /> Archive
            </DeleteConfirmPopupBtn>
          </td>
        );
      }
    }
  ];

  if (isLoading === true && currentPage <= 1) {
    return <PageLoadingSpinner />;
  }

  if (editingTemplate !== null) {
    return (
      <SynergeticEmailTemplateEditPanel
        template={editingTemplate}
        onSaved={() => {
          setCount(MathHelper.add(count, 1));
          setEditingTemplate(null);
        }}
        onCancel={() => setEditingTemplate(null)}
        showEditBtnsOnTop={true}
      />
    );
  }

  return (
    <Wrapper>
      <ExplanationPanel
        text={
          <>
            This is just a tool to edit Synergetic EMail Templates,{" "}
            <b>THIS IS NOT AN EMAIL SENDING TOOL.</b>
          </>
        }
      />
      <FlexContainer className={"with-gap lg-gap"}>
        <h5>{templateList?.total || 0} Template(s)</h5>
        <div>
          <LoadingBtn
            variant={"link"}
            size={"sm"}
            isLoading={isLoading}
            onClick={() => {
              setCurrentPage(1);
              setCount(MathHelper.add(count, 1));
            }}
          >
            <Icons.BootstrapReboot /> Refresh
          </LoadingBtn>
        </div>
      </FlexContainer>
      <Table
        responsive
        hover
        striped
        className={"templates-table"}
        columns={getColumns()}
        rows={templateList?.data || []}
        isLoading={isLoading === true && currentPage > 1}
        pagination={{
          totalPages: templateList?.pages || 1,
          currentPage: templateList?.currentPage || 1,
          onSetCurrentPage: (page: number) => setCurrentPage(page)
        }}
      />
    </Wrapper>
  );
};

export default SynergeticEmailTemplateList;
