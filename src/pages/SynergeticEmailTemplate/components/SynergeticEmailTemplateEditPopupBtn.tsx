import React, { useEffect, useState } from "react";
import { Button, ButtonProps, FormControl } from "react-bootstrap";
import iSynCommunicationTemplate from "../../../types/Synergetic/iSynCommunicationTemplate";
import PopupModal from "../../../components/common/PopupModal";
import LoadingBtn from "../../../components/common/LoadingBtn";
import * as Icons from "react-bootstrap-icons";
import RichTextEditor from "../../../components/common/RichTextEditor/RichTextEditor";
import styled from "styled-components";
import Toaster, {
  TOAST_TYPE_ERROR,
  TOAST_TYPE_SUCCESS
} from "../../../services/Toaster";
import SynCommunicationTemplateService from "../../../services/Synergetic/SynCommunicationTemplateService";
import { FlexContainer } from "../../../styles";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import FormLabel from "../../../components/form/FormLabel";

type iSynergeticEmailTemplateEditPopupBtn = ButtonProps & {
  editingMetaData?: boolean;
  template?: iSynCommunicationTemplate;
  onSaved: (newTemplate: iSynCommunicationTemplate) => void;
};

const Wrapper = styled.div`
  .tox.tox-tinymce {
    min-height: calc(100vh - 15rem) !important;
  }

  .form-row {
    margin-bottom: 1rem;
  }
`;
const SynergeticEmailTemplateEditPopupBtn = ({
  template,
  onSaved,
  editingMetaData = false,
  ...props
}: iSynergeticEmailTemplateEditPopupBtn) => {
  const [isEditingMetaData, setIsEditingMetaData] = useState(editingMetaData);
  const [isShowingPopup, setIsShowingPopup] = useState(false);
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

  const handleClose = () => {
    if (isSaving) {
      return;
    }
    setIsShowingPopup(false);
  };
  console.log("isEditingMetaData", isEditingMetaData);
  const getBodyForm = () => {
    if (isEditingMetaData === true) {
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
        </>
      );
    }

    return (
      <RichTextEditor
        value={editingTemplate?.MessageBody || ""}
        onChange={text => updateTemplate("MessageBody", text)}
      />
    );
  };

  return (
    <>
      <Button {...props} onClick={() => setIsShowingPopup(true)}>
        {props.children}
      </Button>
      <PopupModal
        show={isShowingPopup}
        title={
          <FlexContainer className={"with-gap lg-gap align-items end"}>
            <h6 style={{ margin: 0 }}>
              {`${template?.CommunicationTemplatesSeq || ""}`.trim() === ""
                ? "Creating..."
                : `Editing ${editingTemplate.Name || ""} ...`}
            </h6>
            <ButtonGroup size={"sm"}>
              <Button
                variant={
                  isEditingMetaData === true ? "primary" : "outline-primary"
                }
                onClick={() => setIsEditingMetaData(true)}
              >
                Message
              </Button>
              <Button
                variant={
                  isEditingMetaData !== true ? "secondary" : "outline-secondary"
                }
                onClick={() => setIsEditingMetaData(false)}
              >
                Message Body
              </Button>
            </ButtonGroup>
          </FlexContainer>
        }
        size={"lg"}
        dialogClassName={"modal-90w"}
        handleClose={() => handleClose()}
        footer={
          <>
            <div />
            <div>
              <LoadingBtn
                isLoading={isSaving}
                variant={"link"}
                onClick={() => handleClose()}
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
          </>
        }
      >
        <Wrapper>{getBodyForm()}</Wrapper>
      </PopupModal>
    </>
  );
};

export default SynergeticEmailTemplateEditPopupBtn;
