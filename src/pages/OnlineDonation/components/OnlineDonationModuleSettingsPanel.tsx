import React, { useState } from "react";
import iModule from "../../../types/modules/iModule";
import ModuleEditPanel from "../../../components/module/ModuleEditPanel";
import { MGGS_MODULE_ID_ONLINE_DONATION } from "../../../types/modules/iModuleUser";
import { ROLE_ID_ADMIN } from "../../../types/modules/iRole";
import SectionDiv from "../../../components/common/SectionDiv";
import ModuleEmailTemplateNameEditor from "../../../components/module/ModuleEmailTemplateNameEditor";
import { Tab, Tabs, FormControl } from "react-bootstrap";
import styled from "styled-components";
import RichTextEditor from "../../../components/common/RichTextEditor/RichTextEditor";
import { FlexContainer } from "../../../styles";
import FormLabel from "../../../components/form/FormLabel";

const Wrapper = styled.div`
  margin-top: 1rem;
`;
type iEditPanel = {
  module: iModule;
  onUpdate: (data: any) => void;
};

const TAB_ONLINE_DONATIONS = "ONLINE_DONATIONS";
const TAB_DONATION_RECEIPTS = "DONATION_RECEIPTS";
const EditPanel = ({ module, onUpdate }: iEditPanel) => {
  const [selectedTab, setSelectedTab] = useState(TAB_ONLINE_DONATIONS);
  const [
    notificationEmailTemplateName,
    setNotificationEmailTemplateName
  ] = useState(module.settings?.notification?.templateName || "");
  const [notificationRecipients, setNotificationRecipients] = useState(
    module.settings?.notification?.recipients || ""
  );
  const [successMsg, setSuccessMsg] = useState(
    module.settings?.successMsg || ""
  );

  const [donationReceiptsBCCs, setDonationReceiptsBCCs] = useState(
    module.settings?.donationReceipts?.bccs || ""
  );
  const [donationReceiptsHeader, setDonationReceiptsHeader] = useState(
    module.settings?.donationReceipts?.receiptHeader || ""
  );
  const [donationReceiptsFooter, setDonationReceiptsFooter] = useState(
    module.settings?.donationReceipts?.receiptFooter || ""
  );

  const handleUpdate = () => {
    onUpdate({
      ...(module?.settings || {}),
      notification: {
        ...(module?.settings?.notification || {}),
        templateName: notificationEmailTemplateName,
        recipients: notificationRecipients
      },
      successMsg,
      donationReceipts: {
        ...(module?.settings?.donationReceipts || {}),
        bccs: donationReceiptsBCCs,
        receiptHeader: donationReceiptsHeader,
        receiptFooter: donationReceiptsFooter
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
              onChange={newText => setSuccessMsg(newText)}
            />
          </SectionDiv>
        </Tab>

        <Tab
          eventKey={TAB_DONATION_RECEIPTS}
          title={`Donation Receipts Settings`}
        >
          <SectionDiv>
            <h5>
              Email Receipt BCC's{" "}
              <small className={"text-muted"}>
                - when a donation receipt gets sent out, the following email
                addresses will be Bcc'd
              </small>
            </h5>

            <FormControl
              placeholder="Email address separated by ,"
              value={donationReceiptsBCCs}
              onChange={event => {
                setDonationReceiptsBCCs(event.target.value);
              }}
              onBlur={() => handleUpdate()}
            />
            <small>Email address separated by ,</small>
          </SectionDiv>

          <SectionDiv>
            <h5>
              PDF Templates{" "}
              <small className={"text-muted"}>
                - how the pdf will be generated
              </small>
            </h5>
            <FlexContainer className={"justify-content-between"}>
              <div style={{ width: "50%" }}>
                <div>
                  <FormLabel label={"Header"} />
                  <RichTextEditor
                    height={220}
                    value={donationReceiptsHeader}
                    onChange={newText => setDonationReceiptsHeader(newText)}
                  />
                </div>
                <div>
                  <FormLabel label={"Footer:"} />
                  <RichTextEditor
                    height={220}
                    value={donationReceiptsFooter}
                    onChange={newText => setDonationReceiptsFooter(newText)}
                  />
                </div>
              </div>
              <div>Preview</div>
            </FlexContainer>
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
        onUpdate={(newSettings: any) => setSettings(newSettings)}
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
