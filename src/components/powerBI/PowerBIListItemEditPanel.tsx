import styled from "styled-components";
import iPowerBIReport from "../../types/PowerBI/iPowerBIReport";
import FormLabel from "../form/FormLabel";
import PowerBIMSSelector from "./PowerBIMSSelector";
import SectionDiv from "../common/SectionDiv";
import { FlexContainer } from "../../styles";
import * as Icons from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import ToggleBtn from "../common/ToggleBtn";
import CommunityProfileList from "../Community/CommunityProfileList";
import * as _ from 'lodash';
import PowerBIService from '../../services/PowerBIService';
import Toaster from '../../services/Toaster';
import LoadingBtn from '../common/LoadingBtn';
import FormErrorDisplay from '../form/FormErrorDisplay';
import {Form} from 'react-bootstrap';
import ExplanationPanel from '../ExplanationPanel';

const Wrapper = styled.div``;

type iPowerBIListItemEditPanel = {
  report?: iPowerBIReport;
  onSubmitting?: (isSubmitting: boolean) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
  onSaved?: (report: iPowerBIReport) => void;
};
const PowerBIListItemEditPanel = ({
  report,
  isSubmitting = false,
  onSubmitting,
  onCancel,
  onSaved
}: iPowerBIListItemEditPanel) => {
  const [errorMap, setErrorMap] = useState<{[key: string]: string}>({});
  const [editingReport, setEditingReport] = useState<
    iPowerBIReport | undefined
  >(undefined);

  useEffect(() => {
    // @ts-ignore
    setEditingReport({
      ...(report || {}),
      settings: {
        ...(report?.settings || {}),
        isToAll: `${report?.id || ''}`.trim() === '' ? true : report?.settings?.isToAll,
      }
    });
  }, [report]);

  const setObj = (fieldName: string, newValue: any) => {
    // @ts-ignore
    setEditingReport({
      ...(editingReport || {}),
      [fieldName]: newValue
    });
  };

  const preSubmit = () => {
    const errors: {[key: string]: string} = {};
    if (`${editingReport?.externalId || ''}`.trim() === '') {
      errors.externalId = 'Microsoft Power BI ID is required';
    }
    if (`${editingReport?.name || ''}`.trim() === '') {
      errors.name = 'Name is required';
    }

    setErrorMap(errors);
    return Object.keys(errors).length === 0
  }

  const doSubmit = () => {
    if (preSubmit() !== true) {
      return;
    }
    if (onSubmitting) {
      onSubmitting(true);
    }

    const fnc = `${report?.id || ''}`.trim() === '' ? PowerBIService.create(editingReport) : PowerBIService.update(`${report?.id || ''}`, editingReport);
    fnc.then(resp => {
      if (onSaved) {
        onSaved(resp);
      }
    }).catch(err => {
      Toaster.showApiError(err);
    }).finally(() => {
      if (onSubmitting) {
        onSubmitting(false);
      }
    })
  }

  const getAccessPanel = () => {
    if (editingReport?.settings?.isToAll === true) {
      return null;
    }
    return (
      <>
        <FlexContainer
          className={"justify-content-start with-gap lg-gap space-above"}
        >
          <div>
            <FormLabel label={"To all students"} />
            <div>
              <ToggleBtn
                on={"Yes"}
                off={"No"}
                checked={editingReport?.settings?.isToAllStudents || false}
                onChange={checked =>
                  setObj("settings", {
                    ...(editingReport?.settings || {}),
                    isToAllStudents: checked
                  })
                }
              />
            </div>
          </div>
          <div>
            <FormLabel label={"To all teachers"} />
            <div>
              <ToggleBtn
                on={"Yes"}
                off={"No"}
                checked={editingReport?.settings?.isToAllTeachers || false}
                onChange={checked =>
                  setObj("settings", {
                    ...(editingReport?.settings || {}),
                    isToAllTeachers: checked
                  })
                }
              />
            </div>
          </div>
          <div>
            <FormLabel label={"To all non-teaching staff"} />
            <div>
              <ToggleBtn
                on={"Yes"}
                off={"No"}
                checked={editingReport?.settings?.isToAllNonTeaching || false}
                onChange={checked =>
                  setObj("settings", {
                    ...(editingReport?.settings || {}),
                    isToAllNonTeaching: checked
                  })
                }
              />
            </div>
          </div>
          <div>
            <FormLabel label={"To all casual staff"} />
            <div>
              <ToggleBtn
                on={"Yes"}
                off={"No"}
                checked={editingReport?.settings?.isToAllCasualStaff || false}
                onChange={checked =>
                  setObj("settings", {
                    ...(editingReport?.settings || {}),
                    isToAllCasualStaff: checked
                  })
                }
              />
            </div>
          </div>
          <div>
            <FormLabel label={"To all parents"} />
            <div>
              <ToggleBtn
                on={"Yes"}
                off={"No"}
                checked={editingReport?.settings?.isToAllParents || false}
                onChange={checked =>
                  setObj("settings", {
                    ...(editingReport?.settings || {}),
                    isToAllParents: checked
                  })
                }
              />
            </div>
          </div>
        </FlexContainer>

        <SectionDiv>
          <FormLabel
            label={`Specific Users: ${
              (editingReport?.settings?.userIds || []).length
            }`}
          />
          <ExplanationPanel text={'All selected flags above plus all provided users below will have access to the report.'} />
          <CommunityProfileList
            userIds={editingReport?.settings?.userIds || []}
            onCreate={newId =>
              setObj("settings", {
                ...(editingReport?.settings || {}),
                userIds: _.uniq([...editingReport?.settings?.userIds || [], newId])
              })
            }
            onDelete={id => {
              setObj("settings", {
                ...(editingReport?.settings || {}),
                userIds: _.uniq([...editingReport?.settings?.userIds || []].filter(userId => `${userId}`.trim() !== `${id}`.trim()))
              })
            }}
            showDeletingBtn
            showCreatingPanel
          />
        </SectionDiv>
      </>
    );
  };

  return (
    <Wrapper>
      <SectionDiv>
        <Form.Group>
          <FormLabel label={"Microsoft Power BI Report"} isRequired />
          <PowerBIMSSelector
            className={`form-control ${'externalId' in errorMap ? 'is-invalid' : ''}` }
            value={editingReport?.externalId || ""}
            onChange={(reportId, reportObj) => {
              // @ts-ignore
              setEditingReport({
                ...(editingReport || {}),
                externalId: reportId,
                externalObj: reportObj,
                name: reportObj.name || '',
              });
            }}
          />
          <FormErrorDisplay errorsMap={errorMap} fieldName={'externalId'} />
        </Form.Group>
      </SectionDiv>

      <SectionDiv>
        <Form.Group>
          <FormLabel label={"Name"} isRequired />
          <Form.Control
            isInvalid={'name' in errorMap}
            value={editingReport?.name || ""}
            placeholder={"The name of the Report"}
            onChange={event => setObj("name", event.target.value || "")}
          />
          <FormErrorDisplay errorsMap={errorMap} fieldName={'name'} />
        </Form.Group>
      </SectionDiv>

      <SectionDiv>
        <Form.Group>
          <FormLabel label={"Description"} />
          <Form.Control
            value={editingReport?.description || ""}
            placeholder={"The description of the Report"}
            onChange={event => setObj("description", event.target.value || "")}
          />
        </Form.Group>
      </SectionDiv>

      <SectionDiv>
        <h6>Report Access</h6>
        <FlexContainer className={"align-items-center with-gap lg-gap"}>
          <b>Access by all</b>
          <ToggleBtn
            on={"Yes"}
            off={"No"}
            checked={editingReport?.settings?.isToAll}
            onChange={checked =>
              setObj("settings", {
                ...(editingReport?.settings || {}),
                isToAll: checked
              })
            }
          />
        </FlexContainer>
        {getAccessPanel()}
      </SectionDiv>

      <FlexContainer className={"justify-content-between space-above"}>
        <div />
        <div>
          {onCancel && (
            <LoadingBtn variant={"link"} onClick={() => onCancel()} isLoading={isSubmitting === true}>
              Cancel
            </LoadingBtn>
          )}
          <LoadingBtn variant={"primary"} isLoading={isSubmitting === true} onClick={() => doSubmit()}>
            <Icons.Send /> Submit
          </LoadingBtn>
        </div>
      </FlexContainer>
    </Wrapper>
  );
};

export default PowerBIListItemEditPanel;
