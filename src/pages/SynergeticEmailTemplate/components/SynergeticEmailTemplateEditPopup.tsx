import React from "react";
import iSynCommunicationTemplate from "../../../types/Synergetic/iSynCommunicationTemplate";
import styled from "styled-components";
import SynergeticEmailTemplateEditPanel from './SynergeticEmailTemplateEditPanel';
import PopupPanel from '../../../components/common/PopupPanel';

type iSynergeticEmailTemplateEditPopup = {
  className?: string;
  template?: iSynCommunicationTemplate;
  onSaved: (newTemplate: iSynCommunicationTemplate) => void;
  onClose: () => void;
};

const Wrapper = styled.div`
  .tox.tox-tinymce {
    min-height: calc(100vh - 15rem) !important;
  }

  .form-row {
    margin-bottom: 1rem;
  }
`;
const SynergeticEmailTemplateEditPopup = ({
  template,
  onSaved,
  onClose,
  className,
}: iSynergeticEmailTemplateEditPopup) => {
  const getShowPopupDiv = () => {
    return (
      <PopupPanel className={className}>
        <SynergeticEmailTemplateEditPanel template={template} onSaved={onSaved} onCancel={() => onClose()} showEditBtnsOnTop={true}/>
      </PopupPanel>
    )
  }

  return (
    <Wrapper>
      {getShowPopupDiv()}
    </Wrapper>
  );
};

export default SynergeticEmailTemplateEditPopup;
