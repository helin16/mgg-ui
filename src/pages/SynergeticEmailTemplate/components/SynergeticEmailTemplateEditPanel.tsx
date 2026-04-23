import React, { useEffect, useState } from "react";
import { Button, Col, FormControl, Row } from "react-bootstrap";
import iSynCommunicationTemplate from "../../../types/Synergetic/iSynCommunicationTemplate";
import LoadingBtn from "../../../components/common/LoadingBtn";
import * as Icons from "react-bootstrap-icons";
import RichTextEditor from "../../../components/common/RichTextEditor/RichTextEditor";
import Toaster, {
  TOAST_TYPE_ERROR,
  TOAST_TYPE_SUCCESS
} from "../../../services/Toaster";
import SynCommunicationTemplateService from "../../../services/Synergetic/SynCommunicationTemplateService";
import { FlexContainer } from "../../../styles";
import FormLabel from "../../../components/form/FormLabel";
import PageLoadingSpinner from "../../../components/common/PageLoadingSpinner";
import EmailTemplateService from "../../../services/Email/EmailTemplateService";
import EmailTemplateBuilder from "../../../components/Email/EmailTemplateBuilder";
import ExplanationPanel from "../../../components/ExplanationPanel";

type iSynergeticEmailTemplateEditPanel = {
  template?: iSynCommunicationTemplate;
  showEditBtnsOnTop?: boolean;
  onSaved: (newTemplate: iSynCommunicationTemplate) => void;
  onCancel: () => void;
};

const SynergeticEmailTemplateEditPanel = ({
  onCancel,
  template,
  onSaved,
  showEditBtnsOnTop = false
}: iSynergeticEmailTemplateEditPanel) => {
  const [editingTemplate, setEditingTemplate] = useState<{
    [key: string]: any;
  }>({});
  const [editingEmailTemplate, setEditingEmailTemplate] = useState<{
    [key: string]: any;
  }>({});
  const [emailEditorRef, setEmailEditorRef] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUsingEmailBuilder, setIsUsingEmailBuilder] = useState(false);
  const [templateEditor, setTemplateEditor] = useState<any | null>(null);

  useEffect(() => {
    let isCanceled = false;
    if (`${template?.CommunicationTemplatesSeq || ""}`.trim() === "") {
      setEditingTemplate({});
      setEditingEmailTemplate({});
      setEmailEditorRef(null);
      setIsUsingEmailBuilder(true);
      return;
    }
    const sequence = Number(
      `${template?.CommunicationTemplatesSeq || ""}`.trim()
    );

    setIsLoading(true);
    Promise.all([
      SynCommunicationTemplateService.getById(sequence),
      EmailTemplateService.getAll({
        where: JSON.stringify({
          CommunicationTemplatesSeq: sequence,
          isActive: true
        })
      })
    ])
      .then(resp => {
        const emailTemplates = resp[1].data || [];
        const emailTemplate =
          emailTemplates.length > 0 ? emailTemplates[0] : {};
        const template = resp[0] || {};
        setEditingEmailTemplate(emailTemplate);
        setEditingTemplate(template);
        setEmailEditorRef(null);
        setIsUsingEmailBuilder(
          !(
            `${
              // @ts-ignore
              emailTemplate?.CommunicationTemplatesSeq || ""
            }`.trim() === "" &&
            `${template.CommunicationTemplatesSeq || ""}`.trim() !== ""
          )
        );
      })
      .catch(err => {
        if (isCanceled) {
          return;
        }
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
  }, [template]);

  const updateTemplate = (fieldName: string, newValue: any) => {
    setEditingTemplate({
      ...editingTemplate,
      [fieldName]: newValue
    });
  };

  const submitNormalTemplate = () => {
    const body =
      `${templateEditor?.getContent() || ""}`.trim() === ""
        ? `${editingTemplate?.MessageBody || ""}`.trim()
        : `${templateEditor?.getContent() || ""}`.trim();
    if (body === "") {
      Toaster.showToast(`Template can NOT be empty.`, TOAST_TYPE_ERROR);
      return;
    }
    setIsSaving(true);
    const func =
      `${editingTemplate.CommunicationTemplatesSeq || ""}`.trim() === ""
        ? SynCommunicationTemplateService.create({
            ...editingTemplate,
            MessageBody: body
          })
        : SynCommunicationTemplateService.update(
            editingTemplate.CommunicationTemplatesSeq,
            { ...editingTemplate, MessageBody: body }
          );
    func
      .then(resp => {
        Toaster.showToast(`Template Saved Successfully`, TOAST_TYPE_SUCCESS);
        onSaved(resp);
      })
      .catch(err => {
        Toaster.showApiError(err);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const submitEmailBuilderTemplate = () => {
    if (!emailEditorRef?.editor) {
      Toaster.showToast(
        "Please wait until Email Builder finish loading.",
        TOAST_TYPE_ERROR
      );
      return;
    }

    emailEditorRef?.editor.exportHtml((data: any) => {
      const { design, html } = data;

      const body = `${html || ""}`.trim();
      if (body === "") {
        Toaster.showToast(`Template can NOT be empty.`, TOAST_TYPE_ERROR);
        return;
      }

      setIsSaving(true);
      const func =
        `${editingTemplate.CommunicationTemplatesSeq || ""}`.trim() === ""
          ? SynCommunicationTemplateService.create({
              ...editingTemplate,
              MessageBody: body
            }).then(resp => {
              return EmailTemplateService.create({
                CommunicationTemplatesSeq: resp.CommunicationTemplatesSeq,
                templateObj: design
              }).then(() => {
                return resp;
              });
            })
          : Promise.all([
              SynCommunicationTemplateService.update(
                editingTemplate.CommunicationTemplatesSeq,
                { ...editingTemplate, MessageBody: body }
              ),
              EmailTemplateService.update(editingEmailTemplate.id, {
                templateObj: design
              })
            ]);
      func
        .then(resp => {
          Toaster.showToast(`Template Saved Successfully`, TOAST_TYPE_SUCCESS);
          onSaved(Array.isArray(resp) ? resp[0] : resp);
        })
        .catch(err => {
          Toaster.showApiError(err);
        })
        .finally(() => {
          setIsSaving(false);
        });
    });
  };

  const submit = () => {
    if (`${editingTemplate?.Name || ""}`.trim() === "") {
      Toaster.showToast(`Template Name can NOT be empty.`, TOAST_TYPE_ERROR);
      return;
    }

    if (isUsingEmailBuilder !== true) {
      return submitNormalTemplate();
    }

    return submitEmailBuilderTemplate();
  };

  const getSavingBtns = () => {
    return (
      <div>
        <LoadingBtn
          isLoading={isSaving}
          variant={"link"}
          onClick={() => onCancel()}
        >
          <Icons.X /> Cancel
        </LoadingBtn>
        <LoadingBtn
          isLoading={isSaving}
          variant={"primary"}
          onClick={() => submit()}
        >
          <Icons.Send /> Save
        </LoadingBtn>
      </div>
    );
  };

  const getTopBtns = () => {
    if (showEditBtnsOnTop !== true) {
      return null;
    }
    return getSavingBtns();
  };

  const getEditor = () => {
    if (isUsingEmailBuilder !== true) {
      return (
        <>
          {`${editingEmailTemplate?.CommunicationTemplatesSeq || ""}`.trim() ===
          "" ? null : (
            <ExplanationPanel
              variant={"warning"}
              text={
                "BE AWARE: the content you will be overwritten by the Email Builder again on the next save"
              }
            />
          )}
          <RichTextEditor
            height={2200}
            imagesUploadFn={blobInfo => {
              const formData = new FormData();
              formData.append("file", blobInfo.blob(), blobInfo.filename());
              return SynCommunicationTemplateService.upload(formData);
            }}
            value={editingTemplate?.MessageBody || ""}
            onEditorChange={(content: string, editor: any) => {
              setTemplateEditor(editor);
            }}
          />
        </>
      );
    }

    return (
      <EmailTemplateBuilder
        designData={editingEmailTemplate?.templateObj || {}}
        editorRef={editor => {
          setEmailEditorRef(editor);
        }}
      />
    );
  };

  if (isLoading === true) {
    return <PageLoadingSpinner />;
  }

  return (
    <>
      <FlexContainer className={"justify-content-between"}>
        <h6 style={{ margin: 0 }}>
          {`${template?.CommunicationTemplatesSeq || ""}`.trim() === ""
            ? "Creating..."
            : `Editing ${template?.Name || ""} ...`}
        </h6>
        {getTopBtns()}
      </FlexContainer>

      <Row>
        <Col className={"form-row"}>
          <FormLabel label={"Name"} isRequired />
          <FormControl
            value={editingTemplate?.Name || ""}
            placeholder={"The Name of the template"}
            onChange={event => updateTemplate("Name", event.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col className={"form-row"}>
          <FormLabel label={"Description"} />
          <FormControl
            value={editingTemplate?.Description || ""}
            placeholder={"The Description of the template"}
            onChange={event =>
              updateTemplate("Description", event.target.value)
            }
          />
        </Col>
        <Col className={"form-row"}>
          <FormLabel label={"Subject"} />
          <FormControl
            value={editingTemplate?.MessageSubject || ""}
            placeholder={"The Subject of the email"}
            onChange={event =>
              updateTemplate("MessageSubject", event.target.value)
            }
          />
        </Col>
      </Row>
      <Row>
        <Col className={"form-row"}>
          <FlexContainer
            className={"gap-2 space-above space-below align-items-center"}
          >
            <FormLabel label={"Body"} />
            {`${editingEmailTemplate?.CommunicationTemplatesSeq ||
              ""}`.trim() === "" ? null : (
              <Button
                variant={"link"}
                size={"sm"}
                className={"p-0"}
                onClick={() => setIsUsingEmailBuilder(!isUsingEmailBuilder)}
              >
                {isUsingEmailBuilder === true ? (
                  <Icons.CheckSquareFill className={"text-success"} />
                ) : (
                  <Icons.Square />
                )}{" "}
                use email builder
              </Button>
            )}
          </FlexContainer>
          {getEditor()}
        </Col>
      </Row>

      <FlexContainer className={"form-row justify-content-between saving-btns"}>
        <div />
        {getSavingBtns()}
      </FlexContainer>
    </>
  );
};

export default SynergeticEmailTemplateEditPanel;
