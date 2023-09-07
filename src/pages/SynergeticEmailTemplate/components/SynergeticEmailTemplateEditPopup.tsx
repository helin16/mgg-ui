import React from "react";
import {Button} from "react-bootstrap";
import iSynCommunicationTemplate from "../../../types/Synergetic/iSynCommunicationTemplate";
import styled from "styled-components";
import SynergeticEmailTemplateEditPanel from './SynergeticEmailTemplateEditPanel';
import PopupPanel from '../../../components/common/PopupPanel';
import {FlexContainer} from '../../../styles';
import * as Icons from 'react-bootstrap-icons';

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
      <PopupPanel className={className} header={
        <FlexContainer className={"justify-content-between"}>
          <h6 style={{ margin: 0 }}>
            {`${template?.CommunicationTemplatesSeq || ""}`.trim() === ""
                ? "Creating..."
                : `Editing ${template?.Name || ""} ...`}
          </h6>
          <Button variant={'link'} onClick={() => onClose()}>
            <Icons.XLg />
          </Button>
        </FlexContainer>
      }>
        <SynergeticEmailTemplateEditPanel template={template} onSaved={onSaved} onCancel={() => onClose()} />
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
