import React, { useEffect, useState } from "react";
import { FormControl } from "react-bootstrap";
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
  onSaved: (newTemplate: iSynCommunicationTemplate) => void;
  onCancel: () => void;
};

const SynergeticEmailTemplateEditPanel = ({
  onCancel,
  template,
  onSaved,
}: iSynergeticEmailTemplateEditPanel) => {
  const [editingTemplate, setEditingTemplate] = useState<{
    [key: string]: any;
  }>({});
  const [isSaving, setIsSaving] = useState(false);

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
    if (`${editingTemplate?.MessageBody || ""}`.trim() === "") {
      Toaster.showToast(`Template can NOT be empty.`, TOAST_TYPE_ERROR);
      return;
    }
    setIsSaving(true);
    const func =
      `${editingTemplate.CommunicationTemplatesSeq || ""}`.trim() === ""
        ? SynCommunicationTemplateService.create(editingTemplate)
        : SynCommunicationTemplateService.update(
            editingTemplate.CommunicationTemplatesSeq,
            editingTemplate
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


  return (
    <>
      <div className={"form-row"}>
        <FormLabel label={"Name"} isRequired />
        <FormControl
          value={editingTemplate?.Name || ""}
          placeholder={"The Name of the template"}
          onChange={event => updateTemplate("Name", event.target.value)}
        />
      </div>
      <div className={"form-row"}>
        <FormLabel label={"Description"} />
        <FormControl
          value={editingTemplate?.Description || ""}
          placeholder={"The Description of the template"}
          onChange={event =>
            updateTemplate("Description", event.target.value)
          }
        />
      </div>
      <div className={"form-row"}>
        <FormLabel label={"Subject"} />
        <FormControl
          value={editingTemplate?.MessageSubject || ""}
          placeholder={"The Subject of the email"}
          onChange={event =>
            updateTemplate("MessageSubject", event.target.value)
          }
        />
      </div>
      <div className={"form-row"}>
        <FormLabel label={"Body"} />
        <RichTextEditor
          value={editingTemplate?.MessageBody || ""}
          onChange={text => updateTemplate("MessageBody", text)}
        />
      </div>

      <FlexContainer className={"form-row justify-content-between"}>
        <div />
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
      </FlexContainer>
    </>
  );
};

export default SynergeticEmailTemplateEditPanel;
