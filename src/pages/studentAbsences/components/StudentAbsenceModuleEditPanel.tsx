import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Form, Tab, Tabs } from "react-bootstrap";

import ModuleEmailTemplateNameEditor from "../../../components/module/ModuleEmailTemplateNameEditor";
import { MGGS_MODULE_ID_STUDENT_ABSENCES } from "../../../types/modules/iModuleUser";
import { ROLE_ID_ADMIN } from "../../../types/modules/iRole";
import ModuleEditPanel from "../../../components/module/ModuleEditPanel";
import iModule from "../../../types/modules/iModule";
import SectionDiv from "../../../components/common/SectionDiv";
import ExplanationPanel from "../../../components/ExplanationPanel";
import YearLevelSelector from "../../../components/student/YearLevelSelector";
import SynLuFormService from "../../../services/Synergetic/Lookup/SynLuFormService";
import Toaster from "../../../services/Toaster";

const Wrapper = styled.div``;

type iEditPanel = {
  module: iModule;
  onUpdate: (data: any) => void;
};

const EditPanel = ({ module, onUpdate }: iEditPanel) => {
  const [selectedSettingsTab, setSelectedSettingsTab] = useState("notifications");
  const [parentEmailTemplateName, setParentEmailTemplateName] = useState(
    module.settings?.parentSubmissionForm?.templateName || ""
  );
  const [parentEmailRecipients, setParentEmailRecipients] = useState(
    `${module.settings?.parentSubmissionForm?.recipients || ""}`.trim()
  );
  const [earlySignOutTemplateName, setEarlySignOutTemplateName] = useState(
    `${module.settings?.templateNames?.earlySignOutNotification || ""}`.trim()
  );
  const [lateSignInTemplateName, setLateSignInTemplateName] = useState(
    `${module.settings?.templateNames?.lateSignInNotification || ""}`.trim()
  );
  const [extraAbsenceTypeCodes, setExtraAbsenceTypeCodes] = useState(
    `${module.settings?.extraAbsenceTypeCodes || ""}`.trim()
  );
  const [dailySummarySettings, setDailySummarySettings] = useState<any>(
    module.settings?.dailySummary || { yearLevels: {} }
  );
  const [selectedYearLevelCode, setSelectedYearLevelCode] = useState("");
  const [forms, setForms] = useState<any[]>([]);

  useEffect(() => {
    let isCancelled = false;
    SynLuFormService.getAll({
      where: JSON.stringify({ ActiveFlag: true }),
      sort: "HomeRoom:ASC",
    })
      .then(resp => {
        if (isCancelled) {
          return;
        }
        setForms(resp || []);
      })
      .catch(err => {
        if (isCancelled) {
          return;
        }
        Toaster.showApiError(err);
      });
    return () => {
      isCancelled = true;
    };
  }, []);

  const handleUpdate = (customDailySummarySettings?: any) => {
    onUpdate({
      ...(module?.settings || {}),
      templateNames: {
        ...(module?.settings.templateNames || {}),
        earlySignOutNotification: earlySignOutTemplateName,
        lateSignInNotification: lateSignInTemplateName,
      },
      parentSubmissionForm: {
        templateName: parentEmailTemplateName,
        recipients: parentEmailRecipients
          .split(",")
          .map(email => `${email || ""}`.trim())
          .filter(email => `${email}`.trim() !== "")
          .join(","),
      },
      extraAbsenceTypeCodes: extraAbsenceTypeCodes
        .split(",")
        .map(code => `${code || ""}`.trim())
        .filter(code => `${code}`.trim() !== "")
        .join(","),
      dailySummary: customDailySummarySettings || dailySummarySettings,
    });
  };

  const selectedYearLevelSettings = useMemo(() => {
    if (`${selectedYearLevelCode || ""}`.trim() === "") {
      return { sendToHoy: true, luForms: {} };
    }
    return dailySummarySettings?.yearLevels?.[selectedYearLevelCode] || {
      sendToHoy: true,
      luForms: {},
    };
  }, [dailySummarySettings, selectedYearLevelCode]);

  const updateDailySummaryForYearLevel = (nextValue: any) => {
    const nextSettings = {
      ...dailySummarySettings,
      yearLevels: {
        ...(dailySummarySettings?.yearLevels || {}),
        [selectedYearLevelCode]: {
          ...(dailySummarySettings?.yearLevels?.[selectedYearLevelCode] || {}),
          ...nextValue,
        },
      },
    };
    setDailySummarySettings(nextSettings);
    handleUpdate(nextSettings);
  };

  const getDailySummarySettingsPanel = () => {
    return (
      <SectionDiv className={"lg"}>
        <h5>Daily Summary Notifications</h5>
        <ExplanationPanel text={"Manage HOY delivery and tutor `luForm` delivery for each year level."} />
        <SectionDiv>
          <h6>Year Level</h6>
          <YearLevelSelector
            values={`${selectedYearLevelCode || ""}`.trim() === "" ? [] : [selectedYearLevelCode]}
            onSelect={selected => {
              const option = Array.isArray(selected) ? selected[0] : selected;
              setSelectedYearLevelCode(`${option?.value || ""}`.trim());
            }}
            allowClear
          />
        </SectionDiv>
        {`${selectedYearLevelCode || ""}`.trim() === "" ? null : (
          <>
            <Form.Check
              type={"switch"}
              label={"Send to HOY"}
              checked={selectedYearLevelSettings.sendToHoy !== false}
              onChange={event =>
                updateDailySummaryForYearLevel({
                  sendToHoy: event.target.checked,
                })
              }
            />
            <SectionDiv>
              <h6>luForms</h6>
              {forms.map(form => {
                const formCode = `${form.Code || ""}`.trim();
                if (formCode === "") {
                  return null;
                }
                const checked = selectedYearLevelSettings?.luForms?.[formCode] === true;
                return (
                  <Form.Check
                    key={formCode}
                    type={"checkbox"}
                    label={`${form.Code} - ${form.StaffName}`}
                    checked={checked}
                    onChange={event =>
                      updateDailySummaryForYearLevel({
                        luForms: {
                          ...(selectedYearLevelSettings?.luForms || {}),
                          [formCode]: event.target.checked,
                        },
                      })
                    }
                  />
                );
              })}
            </SectionDiv>
          </>
        )}
      </SectionDiv>
    );
  };

  return (
    <Wrapper>
      <Tabs
        activeKey={selectedSettingsTab}
        onSelect={key => setSelectedSettingsTab(key || "notifications")}
        className={"space-below"}
      >
        <Tab eventKey={"notifications"} title={"Notifications"}>
          <SectionDiv>
            <h5>Email Notifications</h5>
            <h6>
              Early Sign Out -{" "}
              <small className={"text-muted"}>
                Email Notification Template for Early Sign Outs.
              </small>
            </h6>
            <ModuleEmailTemplateNameEditor
              value={earlySignOutTemplateName}
              className={"content-row"}
              onChange={event => setEarlySignOutTemplateName(event.target.value)}
              handleUpdate={() => handleUpdate()}
            />
            <h6>
              Late Sign In -{" "}
              <small className={"text-muted"}>
                Email Notification Template for Late Sign In.
              </small>
            </h6>
            <ModuleEmailTemplateNameEditor
              value={lateSignInTemplateName}
              className={"content-row"}
              onChange={event => setLateSignInTemplateName(event.target.value)}
              handleUpdate={() => handleUpdate()}
            />
          </SectionDiv>
        </Tab>

        <Tab eventKey={"parentSubmission"} title={"Parent Submission"}>
          <SectionDiv className={"lg"}>
            <h5>Parent Submission</h5>
            <ExplanationPanel text={"Settings for the Parent Submission Form"} />
            <ModuleEmailTemplateNameEditor
              value={parentEmailTemplateName}
              className={"content-row"}
              onChange={event => setParentEmailTemplateName(event.target.value)}
              handleUpdate={() => handleUpdate()}
            />
            <SectionDiv>
              <h6>Parent Submission Email Recipients</h6>
              <Form.Label>
                Recipients who will receive the notification after a submission by
                parent (email addresses separated by <b>,</b>):
              </Form.Label>
              <Form.Control
                placeholder="Email address separated by ,"
                value={parentEmailRecipients}
                onChange={event => {
                  setParentEmailRecipients(event.target.value);
                }}
                onBlur={() => handleUpdate()}
              />
            </SectionDiv>
          </SectionDiv>
        </Tab>

        <Tab eventKey={"extraReasons"} title={"Extra Reasons"}>
          <SectionDiv className={"lg"}>
            <h5>Extra Reasons for Late arrival at School / Early departure from School</h5>
            <ExplanationPanel
              text={
                "Normally, the program will take any reasons from Synergetic(luAbsenceReason) with AbsenceTypeCode 111 and 112. Extra AbsenceTypeCodes will be shown on both."
              }
            />
            <SectionDiv>
              <h6>Extra AbsenceTypeCodes</h6>
              <Form.Control
                placeholder="AbsenceTypeCodes separated by ,"
                value={extraAbsenceTypeCodes}
                onChange={event => {
                  setExtraAbsenceTypeCodes(event.target.value);
                }}
                onBlur={() => handleUpdate()}
              />
            </SectionDiv>
          </SectionDiv>
        </Tab>

        <Tab eventKey={"dailySummary"} title={"Daily Summary"}>
          {getDailySummarySettingsPanel()}
        </Tab>
      </Tabs>
    </Wrapper>
  );
};

const StudentAbsenceModuleEditPanel = () => {
  const [settings, setSettings] = useState({});

  const getContent = (module: iModule) => {
    return <EditPanel module={module} onUpdate={(newSettings: any) => setSettings(newSettings)} />;
  };

  return (
    <ModuleEditPanel
      moduleId={MGGS_MODULE_ID_STUDENT_ABSENCES}
      roleId={ROLE_ID_ADMIN}
      getChildren={getContent}
      getSubmitData={() => settings}
    />
  );
};

export default StudentAbsenceModuleEditPanel;
