import React, { useEffect, useState } from "react";
import { Button, ButtonProps } from "react-bootstrap";
import iSynCommunicationTemplate from "../../../types/Synergetic/iSynCommunicationTemplate";
import PopupModal from "../../../components/common/PopupModal";
import LoadingBtn from "../../../components/common/LoadingBtn";
import * as Icons from "react-bootstrap-icons";
import RichTextEditor from "../../../components/common/RichTextEditor/RichTextEditor";
import styled from "styled-components";
import Toaster, {TOAST_TYPE_ERROR, TOAST_TYPE_SUCCESS} from "../../../services/Toaster";
import SynCommunicationTemplateService from "../../../services/Synergetic/SynCommunicationTemplateService";

type iSynergeticEmailTemplateEditPopupBtn = ButtonProps & {
  template: iSynCommunicationTemplate;
  onSaved: (newTemplate: iSynCommunicationTemplate) => void;
};

const Wrapper = styled.div`
  .tox.tox-tinymce {
    min-height: calc(100vh - 15rem) !important;
  }
`;
const SynergeticEmailTemplateEditPopupBtn = ({
  template,
  onSaved,
  ...props
}: iSynergeticEmailTemplateEditPopupBtn) => {
  const [isShowingPopup, setIsShowingPopup] = useState(false);
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setContent(`${template?.MessageBody || ""}`.trim());
  }, [template]);

  const submit = () => {
    if (`${content}`.trim() === "") {
      Toaster.showToast(`Template can NOT be empty.`, TOAST_TYPE_ERROR);
      return;
    }
    setIsSaving(true);
    SynCommunicationTemplateService.update(template.CommunicationTemplatesSeq, {
        MessageBody: content
      })
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
  }

  return (
    <>
      <Button {...props} onClick={() => setIsShowingPopup(true)}>
        {props.children}
      </Button>
      <PopupModal
        show={isShowingPopup}
        title={
          <h6>
            {`${template?.CommunicationTemplatesSeq || ""}`.trim() === ""
              ? "Creating..."
              : "Editing..."}
          </h6>
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
        <Wrapper>
          <RichTextEditor value={content} onChange={text => setContent(text)} />
        </Wrapper>
      </PopupModal>
    </>
  );
};

export default SynergeticEmailTemplateEditPopupBtn;
