import styled from "styled-components";
import FormLabel from "../../../../components/form/FormLabel";
import { Col, FormControl, Row } from "react-bootstrap";
import { useState } from "react";
import * as Icons from "react-bootstrap-icons";
import LoadingBtn from "../../../../components/common/LoadingBtn";
import SelectBox from "../../../../components/common/SelectBox";
import {
  defaultSearchFunnelLeadsStatuses,
  FunnelLeadsStatuses
} from "../../../../types/Funnel/iFunnelLead";

const Wrapper = styled.div``;

export type iSearchCriteria = {
  studentName?: string;
  parent1?: string;
  parent2?: string;
  statuses?: string[];
};

type iFunnelLeadsSearchPanel = {
  isLoading?: boolean;
  className?: string;
  onSearch: (criteria: iSearchCriteria) => void;
  onReset?: () => void;
};

const FunnelLeadsSearchPanel = ({
  className,
  isLoading = false,
  onSearch,
  onReset
}: iFunnelLeadsSearchPanel) => {
  const [searchCriteria, setSearchCriteria] = useState<iSearchCriteria>({
    statuses: defaultSearchFunnelLeadsStatuses
  });

  const handleValueChanged = (fieldName: string, value: string) => {
    setSearchCriteria({
      ...searchCriteria,
      [fieldName]: value
    });
  };

  return (
    <Wrapper className={className}>
      <Row className={"align-items-end"}>
        <Col lg={3}>
          <FormLabel label={"Student Name"} />
          <FormControl
            placeholder={"Student name..."}
            value={searchCriteria.studentName || ""}
            onChange={event =>
              handleValueChanged("studentName", event.target.value || "")
            }
          />
        </Col>
        <Col lg={2}>
          <FormLabel label={"Parent 1"} />
          <FormControl
            placeholder={"Name of Parent 1, or email, or phone ..."}
            value={searchCriteria.parent1 || ""}
            onChange={event =>
              handleValueChanged("parent1", event.target.value || "")
            }
          />
        </Col>
        <Col lg={2}>
          <FormLabel label={"Parent 2"} />
          <FormControl
            placeholder={"Name of Parent 2, or email, or phone ..."}
            value={searchCriteria.parent2 || ""}
            onChange={event =>
              handleValueChanged("parent2", event.target.value || "")
            }
          />
        </Col>
        <Col lg={3}>
          <FormLabel label={"Status"} />
          <SelectBox
            options={FunnelLeadsStatuses.map(status => ({
              label: status,
              value: status
            }))}
            isMulti
            onChange={(option) => handleValueChanged("statuses", (option || []).map((opt: any) => opt.value))}
            value={(searchCriteria.statuses || []).map(status => ({
              label: status,
              value: status
            }))}
          />
        </Col>
        <Col lg={2}>
          {onReset ? (
            <LoadingBtn
              variant={"link"}
              onClick={() => onReset && onReset()}
              isLoading={isLoading}
            >
              <Icons.XLg /> Reset
            </LoadingBtn>
          ) : null}
          <LoadingBtn
            variant={"primary"}
            onClick={() => onSearch(searchCriteria)}
            isLoading={isLoading}
          >
            <Icons.Search /> Search
          </LoadingBtn>
        </Col>
      </Row>
    </Wrapper>
  );
};

export default FunnelLeadsSearchPanel;
