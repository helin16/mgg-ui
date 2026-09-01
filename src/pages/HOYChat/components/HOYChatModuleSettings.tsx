import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import {
  MGGS_MODULE_ID_HOY_CHAT_EMAIL
} from "../../../types/modules/iModuleUser";
import { ROLE_ID_ADMIN } from "../../../types/modules/iRole";
import ModuleEditPanel from "../../../components/module/ModuleEditPanel";
import iModule from "../../../types/modules/iModule";
import SectionDiv from "../../../components/common/SectionDiv";
import { Badge, Form, FormControl } from "react-bootstrap";
import ExplanationPanel from "../../../components/ExplanationPanel";
import EmailTemplateBuilder from '../../../components/Email/EmailTemplateBuilder';

const Wrapper = styled.div``;

type iEditPanel = {
  module: iModule;
  onUpdate: (data: any) => void;
};
const EditPanel = ({ module, onUpdate }: iEditPanel) => {
  const [contactReasons, setContactReasons] = useState<string[]>(
    module.settings?.contactReasons || []
  );
  const [notificationSubject, setNotificationSubject] = useState(
    module.settings?.notification?.subject || ""
  );
  const [notificationEmailBodyDesign, setNotificationEmailBodyDesign] = useState(
    module.settings?.notification?.bodyDesign || {}
  );
  const [notificationEmailBodyHTML, setNotificationEmailBodyHTML] = useState(
    module.settings?.notification?.html || ''
  );

  useEffect(() => {
    setContactReasons(module.settings?.contactReasons || []);
    setNotificationSubject(module.settings?.notification?.subject || "");
    setNotificationEmailBodyDesign(module.settings?.notification?.bodyDesign || {});
    setNotificationEmailBodyHTML(module.settings?.notification?.html || "");
  }, [module]);

  useEffect(() => {
    const notification = {...(module?.settings?.notification || {})};
    delete notification.replyTo;
    delete notification.cc;
    onUpdate({
      ...(module?.settings || {}),
      contactReasons: (contactReasons || []).map(reason  => `${reason}`.trim()).filter(reason => reason !== ''),
      notification: {
        ...notification,
        subject: notificationSubject,
        bodyDesign: notificationEmailBodyDesign,
        html: notificationEmailBodyHTML,
      }
    });
  }, [contactReasons, module, notificationEmailBodyDesign,
    notificationEmailBodyHTML, notificationSubject, onUpdate]);

  return (
    <Wrapper>
      <SectionDiv>
        <Form.Label htmlFor="hoy-contact-reasons"><b>{(contactReasons || []).length} Contact Reason(s)</b> <small className={"text-muted"}>
          <i>
            - Reasons for the student to select from. One reason per line.
          </i>
        </small></Form.Label>
        <FormControl
          id="hoy-contact-reasons"
          as={"textarea"}
          rows={4}
          onChange={e => {
            setContactReasons(`${e.target.value}`.split('\n'));
          }}
          value={(contactReasons || []).join('\n')}
        />
      </SectionDiv>
      <SectionDiv>
        <ExplanationPanel
          text={<>The student is automatically copied on every HOY Chat email. The student's email is also the sole Reply-To address.</>}
        />
      </SectionDiv>

      <SectionDiv>
        <h5>
          Notification Email Content{" "}
          <small className={"text-muted"}>
            <i> - settings for the email content</i>
          </small>
        </h5>
        <ExplanationPanel
          text={
            <>
              You can use the following place holder for dynamic fields:
              <ul>
                <li>
                  <Badge bg={"secondary"}>{"{{STUDENT_FULL_NAME}}"}</Badge>: the
                  full name of the student.
                </li>
                <li>
                  <Badge bg={"secondary"}>{"{{CONTACT_REASON}}"}</Badge>: the
                  contact reason.
                </li>
                <li>
                  <Badge bg={"secondary"}>{"{{YEAR_LEVEL}}"}</Badge>: the year
                  level of the student.
                </li>
                <li>
                  <Badge bg={"secondary"}>{"{{YEAR_LEVEL_COORDINATOR}}"}</Badge>
                  : the year level coordinator.
                </li>
                <li>
                  <Badge bg={"secondary"}>{"{{COMMENTS}}"}</Badge>: the content
                  submitted by the student.
                </li>
                <li>
                  <Badge bg={"secondary"}>{"{{ATTACHMENT_NAMES}}"}</Badge>: the
                  name of the attachments, if any.{" "}
                  <b>The actual file(s) will be emailed as attachment(s)</b>
                </li>
              </ul>
            </>
          }
        />
        <Form.Label htmlFor="hoy-notification-subject">Subject</Form.Label>
        <Form.Control
          id="hoy-notification-subject"
          placeholder="The Subject of the email"
          value={notificationSubject}
          onChange={event => {
            setNotificationSubject(event.target.value);
          }}
        />

        <SectionDiv>
          <EmailTemplateBuilder
            designData={notificationEmailBodyDesign}
            editorRef={() => null}
            onUpdated={editor => {
              editor.exportHtml(data => {
                const { design, html } = data;
                setNotificationEmailBodyDesign(design);
                setNotificationEmailBodyHTML(html);
              });
            }}
          />
        </SectionDiv>
      </SectionDiv>
    </Wrapper>
  );
};
const HOYChatModuleSettings = () => {
  const [settings, setSettings] = useState({});
  const handleSettingsUpdate = useCallback((newSettings: any) => {
    setSettings(newSettings);
  }, []);

  const getContent = (module: iModule) => {
    return (
      <EditPanel
        module={module}
        onUpdate={handleSettingsUpdate}
      />
    );
  };

  return (
    <ModuleEditPanel
      moduleId={MGGS_MODULE_ID_HOY_CHAT_EMAIL}
      roleId={ROLE_ID_ADMIN}
      getChildren={getContent}
      getSubmitData={() => settings}
    />
  );
};

export default HOYChatModuleSettings;
