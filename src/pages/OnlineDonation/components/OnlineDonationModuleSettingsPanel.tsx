import React, { useState } from "react";
import iModule from "../../../types/modules/iModule";
import ModuleEditPanel from "../../../components/module/ModuleEditPanel";
import { MGGS_MODULE_ID_ONLINE_DONATION } from "../../../types/modules/iModuleUser";
import { ROLE_ID_ADMIN } from "../../../types/modules/iRole";
import SectionDiv from "../../../components/common/SectionDiv";
import ModuleEmailTemplateNameEditor from "../../../components/module/ModuleEmailTemplateNameEditor";
import { Tab, Tabs, FormControl, Badge } from "react-bootstrap";
import styled from "styled-components";
import RichTextEditor from "../../../components/common/RichTextEditor/RichTextEditor";
import { FlexContainer } from "../../../styles";
import FormLabel from "../../../components/form/FormLabel";
import EmailTemplateBuilder from "../../../components/Email/EmailTemplateBuilder";
import DonorReceiptPDFPreview from "./DonorReceiptPDFPreview";
import Accordion from "react-bootstrap/Accordion";
import ExplanationPanel from "../../../components/ExplanationPanel";

const Wrapper = styled.div`
  margin-top: 1rem;
  .pdf-preview-wrapper {
    padding: 1.6rem !important;
    background-color: rgba(0, 0, 0, 0.4) !important;
    height: 100%;
  }
`;
type iEditPanel = {
  module: iModule;
  onUpdate: (data: any) => void;
};

const TAB_ONLINE_DONATIONS = "ONLINE_DONATIONS";
const TAB_DONATION_RECEIPTS = "DONATION_RECEIPTS";
const EditPanel = ({ module, onUpdate }: iEditPanel) => {
  const [selectedTab, setSelectedTab] = useState(TAB_ONLINE_DONATIONS);
  const [successMsgEditor, setSuccessMsgEditor] = useState<any | null>(null);
  const [
    donationReceiptsHeaderEditor,
    setDonationReceiptsHeaderEditor
  ] = useState<any | null>(null);
  const [
    donationReceiptsFooterEditor,
    setDonationReceiptsFooterEditor
  ] = useState<any | null>(null);
  const [
    notificationEmailTemplateName,
    setNotificationEmailTemplateName
  ] = useState(module.settings?.notification?.templateName || "");
  const [notificationRecipients, setNotificationRecipients] = useState(
    module.settings?.notification?.recipients || ""
  );
  const [successMsg] = useState(module.settings?.successMsg || "");

  const [donationReceiptsBCCs, setDonationReceiptsBCCs] = useState(
    module.settings?.donationReceipts?.bccs || ""
  );
  const [donationReceiptsHeader, setDonationReceiptsHeader] = useState(
    module.settings?.donationReceipts?.receiptHeader || ""
  );
  const [donationReceiptsFooter, setDonationReceiptsFooter] = useState(
    module.settings?.donationReceipts?.receiptFooter || ""
  );
  const [donationEmailBody, setDonationEmailBody] = useState(
    module.settings?.donationReceipts?.emailBody || {}
  );

  const getEditorContent = (editor: any, defaultValue: string) => {
    return `${editor?.getContent() || ""}`.trim() === ""
      ? defaultValue
      : `${editor?.getContent() || ""}`.trim();
  };

  const handleUpdate = (extraEmailBody = {}) => {
    console.log('emailBody', extraEmailBody);
    console.log('donationEmailBody', donationEmailBody);
    console.log('emailBody', {
      ...donationEmailBody,
      ...extraEmailBody
    });
    onUpdate({
      ...(module?.settings || {}),
      notification: {
        ...(module?.settings?.notification || {}),
        templateName: notificationEmailTemplateName,
        recipients: notificationRecipients
      },
      successMsg: getEditorContent(successMsgEditor, successMsg),
      donationReceipts: {
        ...(module?.settings?.donationReceipts || {}),
        bccs: donationReceiptsBCCs,
        receiptHeader: getEditorContent(
          donationReceiptsHeaderEditor,
          donationReceiptsHeader
        ),
        receiptFooter: getEditorContent(
          donationReceiptsFooterEditor,
          donationReceiptsFooter
        ),
        emailBody: {
          ...donationEmailBody,
          ...extraEmailBody
        }
      }
    });
  };

  return (
    <Wrapper>
      <Tabs
        variant={"pills"}
        activeKey={selectedTab}
        className="mb-3"
        onSelect={k => setSelectedTab(k || TAB_ONLINE_DONATIONS)}
      >
        <Tab
          eventKey={TAB_ONLINE_DONATIONS}
          title={"Online Donations Settings"}
        >
          <SectionDiv>
            <h5>
              Email Notifications -{" "}
              <small className={"text-muted"}>
                when a donation has been submitted
              </small>
            </h5>
            <SectionDiv>
              <h6>Email template </h6>
              <ModuleEmailTemplateNameEditor
                value={notificationEmailTemplateName}
                className={"content-row"}
                onChange={event =>
                  setNotificationEmailTemplateName(event.target.value)
                }
                handleUpdate={() => handleUpdate()}
              />
            </SectionDiv>

            <SectionDiv>
              <h6>Email Recipients</h6>
              <FormLabel
                label={
                  <>
                    Recipients who will receive the notification after a
                    donation has been submitted (email addresses separated by{" "}
                    <b>,</b>):
                  </>
                }
              ></FormLabel>
              <FormControl
                placeholder="Email address separated by ,"
                value={notificationRecipients}
                onChange={event => {
                  setNotificationRecipients(event.target.value);
                }}
                onBlur={() => handleUpdate()}
              />
            </SectionDiv>
          </SectionDiv>

          <SectionDiv className={"margin-bottom"}>
            <h5>
              Success Message -{" "}
              <small className={"text-muted"}>
                Displaying message when a donation has been submitted
              </small>
            </h5>
            <RichTextEditor
              value={successMsg}
              onEditorChange={(content, editor) => {
                setSuccessMsgEditor(editor);
              }}
              onChange={() => {
                handleUpdate();
              }}
            />
          </SectionDiv>
        </Tab>

        <Tab
          eventKey={TAB_DONATION_RECEIPTS}
          title={`Donation Receipts Settings`}
        >
          <SectionDiv className={"margin-bottom"}>
            <Accordion defaultActiveKey={"emails"} flush>
              <Accordion.Item eventKey="emails">
                <Accordion.Header>
                  Email Receipt Settings{" "}
                  <small className={"text-muted"}>
                    - the email content and BCC's
                  </small>
                </Accordion.Header>
                <Accordion.Body>
                  <div>
                    <FormLabel
                      label={
                        <>
                          Email Receipt BCC's{" "}
                          <small className={"text-muted"}>
                            - when a donation receipt gets sent out, the
                            following email addresses will be Bcc'd
                          </small>
                        </>
                      }
                    />
                    <FormControl
                      placeholder="Email address separated by ,"
                      value={donationReceiptsBCCs}
                      onChange={event => {
                        setDonationReceiptsBCCs(event.target.value);
                      }}
                      onBlur={() => handleUpdate()}
                    />
                    <small>Email address separated by ,</small>
                  </div>

                  <SectionDiv>
                    <FormLabel label={"Email Body"} />
                    <EmailTemplateBuilder
                      designData={donationEmailBody?.design || {}}
                      editorRef={() => null}
                      onUpdated={editor => {
                        editor.exportHtml(data => {
                          const { design, html } = data;
                          const newEmailBody = { design, html };
                          setDonationEmailBody(newEmailBody)
                          handleUpdate(newEmailBody);
                        });
                      }}
                    />
                  </SectionDiv>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="pdfTemplates">
                <Accordion.Header>
                  PDF Templates{" "}
                  <small className={"text-muted"}>
                    - how the pdf will be generated
                  </small>
                </Accordion.Header>
                <Accordion.Body>
                  <ExplanationPanel
                    text={
                      <>
                        You can use{" "}
                        <Badge bg={"secondary"}>
                          {"{{DONATION_RECEIPT_FUND_NAME}}"}
                        </Badge>{" "}
                        to dynamic fund name
                      </>
                    }
                  />
                  <FlexContainer className={"justify-content-between gap-3"}>
                    <div style={{ width: "40%" }}>
                      <FormLabel label={"PDF Header"} />
                      <RichTextEditor
                        settings={{
                          menubar: false
                        }}
                        height={330}
                        value={donationReceiptsHeader}
                        onEditorChange={(content, editor) => {
                          setDonationReceiptsHeaderEditor(editor);
                        }}
                        onChange={() => {
                          const headerString = getEditorContent(
                            donationReceiptsHeaderEditor,
                            donationReceiptsHeader
                          );
                          setDonationReceiptsHeader(headerString);
                          handleUpdate();
                        }}
                      />

                      <FormLabel label={"PDF Footer:"} />
                      <RichTextEditor
                        settings={{
                          menubar: false
                        }}
                        height={330}
                        value={donationReceiptsFooter}
                        onEditorChange={(content, editor) => {
                          setDonationReceiptsFooterEditor(editor);
                        }}
                        onChange={() => {
                          const footerString = getEditorContent(
                            donationReceiptsFooterEditor,
                            donationReceiptsFooter
                          );
                          setDonationReceiptsFooter(footerString);
                          handleUpdate();
                        }}
                      />
                    </div>
                    <div style={{ width: "60%" }}>
                      <FormLabel label={"PDF Preview"} />
                      <div className={"pdf-preview-wrapper"}>
                        <DonorReceiptPDFPreview
                          footer={donationReceiptsFooter}
                          header={donationReceiptsHeader}
                        />
                      </div>
                    </div>
                  </FlexContainer>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </SectionDiv>
        </Tab>
      </Tabs>
    </Wrapper>
  );
};

const OnlineDonationModuleSettingsPanel = () => {
  const [settings, setSettings] = useState({});

  const getContent = (module: iModule) => {
    return (
      <EditPanel
        module={module}
        onUpdate={(newSettings: any) => {
          setSettings(newSettings);
        }}
      />
    );
  };

  return (
    <ModuleEditPanel
      moduleId={MGGS_MODULE_ID_ONLINE_DONATION}
      roleId={ROLE_ID_ADMIN}
      getChildren={getContent}
      getSubmitData={() => settings}
    />
  );
};

export default OnlineDonationModuleSettingsPanel;
