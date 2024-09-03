import DateRangeSelector from "../../../../components/common/DateRangeSelector";
import { useState } from "react";
import * as Icons from "react-bootstrap-icons";
import Toaster, { TOAST_TYPE_ERROR } from "../../../../services/Toaster";
import LoadingBtn from "../../../../components/common/LoadingBtn";
import SynLuDebtorCategorySelector from "../../../../components/lookup/SynLuDebtorCategorySelector";
import styled from "styled-components";
import FormLabel from "../../../../components/form/FormLabel";
import moment from 'moment-timezone';
import {LU_DEBTOR_CATEGORY_CODE} from '../../../../types/Synergetic/Lookup/iSynLuDebtorFeeCategory';

export type iSearchCriteria = {
  dates: {
    start: string;
    end: string;
  };
  debtorFeeCategoryCodes: string[];
};

type iMonthlyBillingSearchPanel = {
  onSearch: (criteria: iSearchCriteria) => void;
  isLoading?: boolean;
};
const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  align-items: end;
  .category-selector {
    width: 900px;
    max-width: 100%;
  }
`;
const MonthlyBillingSearchPanel = ({
  isLoading,
  onSearch
}: iMonthlyBillingSearchPanel) => {
  const [searchCriteria, setSearchCriteria] = useState<iSearchCriteria>(
    {
      dates: {
        start: moment().startOf('month').toISOString(),
        end: moment().endOf('month').toISOString(),
      },
      debtorFeeCategoryCodes: [
        LU_DEBTOR_CATEGORY_CODE.TUITION,
        LU_DEBTOR_CATEGORY_CODE.TUITION_CONCESSION,
        LU_DEBTOR_CATEGORY_CODE.CONSOLIDATED_CHARGES,
        LU_DEBTOR_CATEGORY_CODE.STAFF_DISCOUNT,
        LU_DEBTOR_CATEGORY_CODE.SIBLING_DISCOUNT,
      ]
    }
  );

  const handleSearch = () => {
    const dates: any = searchCriteria?.dates || {};
    if (
      `${dates.start || ""}`.trim() === "" ||
      `${dates.end || ""}`.trim() === ""
    ) {
      Toaster.showToast(
        "Both start and end dates are required.",
        TOAST_TYPE_ERROR
      );
      return;
    }
    onSearch({
      dates: {
        start: moment(dates.start).format("YYYY-MM-DD"),
        end: moment(dates.end).format("YYYY-MM-DD")
      },
      debtorFeeCategoryCodes: searchCriteria?.debtorFeeCategoryCodes || []
    });
  };

  return (
    <Wrapper>
      <div>
        <DateRangeSelector
          startDateLabel={'Transaction Date Start'}
          isDisabled={isLoading}
          startDate={searchCriteria?.dates?.start}
          endDate={searchCriteria?.dates?.end}
          onStartDateSelected={selected =>
            setSearchCriteria({
              ...searchCriteria,
              // @ts-ignore
              dates: {
                ...searchCriteria?.dates,
                // @ts-ignore
                start: selected
              }
            })
          }
          onEndDateSelected={selected => {
            setSearchCriteria({
              ...searchCriteria,
              // @ts-ignore
              dates: {
                ...searchCriteria?.dates,
                // @ts-ignore
                end: selected
              }
            });
          }}
        />
      </div>
      <div className={"category-selector"}>
        <FormLabel label={"Fee Categories"} />
        <SynLuDebtorCategorySelector
          allowClear
          isMulti
          values={searchCriteria?.debtorFeeCategoryCodes || []}
          onSelect={values => {
            // @ts-ignore
            setSearchCriteria({
              ...(searchCriteria || {}),
              debtorFeeCategoryCodes:
                values === null
                  ? []
                  : (Array.isArray(values) ? values : [values]).map(v =>
                      `${v.value || ""}`.trim()
                    )
            });
          }}
        />
      </div>
      <div>
        <LoadingBtn
          onClick={() => handleSearch()}
          isLoading={isLoading}
          size={"sm"}
        >
          <Icons.Search /> Search
        </LoadingBtn>
      </div>
    </Wrapper>
  );
};

export default MonthlyBillingSearchPanel;
