import React, { useState } from "react";
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
  const [notificationCC, setNotificationCC] = useState(
    module.settings?.notification?.cc || ""
  );
  const [notificationReplyTo, setNotificationReplyTo] = useState(
    module.settings?.notification?.replyTo || ""
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

  const handleUpdate = (emailBody?: any) => {
    onUpdate({
      ...(module?.settings || {}),
      contactReasons: (contactReasons || []).map(reason  => `${reason}`.trim()).filter(reason => reason !== ''),
      notification: {
        ...(module?.settings?.notification || {}),
        cc: notificationCC,
        replyTo: notificationReplyTo,
        subject: notificationSubject,
        bodyDesign: emailBody?.design || notificationEmailBodyDesign,
        html: emailBody?.html || notificationEmailBodyHTML,
      }
    });
  };

  return (
    <Wrapper>
      <SectionDiv>
        <h6>{(contactReasons || []).length} Contact Reason(s) <small className={"text-muted"}>
          <i>
            - Reasons for the student to select from. One reason per line.
          </i>
        </small></h6>
        <FormControl
          as={"textarea"}
          rows={4}
          onChange={e => {
            setContactReasons(`${e.target.value}`.split('\n'));
          }}
          value={(contactReasons || []).join('\n')}
        />
      </SectionDiv>
      <SectionDiv>
        <h6>
          Reply To{" "}
          <small className={"text-muted"}>
            <i>
              {" "}
              - ONLY one email allowed, The 'Reply To' email address. This is
              what the user will see after she/he click on reply upon receiving
              the email.
            </i>
          </small>
        </h6>
        <Form.Control
          placeholder={`The 'Reply To' email address`}
          value={notificationReplyTo}
          onChange={event => {
            setNotificationReplyTo(event.target.value);
          }}
          onBlur={() => handleUpdate()}
        />
      </SectionDiv>

      <SectionDiv>
        <h6>
          Copy to{" "}
          <small className={"text-muted"}>
            <i>
              {" "}
              - All provided emails will receive a copy after submission (email
              addresses separated by <b>,</b>):
            </i>
          </small>
        </h6>
        <Form.Control
          placeholder="Email address separated by ,"
          value={notificationCC}
          onChange={event => {
            setNotificationCC(event.target.value);
          }}
          onBlur={() => handleUpdate()}
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
        <Form.Label>Subject</Form.Label>
        <Form.Control
          placeholder="The Subject of the email"
          value={notificationSubject}
          onChange={event => {
            setNotificationSubject(event.target.value);
          }}
          onBlur={() => handleUpdate()}
        />

        <SectionDiv>
          <EmailTemplateBuilder
            designData={notificationEmailBodyDesign}
            editorRef={() => null}
            onUpdated={editor => {
              editor.exportHtml(data => {
                const { design, html } = data;
                const newEmailBody = { design, html };
                setNotificationEmailBodyDesign(design);
                setNotificationEmailBodyHTML(html);
                handleUpdate(newEmailBody);
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

  const getContent = (module: iModule) => {
    return (
      <EditPanel
        module={module}
        onUpdate={(newSettings: any) => setSettings(newSettings)}
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
