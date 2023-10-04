import { useEffect, useState } from "react";
import iSynFileSemester from "../types/Synergetic/iSynFileSemester";
import SynFileSemesterSelector from "./student/SynFileSemesterSelector";
import DateRangeSelector from "./common/DateRangeSelector";
import moment from "moment-timezone";
import { Form } from "react-bootstrap";
import { FlexContainer } from "../styles";
import FormLabel from "./form/FormLabel";
import styled from 'styled-components';

type iDateRangeWithFileSemesterSelector = {
  ClassName?: string;
  isDisabled?: boolean;
  defaultStartDate?: string;
  defaultEndDate?: string;
  defaultSemester?: iSynFileSemester;
  onSelect: (params: {
    startDate: string;
    endDate: string;
    fileSemester: iSynFileSemester | null;
  }) => void;
};
const Wrapper = styled.div`
  .select-type {
    input {
      width: 15px;
      height: 15px;
      opacity: 1;
    }
  }
`;
const DateRangeWithFileSemesterSelector = ({
  isDisabled = false,
  ClassName,
  defaultStartDate,
  defaultEndDate,
  defaultSemester,
  onSelect
}: iDateRangeWithFileSemesterSelector) => {
  const [selectFromFileSemester, setSelectFromFileSemester] = useState(false);
  const [fileSemester, setFileSemester] = useState<iSynFileSemester | null>(
    defaultSemester || null
  );
  const [startDate, setStartDate] = useState<string | undefined>(
    defaultSemester?.StartDate || defaultStartDate
  );
  const [endDate, setEndDate] = useState<string | undefined>(defaultSemester?.EndDate || defaultEndDate);

  useEffect(() => {
    const startDateStr = `${startDate || ''}`.trim();
    const endDateStr = `${endDate || ''}`.trim();
    if (startDateStr === '' || endDateStr === '') {
      return;
    }
    onSelect({ startDate: startDateStr, endDate: endDateStr, fileSemester });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, fileSemester]);

  const getContent = () => {
    if (selectFromFileSemester === true) {
      return (
        <>
          <FormLabel label={"File Semester:"} isRequired />
          <SynFileSemesterSelector
            isDisabled={isDisabled}
            values={
              fileSemester === null
                ? undefined
                : [`${fileSemester.FileSemestersSeq}`]
            }
            onSelect={selected => {
              if (!selected) {
                setFileSemester(null);
                setStartDate(defaultStartDate);
                setEndDate(defaultEndDate);
                return;
              }

              if (!Array.isArray(selected)) {
                setFileSemester(selected.data);
                setStartDate(selected.data.StartDate);
                setEndDate(selected.data.EndDate);
              }
            }}
          />
        </>
      );
    }
    return (
      <DateRangeSelector
        isDisabled={isDisabled}
        isEndDateRequired
        isStartDateRequired
        startDate={startDate}
        endDate={endDate}
        onStartDateSelected={selected =>
          setStartDate(`${moment(selected).format("YYYY-MM-DD")}T00:00:00Z`)
        }
        onEndDateSelected={selected =>
          setEndDate(`${moment(selected).format("YYYY-MM-DD")}T00:00:00Z`)
        }
      />
    );
  };

  const handleChangeDateSelectType = (fromSemester: boolean) => {
    setSelectFromFileSemester(fromSemester);
    setStartDate(fromSemester === true ? defaultStartDate: undefined);
    setEndDate(fromSemester === true ? defaultEndDate: undefined);
  };

  return (
    <Wrapper className={ClassName}>
      <FlexContainer className={"with-gap lg-gap"}>
        <Form.Check
          className={'select-type'}
          disabled={isDisabled}
          label={"Dates"}
          name="select-type"
          type={"radio"}
          id={`select-type-dates`}
          checked={selectFromFileSemester !== true}
          onChange={(event) => handleChangeDateSelectType(!event.target.checked)}
        />
        <Form.Check
          className={'select-type'}
          disabled={isDisabled}
          label={"Semesters"}
          name="select-type"
          type={"radio"}
          id={`select-type-semesters`}
          checked={selectFromFileSemester === true}
          onChange={(event) => handleChangeDateSelectType(event.target.checked)}
        />
      </FlexContainer>
      {getContent()}
    </Wrapper>
  );
};

export default DateRangeWithFileSemesterSelector;
