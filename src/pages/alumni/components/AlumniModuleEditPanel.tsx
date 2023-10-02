import React, { useState } from "react";
import styled from "styled-components";
import { MGGS_MODULE_ID_ALUMNI_REQUEST } from "../../../types/modules/iModuleUser";
import ModuleEditPanel from "../../../components/module/ModuleEditPanel";
import { ROLE_ID_ADMIN } from "../../../types/modules/iRole";
import iModule from "../../../types/modules/iModule";
import ModuleEmailTemplateNameEditor from "../../../components/module/ModuleEmailTemplateNameEditor";
import ExplanationPanel from "../../../components/ExplanationPanel";
import SectionDiv from "../../../components/common/SectionDiv";
import { FormControl } from "react-bootstrap";

type iAlumniModuleEditPanelContent = {
  module: iModule;
  onUpdate: (data: any) => void;
};

const Wrapper = styled.div``;
const AlumniModuleEditPanelContent = ({
  module,
  onUpdate
}: iAlumniModuleEditPanelContent) => {
  const [emailTemplateName, setEmailTemplateName] = useState(
    module?.settings?.emailTemplateName?.notifyApprovers || ""
  );
  const [approvedEmailTemplateName, setApprovedEmailTemplateName] = useState(
    module?.settings?.emailTemplateName?.approvedNotice || ""
  );
  const [serviceEmails, setServiceEmails] = useState(
    module?.settings?.approvedNoticeReceiver || ""
  );

  const handleUpdate = () => {
    onUpdate({
      ...(module?.settings || {}),
      approvedNoticeReceiver: `${serviceEmails || ""}`
        .trim()
        .split(",")
        .map(email => `${email}`.trim())
        .filter(email => email !== "")
        .join(","),
      emailTemplateName: {
        ...(module?.settings?.emailTemplateName || {}),
        notifyApprovers: emailTemplateName,
        approvedNotice: approvedEmailTemplateName
      }
    });
  };

  return (
    <Wrapper>
      <SectionDiv>
        <h6>Submitted Email</h6>
        <ExplanationPanel
          text={
            "The email template that used to sent notification when a request is submitted."
          }
        />
        <ModuleEmailTemplateNameEditor
          value={emailTemplateName}
          className={"content-row"}
          onChange={event => setEmailTemplateName(event.target.value)}
          handleUpdate={() => handleUpdate()}
        />
      </SectionDiv>
      <SectionDiv>
        <h6>Approving Email</h6>
        <ExplanationPanel
          text={
            "The email template that used to sent notification when a request is approved."
          }
        />
        <ModuleEmailTemplateNameEditor
          value={approvedEmailTemplateName}
          className={"content-row"}
          onChange={event => setApprovedEmailTemplateName(event.target.value)}
          handleUpdate={() => handleUpdate()}
        />
        <ExplanationPanel
          text={
            "Email addresses that will receive those approved emails. Separate emails by , (comma)."
          }
        />
        <FormControl
          value={serviceEmails}
          onChange={event => setServiceEmails(event.target.value)}
          onBlur={() => handleUpdate()}
        />
      </SectionDiv>
    </Wrapper>
  );
};

const AlumniModuleEditPanel = () => {
  const [settings, setSettings] = useState({});

  const getContent = (module: iModule) => {
    return (
      <AlumniModuleEditPanelContent
        module={module}
        onUpdate={(newSettings: any) => setSettings(newSettings)}
      />
    );
  };
  return (
    <ModuleEditPanel
      moduleId={MGGS_MODULE_ID_ALUMNI_REQUEST}
      roleId={ROLE_ID_ADMIN}
      getChildren={getContent}
      getSubmitData={() => settings}
    />
  );
};

export default AlumniModuleEditPanel;
