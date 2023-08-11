import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {
  Button,
  Col,
  Form,
  FormControl,
  Row,
  Table
} from "react-bootstrap";
import { MGGS_MODULE_ID_REPORTS_STUDENT_ATTENDANCE_RATE } from "../../../../types/modules/iModuleUser";
import SectionDiv from "../../../../components/common/SectionDiv";
import iModule from "../../../../types/modules/iModule";
import ModuleEditPanel from "../../../../components/module/ModuleEditPanel";
import { ROLE_ID_ADMIN } from "../../../../types/modules/iRole";
import ExplanationPanel from "../../../../components/ExplanationPanel";
import moment from "moment-timezone";
import * as Icons from "react-bootstrap-icons";
import DeleteConfirmPopupBtn from "../../../../components/common/DeleteConfirm/DeleteConfirmPopupBtn";
import PopupModal from "../../../../components/common/PopupModal";
import FormLabel from "../../../../components/form/FormLabel";
import { FlexContainer } from "../../../../styles";
import DateTimePicker from "../../../../components/common/DateTimePicker";
import FormErrorDisplay, {getErrorClass, iErrorMap} from "../../../../components/form/FormErrorDisplay";
import YearLevelSelector from '../../../../components/student/YearLevelSelector';

const Wrapper = styled.div``;
const PopupWrapper = styled.div`
  .col {
    padding-top: 8px;
  }
  .form-control.is-invalid {
    border-color: #dc3545 !important;
  }
`;

type iEditPanel = {
  module: iModule;
  onUpdate: (data: any) => void;
};

type iExcludingPeriod = {
  name?: string;
  yearLevelCode?: string;
  start?: string;
  end?: string;
};

const EditPanel = ({ module, onUpdate }: iEditPanel) => {
  const [
    newExcludingPeriod,
    setNewExcludingPeriod
  ] = useState<iExcludingPeriod | null>(null);
  const [errorMap, setErrorMap] = useState<iErrorMap>({});
  const [excludingDates, setExcludingDates] = useState<iExcludingPeriod[]>([]);

  useEffect(() => {
    setExcludingDates(module.settings?.excludingDates || []);
  }, [module.settings?.excludingDates]);

  const handleClose = () => {
    setErrorMap({});
    setNewExcludingPeriod(null);
  };

  const preSubmit = () => {
    const errMap: iErrorMap = {};
    if (`${newExcludingPeriod?.name || ""}`.trim() === "") {
      errMap.name = "Name is Required";
    }
    if (`${newExcludingPeriod?.yearLevelCode || ""}`.trim() === "") {
      errMap.yearLevelCode = "Year Level is Required";
    }
    if (`${newExcludingPeriod?.start || ""}`.trim() === "") {
      errMap.start = "Start Date is Required";
    }
    if (`${newExcludingPeriod?.end || ""}`.trim() === "") {
      errMap.end = "End Date is Required";
    }
    if (`${newExcludingPeriod?.start || ""}`.trim() !== "" && `${newExcludingPeriod?.end || ""}`.trim() !== "" && moment(`${newExcludingPeriod?.start || ""}`.trim()).isAfter(moment(`${newExcludingPeriod?.end || ""}`.trim()))) {
      errMap.end = "Start Date should be early or the same as the End Date";
    }
    setErrorMap(errMap);
    return Object.keys(errMap).length <= 0;
  };

  const handleUpdate = () => {
    if (!preSubmit()) {
      return;
    }
    const newDates = [
      ...excludingDates,
      newExcludingPeriod,
    ];
    // @ts-ignore
    setExcludingDates(newDates.filter(date => date !== null));
    handleClose();
    onUpdate({
      ...(module?.settings || {}),
      excludingDates: newDates
    });
  };


  const getCreatingExcludingPeriodPopup = () => {
    return (
      <PopupModal
        show={newExcludingPeriod !== null}
        size={"lg"}
        handleClose={() => handleClose()}
        title={<h5>New Excluding Period:</h5>}
        footer={
          <FlexContainer>
            <div />
            <div>
              <Button variant={"link"} onClick={() => handleClose()}>
                <Icons.X /> Cancel
              </Button>{" "}
              <Button variant={"primary"} onClick={() => handleUpdate()}>
                <Icons.CheckLg /> Create
              </Button>{" "}
            </div>
          </FlexContainer>
        }
      >
        <PopupWrapper>
          <Form>
            <Row>
              <Col>
                <FormLabel label={"Name"} isRequired />
                <FormControl
                  isInvalid={'name' in errorMap}
                  placeholder={"Name...."}
                  value={`${newExcludingPeriod?.name || ""}`}
                  onChange={event =>
                    setNewExcludingPeriod({
                      ...newExcludingPeriod,
                      name: event.target.value
                    })
                  }
                />
                <FormErrorDisplay errorsMap={errorMap} fieldName={"name"} />
              </Col>
            </Row>
            <Row>
              <Col>
                <FormLabel label={"Year Level"} isRequired/>
                <YearLevelSelector
                  values={newExcludingPeriod?.yearLevelCode ? [`${newExcludingPeriod?.yearLevelCode}`] : []}
                  onSelect={(options) => {
                    setNewExcludingPeriod({
                      ...newExcludingPeriod,
                      // @ts-ignore
                      yearLevelCode: options?.data.Code || ''
                    })
                  }}
                />
                <FormErrorDisplay errorsMap={errorMap} fieldName={"yearLevelCode"} />
              </Col>
            </Row>
            <Row>
              <Col>
                <FormLabel label={"Start"} isRequired />
                <DateTimePicker
                  inputClassName={getErrorClass(errorMap, 'start')}
                  timeFormat={false}
                  dateFormat={"DD MMM YYYY"}
                  value={`${newExcludingPeriod?.start || ""}`}
                  isValidDate={(cDate, sDate) => {
                    return moment(sDate).isSameOrAfter(cDate);
                  }}
                  onChange={selected => {
                    if (typeof selected === "object") {
                      setNewExcludingPeriod({
                        ...newExcludingPeriod,
                        start: selected.format("YYYY-MM-DD")
                      });
                    }
                  }}
                />
                <FormErrorDisplay errorsMap={errorMap} fieldName={"start"} />
              </Col>

              <Col>
                <FormLabel label={"End"} isRequired />
                <DateTimePicker
                  inputClassName={getErrorClass(errorMap, 'end')}
                  timeFormat={false}
                  dateFormat={"DD MMM YYYY"}
                  value={`${newExcludingPeriod?.end || ""}`}
                  isValidDate={(cDate, sDate) => {
                    return moment(sDate).isSameOrAfter(cDate);
                  }}
                  onChange={selected => {
                    if (typeof selected === "object") {
                      setNewExcludingPeriod({
                        ...newExcludingPeriod,
                        end: selected.format("YYYY-MM-DD")
                      });
                    }
                  }}
                />
                <FormErrorDisplay errorsMap={errorMap} fieldName={"end"} />
              </Col>
            </Row>
          </Form>
        </PopupWrapper>
      </PopupModal>
    );
  };

  return (
    <Wrapper>
      <SectionDiv>
        <h5>Excluding Periods</h5>
        <ExplanationPanel
          text={
            "All attendances that in those periods (dates inclusive) will be ignored."
          }
        />
        <Table striped hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Year Level Code</th>
              <th>Start</th>
              <th>End</th>
              <th className={"text-right"}>
                <Button
                  variant={"success"}
                  size={"sm"}
                  onClick={() => setNewExcludingPeriod({})}
                >
                  <Icons.Plus /> New
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {excludingDates.map((excludingDate, index) => {
              return (
                <tr key={index}>
                  <th>{excludingDate.name}</th>
                  <th>{excludingDate.yearLevelCode || ""}</th>
                  <th>
                    {`${excludingDate.start || ""}`.trim() === ""
                      ? ""
                      : moment(`${excludingDate.start || ""}`.trim()).format(
                          "DD MMM YYYY"
                        )}
                  </th>
                  <th>
                    {`${excludingDate.end || ""}`.trim() === ""
                      ? ""
                      : moment(`${excludingDate.end || ""}`.trim()).format(
                          "DD MMM YYYY"
                        )}
                  </th>
                  <th className={"text-right"}>
                    <DeleteConfirmPopupBtn
                      variant={"danger"}
                      deletingFn={() => {
                        return new Promise((resolve) => {
                          resolve(index);
                        })
                      }}
                      deletedCallbackFn={() => {
                        excludingDates.splice(index, 1);
                        onUpdate({
                          ...(module?.settings || {}),
                          excludingDates: excludingDates
                        })
                      }}
                      size={"sm"}
                      description={
                        <>
                          You are about to delete this Excluding Periods{" "}
                          <b>
                            {`${excludingDate.start || ""}`.trim() === ""
                              ? ""
                              : moment(
                                  `${excludingDate.start || ""}`.trim()
                                ).format("DD MMM YYYY")}
                            ~
                            {`${excludingDate.end || ""}`.trim() === ""
                              ? ""
                              : moment(
                                  `${excludingDate.end || ""}`.trim()
                                ).format("DD MMM YYYY")}
                          </b>
                        </>
                      }
                      confirmString={`${excludingDate.name}`}
                    >
                      <Icons.Trash />
                    </DeleteConfirmPopupBtn>
                  </th>
                </tr>
              );
            })}
          </tbody>
        </Table>
        {getCreatingExcludingPeriodPopup()}
      </SectionDiv>
    </Wrapper>
  );
};
const StudentAttendanceRateReportModuleSettings = () => {
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
      moduleId={MGGS_MODULE_ID_REPORTS_STUDENT_ATTENDANCE_RATE}
      roleId={ROLE_ID_ADMIN}
      getChildren={getContent}
      getSubmitData={() => settings}
    />
  );
};

export default StudentAttendanceRateReportModuleSettings;
