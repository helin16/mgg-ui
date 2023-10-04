import FormLabel from "../form/FormLabel";
import DateTimePicker from "./DateTimePicker";
import { FlexContainer } from "../../styles";

type iDateRangeSelector = {
  isStartDateRequired?: boolean;
  isEndDateRequired?: boolean;
  startDate?: Date | string;
  endDate?: Date | string;
  dateFormat?: string;
  timeFormat?: string | boolean;
  displayTimeZone?: string;
  className?: string;
  allowClear?: boolean;
  isDisabled?: boolean;
  isValidStartDate?: (currentDate: Date, selectedDate: Date) => boolean;
  isValidEndDate?: (currentDate: Date, selectedDate: Date) => boolean;
  onStartDateSelected: (selected: Date) => void;
  onEndDateSelected: (selected: Date) => void;
};
const DateRangeSelector = ({
  startDate,
  endDate,
  isStartDateRequired,
  isEndDateRequired,
  dateFormat = "DD/MMM/YYYY",
  timeFormat = false,
  onEndDateSelected,
  onStartDateSelected,
  displayTimeZone,
  className,
  allowClear,
  isDisabled,
  isValidEndDate,
  isValidStartDate
}: iDateRangeSelector) => {
  return (
    <FlexContainer className={`${className} with-gap align-items end`}>
      <div>
        <FormLabel label={"Start"} isRequired={isStartDateRequired} />
        <DateTimePicker
          isDisabled={isDisabled}
          displayTimeZone={displayTimeZone}
          dateFormat={dateFormat}
          timeFormat={timeFormat}
          value={startDate}
          allowClear={allowClear}
          isValidDate={isValidStartDate}
          onChange={onStartDateSelected}
        />
      </div>
      <div>
        <FormLabel label={"End"} isRequired={isEndDateRequired} />
        <DateTimePicker
          isDisabled={isDisabled}
          displayTimeZone={displayTimeZone}
          allowClear={allowClear}
          timeFormat={timeFormat}
          dateFormat={dateFormat}
          value={endDate}
          isValidDate={isValidEndDate}
          onChange={onEndDateSelected}
        />
      </div>
    </FlexContainer>
  );
};

export default DateRangeSelector;
