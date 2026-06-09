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
import { Alert, Button, FormCheck, FormControl } from "react-bootstrap";
import SynergeticEmailTemplateEditPanel from "./SynergeticEmailTemplateEditPanel";
import iEmailTemplate from "../../../types/Email/iEmailTemplate";
import EmailTemplateService from "../../../services/Email/EmailTemplateService";
import SynEmailSendPopupBtn from './SynEmailSendPopupBtn';
import PopupModal from "../../../components/common/PopupModal";

const Wrapper = styled.div`
  .templates-table {
    .btn.btn-link {
      padding: 0px;

      &.ellipsis {
        width: 100%;
        text-align: left;
      }
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

type iResult = iSynCommunicationTemplate & { emailTemplate?: iEmailTemplate };

const SynergeticEmailTemplateList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [templateList, setTemplateList] = useState<iPaginatedResult<
    iResult
  > | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingTemplate, setEditingTemplate] = useState<
    iSynCommunicationTemplate | null | undefined
  >(null);
  const [cloningTemplate, setCloningTemplate] = useState<iResult | null>(null);
  const [cloneName, setCloneName] = useState("");
  const [isCloneUsingNewStyle, setIsCloneUsingNewStyle] = useState(false);
  const [showCloneNameError, setShowCloneNameError] = useState(false);
  const [isCloning, setIsCloning] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  const handleOpenCloneModal = (template: iResult) => {
    setCloningTemplate(template);
    setCloneName(`${template.Name || ""}`.trim());
    setIsCloneUsingNewStyle(Boolean(template.emailTemplate));
    setShowCloneNameError(false);
  };

  const handleCloseCloneModal = (forceClose = false) => {
    if (isCloning && !forceClose) {
      return;
    }
    setCloningTemplate(null);
    setCloneName("");
    setIsCloneUsingNewStyle(false);
    setShowCloneNameError(false);
  };

  const getClonedTemplatePayload = (template: iResult, newName: string) => {
    return {
      Name: newName,
      Description: template.Description,
      MessageType: template.MessageType || SYN_COMMUNICATION_TEMPLATE_TYPE_HTML,
      MessageSubject: template.MessageSubject,
      MessageBody: template.MessageBody,
      Owner: template.Owner,
      PrivateFlag: template.PrivateFlag,
      DocumentClassification: template.DocumentClassification,
      SenderEmail: template.SenderEmail,
      ProgramName: template.ProgramName
    };
  };

  const handleCloneTemplate = async () => {
    if (isCloning || !cloningTemplate) {
      return;
    }

    const trimmedName = `${cloneName || ""}`.trim();
    if (trimmedName === "") {
      setShowCloneNameError(true);
      return;
    }

    setIsCloning(true);
    try {
      const clonedTemplate = await SynCommunicationTemplateService.create(
        getClonedTemplatePayload(cloningTemplate, trimmedName)
      );

      if (isCloneUsingNewStyle) {
        await EmailTemplateService.create({
          CommunicationTemplatesSeq: clonedTemplate.CommunicationTemplatesSeq,
          templateObj: cloningTemplate.emailTemplate?.templateObj || null
        });
      }

      Toaster.showToast(`Template Cloned Successfully`, TOAST_TYPE_SUCCESS);
      handleCloseCloneModal(true);
      setCurrentPage(1);
      setCount(currentCount => MathHelper.add(currentCount, 1));
    } catch (err) {
      Toaster.showApiError(err);
    } finally {
      setIsCloning(false);
    }
  };

  useEffect(() => {
    let isCanceled = false;
    const getData = async () => {
      const resp = await SynCommunicationTemplateService.getAll({
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
        sort: "ModifiedDate:DESC",
        currentPage
      });
      const sequences = (resp.data || []).map(
        template => template.CommunicationTemplatesSeq
      );
      if (sequences.length <= 0) {
        setTemplateList(resp);
        setEditingTemplate(null);
        return;
      }

      const templates = await EmailTemplateService.getAll({
        where: JSON.stringify({
          CommunicationTemplatesSeq: sequences,
          isActive: true
        })
      });
      const tMap: { [key: number]: iEmailTemplate } = (
        templates.data || []
      ).reduce((map, template) => {
        return {
          ...map,
          [template.CommunicationTemplatesSeq]: template
        };
      }, {});
      setTemplateList({
        ...resp,
        data: resp.data.map(row => {
          return {
            ...row,
            ...(row.CommunicationTemplatesSeq in tMap
              ? { emailTemplate: tMap[row.CommunicationTemplatesSeq] }
              : {})
          };
        })
      });
      setEditingTemplate(null);
    };

    setIsLoading(true);
    getData()
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

  const getColumns = <T extends {}>() => [
    {
      key: "name",
      header: "Name",
      cell: (col: iTableColumn<T>, data: iResult) => {
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
      cell: (col: iTableColumn<T>, data: iResult) => {
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
      cell: (col: iTableColumn<T>, data: iResult) => {
        return (
          <td key={col.key}>
            {data.PrivateFlag === true ? (
              <Icons.CheckCircleFill className={"text-success"} />
            ) : null}
          </td>
        );
      }
    },
    {
      key: "useNewStyle",
      header: "New Style?",
      cell: (col: iTableColumn<T>, data: iResult) => {
        return (
          <td key={col.key}>
            {`${data.emailTemplate?.CommunicationTemplatesSeq || ""}`.trim() !==
            "" ? (
              <Icons.CheckCircleFill className={"text-success"} />
            ) : null}
          </td>
        );
      }
    },
    {
      key: "owner",
      header: "Owner",
      cell: (col: iTableColumn<T>, data: iResult) => {
        return <td key={col.key}>{data.Owner}</td>;
      }
    },
    {
      key: "created",
      header: "Created",
      cell: (col: iTableColumn<T>, data: iResult) => {
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
      cell: (col: iTableColumn<T>, data: iResult) => {
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
      header: (col: iTableColumn<T>) => {
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
      cell: (col: iTableColumn<T>, data: iResult) => {
        return (
          <td key={col.key} className={"text-right"}>
            <SynEmailSendPopupBtn
              template={data}
              variant={"outline-success"}
              size={"sm"}
              className={"ellipsis"}
              onClick={() => setEditingTemplate(data)}
            >
              <Icons.Send /> Send
            </SynEmailSendPopupBtn>{" "}
            <Button
              variant={"outline-primary"}
              size={"sm"}
              onClick={() => handleOpenCloneModal(data)}
            >
              <Icons.Files /> Clone
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
      <PopupModal
        title={`Clone Template`}
        show={cloningTemplate !== null}
        handleClose={() => handleCloseCloneModal()}
        footer={
          <FlexContainer className={"justify-content-end gap-2 full-width"}>
            <Button
              variant={"link"}
              onClick={() => handleCloseCloneModal()}
              disabled={isCloning}
            >
              <Icons.X /> Cancel
            </Button>
            <LoadingBtn
              variant={"primary"}
              isLoading={isCloning}
              onClick={() => handleCloneTemplate()}
              disabled={isCloning}
            >
              <Icons.Files /> Confirm Clone
            </LoadingBtn>
          </FlexContainer>
        }
      >
        <>
          <div className={"mb-3"}>
            <label className={"form-label"} htmlFor={"clone-template-name"}>
              New template name
            </label>
            <FormControl
              id={"clone-template-name"}
              aria-label={"New template name"}
              value={cloneName}
              onChange={event => {
                setCloneName(event.target.value);
                if (`${event.target.value || ""}`.trim() !== "") {
                  setShowCloneNameError(false);
                }
              }}
              placeholder={"Enter the new template name"}
              disabled={isCloning}
            />
          </div>

          <FormCheck
            id={"clone-template-new-style"}
            label={"New Style"}
            checked={isCloneUsingNewStyle}
            onChange={event => setIsCloneUsingNewStyle(event.target.checked)}
            disabled={isCloning}
          />

          {showCloneNameError ? (
            <Alert variant={"danger"} className={"mt-3 mb-0"}>
              Template Name can NOT be empty.
            </Alert>
          ) : null}
        </>
      </PopupModal>

      <FlexContainer className={"gap-2 align-items-center"}>
        <b>{templateList?.total || 0} Template(s)</b>
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
        columns={getColumns<iResult>()}
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
