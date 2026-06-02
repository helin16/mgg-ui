import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Form, Tab, Tabs } from "react-bootstrap";
import * as Icons from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import moment from "moment-timezone";

import ModuleEmailTemplateNameEditor from "../../../components/module/ModuleEmailTemplateNameEditor";
import { MGGS_MODULE_ID_STUDENT_ABSENCES } from "../../../types/modules/iModuleUser";
import { ROLE_ID_ADMIN } from "../../../types/modules/iRole";
import ModuleEditPanel from "../../../components/module/ModuleEditPanel";
import iModule from "../../../types/modules/iModule";
import SectionDiv from "../../../components/common/SectionDiv";
import ExplanationPanel from "../../../components/ExplanationPanel";
import SynLuFormService from "../../../services/Synergetic/Lookup/SynLuFormService";
import SynLuYearLevelService from "../../../services/Synergetic/Lookup/SynLuYearLevelService";
import Toaster from "../../../services/Toaster";
import DeleteConfirmPopupBtn from "../../../components/common/DeleteConfirm/DeleteConfirmPopupBtn";
import DailySummaryYearLevelEditPopupBtn, {
  iDailySummaryYearLevelRule,
} from "./DailySummaryYearLevelEditPopupBtn";
import ISynLuYearLevel from "../../../types/Synergetic/Lookup/iSynLuYearLevel";
import iSynLuForm from "../../../types/Synergetic/Lookup/iSynLuForm";
import SchoolManagementTeamService from "../../../services/Synergetic/SchoolManagementTeamService";
import iSchoolManagementTeam, {
  SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR,
} from "../../../types/Synergetic/iSchoolManagementTeam";
import SynVStaffService from "../../../services/Synergetic/SynVStaffService";
import iVStaff from "../../../types/Synergetic/iVStaff";
import { RootState } from "../../../redux/makeReduxStore";
import DataTable, { iTableColumn } from "../../../components/common/Table";

const Wrapper = styled.div`
  .daily-summary-title-actions {
    gap: 8px;
  }

  .daily-summary-contact-email {
    font-size: 0.85em;
  }

  .daily-notification-title-actions {
    gap: 8px;
  }
`;

type iDailyNotificationRow = {
  yearLevelCode: string;
  rule: iDailySummaryYearLevelRule;
};

type iEditPanel = {
  module: iModule;
  onUpdate: (data: any) => void;
};

const normalizeStaffString = (value: string) => `${value || ""}`.trim().toLowerCase();

export const pickPreferredTutor = (matchingTutors: iVStaff[], formStaffName: string) => {
  const normalizedFormStaffName = normalizeStaffString(formStaffName);

  return matchingTutors.reduce((bestTutor, currentTutor) => {
    if (!bestTutor) {
      return currentTutor;
    }

    const scoreTutor = (tutor: iVStaff) => {
      const tutorEmail = `${tutor?.StaffOccupEmail || ""}`.trim();
      const tutorNames = [
        tutor?.StaffNameInternal,
        tutor?.StaffNameExternal,
        tutor?.StaffLegalFullName,
      ].map(name => normalizeStaffString(`${name || ""}`));
      const hasNameMatch =
        normalizedFormStaffName !== "" && tutorNames.includes(normalizedFormStaffName);

      return (hasNameMatch ? 10 : 0) + (tutorEmail !== "" ? 1 : 0);
    };

    return scoreTutor(currentTutor) > scoreTutor(bestTutor) ? currentTutor : bestTutor;
  }, matchingTutors[0]);
};

const EditPanel = ({ module, onUpdate }: iEditPanel) => {
  const { user } = useSelector((state: RootState) => state.auth);
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
  const [yearLevelsMap, setYearLevelsMap] = useState<{ [code: string]: ISynLuYearLevel }>({});
  const [formsMap, setFormsMap] = useState<{ [code: string]: iSynLuForm }>({});
  const [headOfYearMap, setHeadOfYearMap] = useState<{ [code: string]: iSchoolManagementTeam }>({});
  const [staffFormMap, setStaffFormMap] = useState<{ [code: string]: iVStaff[] }>({});

  useEffect(() => {
    let isCancelled = false;
    SynLuFormService.getAll({
      where: JSON.stringify({ ActiveFlag: true }),
      sort: "HomeRoom:ASC",
    })
      .then(resp => {
        if (isCancelled) return;
        setFormsMap(
          (resp || []).reduce((acc: any, f: iSynLuForm) => {
            acc[`${f.Code || ""}`.trim()] = f;
            return acc;
          }, {})
        );
      })
      .catch(err => { if (!isCancelled) Toaster.showApiError(err); });

    // @ts-ignore
    SynLuYearLevelService.getAllYearLevels({})
      .then((resp: ISynLuYearLevel[]) => {
        if (isCancelled) return;
        setYearLevelsMap(
          (resp || []).reduce((acc: any, yl: ISynLuYearLevel) => {
            acc[`${yl.Code || ""}`.trim()] = yl;
            return acc;
          }, {})
        );
      })
      .catch((err: any) => { if (!isCancelled) Toaster.showApiError(err); });

    SchoolManagementTeamService.getSchoolManagementTeams({
      where: JSON.stringify({
        FileYear: user?.SynCurrentFileSemester?.FileYear || moment().year(),
        FileSemester: user?.SynCurrentFileSemester?.FileSemester || 1,
        SchoolRoleCode: SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR,
      }),
      include: "SynSSTStaff",
    })
      .then((resp: iSchoolManagementTeam[]) => {
        if (isCancelled) return;
        setHeadOfYearMap(
          (resp || []).reduce((acc: { [code: string]: iSchoolManagementTeam }, team) => {
            const yearLevelCode = `${team.YearLevelCode || ""}`.trim();
            if (yearLevelCode === "") {
              return acc;
            }
            acc[yearLevelCode] = team;
            return acc;
          }, {})
        );
      })
      .catch((err: any) => { if (!isCancelled) Toaster.showApiError(err); });

    SynVStaffService.getStaffList({
      where: JSON.stringify({
        ActiveFlag: true,
      }),
    })
      .then((resp: iVStaff[]) => {
        if (isCancelled) return;
        setStaffFormMap(
          (resp || []).reduce((acc: { [code: string]: iVStaff[] }, staff) => {
            const formCode = `${staff.StaffForm || ""}`.trim();
            if (formCode === "") {
              return acc;
            }
            acc[formCode] = [...(acc[formCode] || []), staff];
            return acc;
          }, {})
        );
      })
      .catch((err: any) => { if (!isCancelled) Toaster.showApiError(err); });

    return () => { isCancelled = true; };
  }, [user]);

  const getNextDailySummarySettings = (customDailySummarySettings?: any) => {
    const nextSettings = customDailySummarySettings || dailySummarySettings || {};
    return {
      ...nextSettings,
      from: `${nextSettings?.from || ""}`.trim(),
    };
  };

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
      dailySummary: getNextDailySummarySettings(customDailySummarySettings),
    });
  };

  const upsertDailySummaryYearLevel = (yearLevelCode: string, rule: iDailySummaryYearLevelRule, customSettings?: any) => {
    const base = customSettings || dailySummarySettings;
    const nextSettings = {
      ...base,
      yearLevels: {
        ...(base?.yearLevels || {}),
        [yearLevelCode]: rule,
      },
    };
    setDailySummarySettings(nextSettings);
    handleUpdate(nextSettings);
  };

  const deleteDailySummaryYearLevel = (yearLevelCode: string) => {
    const nextYearLevels = { ...(dailySummarySettings?.yearLevels || {}) };
    delete nextYearLevels[yearLevelCode];
    const nextSettings = { ...dailySummarySettings, yearLevels: nextYearLevels };
    setDailySummarySettings(nextSettings);
    handleUpdate(nextSettings);
    return Promise.resolve();
  };

  const getPreferredTutor = (formCode: string, formStaffName: string) => {
    return pickPreferredTutor(staffFormMap[formCode] || [], formStaffName);
  };

  const getDailySummarySettingsPanel = () => {
    const configuredYearLevels = Object.entries(
      dailySummarySettings?.yearLevels || {}
    ) as [string, iDailySummaryYearLevelRule][];

    const existingCodes = configuredYearLevels.map(([code]) => code);
    const rows = configuredYearLevels
      .sort(([a], [b]) => {
        const sortA = yearLevelsMap[a]?.YearLevelSort ?? 9999;
        const sortB = yearLevelsMap[b]?.YearLevelSort ?? 9999;
        return sortA - sortB;
      })
      .map(([yearLevelCode, rule]) => ({
        yearLevelCode,
        rule,
      }));

    const columns: iTableColumn<iDailyNotificationRow>[] = [
      {
        key: "yearLevel",
        header: "Year Level",
        cell: (column, row) => {
          const yl = yearLevelsMap[row.yearLevelCode];
          const ylLabel = yl ? `${yl.Description}`.trim() : `${row.yearLevelCode}`;
          return (
            <td key={column.key}>
              <DailySummaryYearLevelEditPopupBtn
                yearLevelCode={row.yearLevelCode}
                rule={row.rule}
                existingYearLevelCodes={existingCodes.filter(code => code !== row.yearLevelCode)}
                onSave={(updatedCode, updatedRule) =>
                  upsertDailySummaryYearLevel(updatedCode, updatedRule)
                }
              >
                <Icons.PencilSquare className={"me-1"} />
                {ylLabel}
              </DailySummaryYearLevelEditPopupBtn>
            </td>
          );
        },
      },
      {
        key: "notificationTo",
        header: "Notification To",
        cell: (column, row) => {
          const hoy = headOfYearMap[row.yearLevelCode];
          const yl = yearLevelsMap[row.yearLevelCode];
          const hoyName = `${hoy?.SynSSTStaff?.NameInternal || yl?.YearLevelCoordinator || ""}`.trim();
          const hoyEmail = `${hoy?.SynSSTStaff?.OccupEmail || hoy?.SynSSTStaff?.Email || ""}`.trim();
          return (
            <td key={column.key}>
              {row.rule?.sendToHoy === true || row.rule?.sendToHoy === undefined ? (
                <>
                  {hoyName === "" ? null : <div>{hoyName}</div>}
                  {hoyEmail === "" ? null : (
                    <div className={"text-muted daily-summary-contact-email"}>
                      <a href={`mailto:${hoyEmail}`}>{hoyEmail}</a>
                    </div>
                  )}
                </>
              ) : null}
            </td>
          );
        },
      },
      {
        key: "tutors",
        header: "Tutors",
        cell: (column, row) => {
          const enabledFormCodes = Object.entries(row.rule?.luForms || {})
            .filter(([, enabled]) => enabled === true)
            .map(([fc]) => fc);

          return (
            <td key={column.key}>
              {enabledFormCodes.map(fc => {
                const form = formsMap[fc];
                const tutor = getPreferredTutor(fc, `${form?.StaffName || ""}`);
                const tutorName = `${tutor?.StaffNameInternal || form?.StaffName || ""}`.trim();
                const tutorEmail = `${tutor?.StaffOccupEmail || ""}`.trim();
                const tutorLabel = `${fc}${tutorName !== "" ? ` - ${tutorName}` : ""}`;
                return (
                  <div key={fc}>
                    <div>
                      {tutorLabel}
                      {tutorEmail === "" ? null : (
                        <span className={"text-muted daily-summary-contact-email"}>
                          <a href={`mailto:${tutorEmail}`}>{`<${tutorEmail}>`}</a>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </td>
          );
        },
      },
      {
        key: "btns",
        header: "",
        cell: (column, row) => {
          const yl = yearLevelsMap[row.yearLevelCode];
          const ylLabel = yl ? `${yl.Description}`.trim() : `${row.yearLevelCode}`;
          return (
            <td className={"text-end"} key={column.key}>
              <DeleteConfirmPopupBtn
                variant={"outline-danger"}
                size={"sm"}
                description={`Remove daily notification for ${ylLabel}? This cannot be undone.`}
                confirmBtnString={"Remove"}
                deletingFn={() => deleteDailySummaryYearLevel(row.yearLevelCode)}
                deletedCallbackFn={() => {}}
              >
                <Icons.Trash />
              </DeleteConfirmPopupBtn>
            </td>
          );
        },
      },
    ];

    return (
      <SectionDiv className={"lg"}>
        <SectionDiv>
          <Form.Label>
            Sender shown on manual and nightly daily notification emails.
          </Form.Label>
          <Form.Control
            placeholder="Absence Notification<noreply@mentonegirls.vic.edu.au>"
            value={`${dailySummarySettings?.from || ""}`}
            onChange={event => {
              setDailySummarySettings({
                ...(dailySummarySettings || {}),
                from: event.target.value,
              });
            }}
            onBlur={event => {
              const nextSettings = {
                ...(dailySummarySettings || {}),
                from: event.target.value,
              };
              setDailySummarySettings(nextSettings);
              handleUpdate(nextSettings);
            }}
          />
        </SectionDiv>
        <SectionDiv>
          <div className={"d-flex align-items-center mb-2 daily-notification-title-actions"}>
            <h5 className={"mb-0"}>Daily Notification</h5>
            <DailySummaryYearLevelEditPopupBtn
              existingYearLevelCodes={existingCodes}
              onSave={(code, rule) => upsertDailySummaryYearLevel(code, rule)}
            >
              <Icons.PlusLg />
            </DailySummaryYearLevelEditPopupBtn>
          </div>
          <ExplanationPanel text={"Configure which year levels trigger the nightly email, and which tutors (by form) receive a scoped copy."} />

          {configuredYearLevels.length === 0 ? (
            <p className={"text-muted"}>No year levels configured yet.</p>
          ) : (
            <DataTable striped hover responsive columns={columns} rows={rows} />
          )}
        </SectionDiv>
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

        <Tab eventKey={"dailySummary"} title={"Daily Notification"}>
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
