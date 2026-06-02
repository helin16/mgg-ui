import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import * as Icons from "react-bootstrap-icons";
import styled from "styled-components";
import PopupModal from "../../../components/common/PopupModal";
import { FlexContainer } from "../../../styles";
import YearLevelSelector from "../../../components/student/YearLevelSelector";
import LuFormSelector from "../../../components/student/SynFormSelector";
import { iAutoCompleteSingle } from "../../../components/common/AutoComplete";
import { CAMPUS_CODE_SENIOR } from "../../../types/Synergetic/Lookup/iSynLuCampus";

const SENIOR_CAMPUS_CODES = [CAMPUS_CODE_SENIOR];

const Wrapper = styled.div`
  .field-label {
    font-weight: 600;
    margin-bottom: 4px;
  }
  .section {
    margin-bottom: 16px;
  }
`;

export type iDailySummaryYearLevelRule = {
  sendToHoy?: boolean;
  luForms: { [formCode: string]: boolean };
};

type iDailySummaryYearLevelEditPopupBtnProps = {
  yearLevelCode?: string;
  rule?: iDailySummaryYearLevelRule;
  onSave: (yearLevelCode: string, rule: iDailySummaryYearLevelRule) => void;
  existingYearLevelCodes?: string[];
  children?: React.ReactNode;
};

const DailySummaryYearLevelEditPopupBtn = ({
  yearLevelCode,
  rule,
  onSave,
  existingYearLevelCodes = [],
  children,
}: iDailySummaryYearLevelEditPopupBtnProps) => {
  const [showPopup, setShowPopup] = useState(false);

  const isEditMode = `${yearLevelCode || ""}`.trim() !== "";

  const [localYearLevelCode, setLocalYearLevelCode] = useState(
    `${yearLevelCode || ""}`.trim()
  );
  const [sendToHoy, setSendToHoy] = useState(rule?.sendToHoy !== false);
  const [selectedFormCodes, setSelectedFormCodes] = useState<string[]>(
    Object.entries(rule?.luForms || {})
      .filter(([, enabled]) => enabled === true)
      .map(([code]) => code)
  );

  const handleOpen = () => {
    setLocalYearLevelCode(`${yearLevelCode || ""}`.trim());
    setSendToHoy(rule?.sendToHoy !== false);
    setSelectedFormCodes(
      Object.entries(rule?.luForms || {})
        .filter(([, enabled]) => enabled === true)
        .map(([code]) => code)
    );
    setShowPopup(true);
  };

  const handleSave = () => {
    if (`${localYearLevelCode || ""}`.trim() === "") {
      return;
    }
    const luForms = selectedFormCodes.reduce<{ [code: string]: boolean }>(
      (acc, code) => ({ ...acc, [code]: true }),
      {}
    );
    onSave(localYearLevelCode, { sendToHoy, luForms });
    setShowPopup(false);
  };

  const canSave =
    `${localYearLevelCode || ""}`.trim() !== "" &&
    (isEditMode ||
      !existingYearLevelCodes.includes(`${localYearLevelCode || ""}`.trim()));

  return (
    <>
      <Button
        variant={isEditMode ? "link" : "outline-primary"}
        size={"sm"}
        onClick={handleOpen}
        className={isEditMode ? "p-0" : ""}
      >
        {children ?? (
          <>
            <Icons.PlusLg /> Add Year Level
          </>
        )}
      </Button>

      {showPopup && (
        <PopupModal
          show={showPopup}
          title={isEditMode ? `Edit Year ${localYearLevelCode}` : "Add Year Level"}
          handleClose={() => setShowPopup(false)}
          footer={
            <FlexContainer className={"justify-content-between w-100"}>
              <Button variant={"secondary"} size={"sm"} onClick={() => setShowPopup(false)}>
                <Icons.XLg /> Cancel
              </Button>
              <Button
                variant={"primary"}
                size={"sm"}
                disabled={!canSave}
                onClick={handleSave}
              >
                <Icons.CheckLg /> Save
              </Button>
            </FlexContainer>
          }
        >
          <Wrapper>
            <div className={"section"}>
              <div className={"field-label"}>Year Level</div>
              <YearLevelSelector
                campusCodes={SENIOR_CAMPUS_CODES}
                excludeCodes={isEditMode ? [] : existingYearLevelCodes}
                values={
                  `${localYearLevelCode || ""}`.trim() !== ""
                    ? [localYearLevelCode]
                    : []
                }
                onSelect={(selected) => {
                  const opt = Array.isArray(selected) ? selected[0] : selected;
                  setLocalYearLevelCode(`${(opt as iAutoCompleteSingle)?.value || ""}`.trim());
                }}
                allowClear={!isEditMode}
                isDisabled={isEditMode}
              />
              {!isEditMode &&
                `${localYearLevelCode || ""}`.trim() !== "" &&
                existingYearLevelCodes.includes(localYearLevelCode) && (
                  <small className={"text-danger"}>
                    This year level is already configured.
                  </small>
                )}
            </div>

            <div className={"section"}>
              <Form.Check
                type={"checkbox"}
                id={"daily-notification-send-to-hoy"}
                label={"Sending to HOY"}
                checked={sendToHoy}
                onChange={event => setSendToHoy(event.target.checked)}
              />
            </div>

            <div className={"section"}>
              <div className={"field-label"}>LuForm</div>
              <LuFormSelector
                isMulti
                values={selectedFormCodes}
                onSelect={(selected) => {
                  const arr = Array.isArray(selected) ? selected : selected ? [selected] : [];
                  setSelectedFormCodes(arr.map((o) => `${(o as iAutoCompleteSingle).value}`));
                }}
                allowClear
              />
            </div>
          </Wrapper>
        </PopupModal>
      )}
    </>
  );
};

export default DailySummaryYearLevelEditPopupBtn;
