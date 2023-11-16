import styled from "styled-components";
import { useState } from "react";
import DateRangeSelector from "../../common/DateRangeSelector";
import FormLabel from "../../form/FormLabel";
import LoadingBtn from "../../common/LoadingBtn";
import * as Icons from "react-bootstrap-icons";
import FlagSelector from "../../form/FlagSelector";
import SynStudentAutoComplete from '../../student/SynStudentAutoComplete';

export type iConfirmationOfDetailsListSearchCriteria = {
  StudentIds?: number[];
  SubmittedDateRange?: { start?: string; end?: string };
  isSubmitted?: boolean;
  isSyncd?: boolean;
};
type iConfirmationOfDetailsListSearchPanel = {
  defaultSearchCriteria: iConfirmationOfDetailsListSearchCriteria;
  isSearching?: boolean;
  onSearch: (iSearchCriteria: iConfirmationOfDetailsListSearchCriteria) => void;
};

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
  
  .student-search-div {
    width: 50%;
    min-width: 200px;
  }
`;
const ConfirmationOfDetailsListSearchPanel = ({
  defaultSearchCriteria,
  onSearch,
  isSearching
}: iConfirmationOfDetailsListSearchPanel) => {
  const [searchCriteria, setSearchCriteria] = useState<
    iConfirmationOfDetailsListSearchCriteria
  >(defaultSearchCriteria);

  return (
    <Wrapper>
      <div className={'student-search-div'}>
        <FormLabel label={"student"} />
        <SynStudentAutoComplete values={searchCriteria.StudentIds} isMulti allowClear onSelect={(options) => {
          if (options === null) {
            setSearchCriteria({
              ...searchCriteria,
              StudentIds: [],
            });
            return;
          }
          if (Array.isArray(options)) {
            setSearchCriteria({
              ...searchCriteria,
              StudentIds: options.map(option => Number(option.value)),
            });
            return;
          }
          setSearchCriteria({
            ...searchCriteria,
            StudentIds: [Number(options.value)],
          });
        }}/>
      </div>
      <div>
        <DateRangeSelector
          startDateLabel={"Submitted At:"}
          endDateLabel={""}
          startDate={searchCriteria.SubmittedDateRange?.start}
          endDate={searchCriteria.SubmittedDateRange?.end}
          onStartDateSelected={selected => {
            setSearchCriteria({
              ...searchCriteria,
              SubmittedDateRange: {
                ...(searchCriteria.SubmittedDateRange || {}),
                start: selected.toISOString()
              }
            });
          }}
          onEndDateSelected={selected => {
            setSearchCriteria({
              ...searchCriteria,
              SubmittedDateRange: {
                ...(searchCriteria.SubmittedDateRange || {}),
                end: selected.toISOString()
              }
            });
          }}
        />
      </div>
      <div>
        <FormLabel label={"Submitted?"} />
        <FlagSelector
          value={searchCriteria.isSubmitted}
          onSelect={option => {
            setSearchCriteria({
              ...searchCriteria,
              // @ts-ignore
              isSubmitted:
                !option || option?.value === "" ? undefined : option?.value
            });
          }}
        />
      </div>
      <div>
        <FormLabel label={`sync'd?`} />
        <FlagSelector
          showAll={false}
          value={searchCriteria.isSyncd}
          onSelect={option => {
            setSearchCriteria({
              ...searchCriteria,
              // @ts-ignore
              isSyncd:
                !option || option?.value === "" ? undefined : option?.value
            });
          }}
        />
      </div>
      <div className={"text-right search-btns"}>
        <LoadingBtn isLoading={isSearching} onClick={() => onSearch(searchCriteria)}>
          <Icons.Search /> Search
        </LoadingBtn>
      </div>
    </Wrapper>
  );
};

export default ConfirmationOfDetailsListSearchPanel;
