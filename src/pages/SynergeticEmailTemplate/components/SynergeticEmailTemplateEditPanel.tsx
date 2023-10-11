import React, { useEffect, useState } from "react";
import {Col, FormControl, Row} from "react-bootstrap";
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
  const [isSaving, setIsSaving] = useState(false);
  const [templateEditor, setTemplateEditor] = useState<any | null>(null);

  useEffect(() => {
    setEditingTemplate(template || {});
  }, [template]);

  const updateTemplate = (fieldName: string, newValue: any) => {
    setEditingTemplate({
      ...editingTemplate,
      [fieldName]: newValue
    });
  };

  const submit = () => {
    if (`${editingTemplate?.Name || ""}`.trim() === "") {
      Toaster.showToast(`Template Name can NOT be empty.`, TOAST_TYPE_ERROR);
      return;
    }
    const body = `${templateEditor?.getContent() || ''}`.trim() === '' ? `${editingTemplate?.MessageBody || ""}`.trim() : `${templateEditor?.getContent() || ''}`.trim();
    if (body === "") {
      Toaster.showToast(`Template can NOT be empty.`, TOAST_TYPE_ERROR);
      return;
    }
    setIsSaving(true);
    const func =
      `${editingTemplate.CommunicationTemplatesSeq || ""}`.trim() === ""
        ? SynCommunicationTemplateService.create({...editingTemplate, MessageBody: body})
        : SynCommunicationTemplateService.update(
            editingTemplate.CommunicationTemplatesSeq,
          {...editingTemplate, MessageBody: body}
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

  const getSavingBtns = () => {
    return (
      <div>
        <LoadingBtn
          isLoading={isSaving}
          variant={"link"}
          onClick={() => onCancel()} >
          <Icons.X /> Cancel
        </LoadingBtn>
        <LoadingBtn
          isLoading={isSaving}
          variant={"primary"}
          onClick={() => submit()} >
          <Icons.Send /> Save
        </LoadingBtn>
      </div>
    )
  }

  const getTopBtns = () => {
    if (showEditBtnsOnTop !== true) {
      return null;
    }
    return getSavingBtns();
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
          <FormLabel label={"Body"} />
          <RichTextEditor
            height={2200}
            imagesUploadFn={(blobInfo) => {
              const formData = new FormData();
              formData.append('file', blobInfo.blob(), blobInfo.filename());
              return SynCommunicationTemplateService.upload(formData)
            }}
            value={editingTemplate?.MessageBody || ""}
            onEditorChange={(content: string, editor: any) => {
              setTemplateEditor(editor);
            }}
          />
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
