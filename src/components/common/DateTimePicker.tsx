import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from 'moment';
import styled from 'styled-components';
import * as Icons from 'react-bootstrap-icons'
import {FormControl} from 'react-bootstrap';

type iDateTimePicker = {
  value?: Date | string;
  onChange?: (selected: any) => void;
  dateFormat?: string;
  displayTimeZone?: string;
  className?: string;
  allowClear?: boolean;
  isDisabled?: boolean;
  isValidDate?: (currentDate: Date, selectedDate: Date) => boolean;
}

const Wrapper = styled.div`
  //display: inline-block;
  position: relative;
  &.form-control {
    font-size: 13px;
    padding: 0px;
    &.is-invalid {
      padding-right: calc(1.5em + 0.75rem);
    }
    .datetime-picker {
      .form-control {
        border: none;
      }
    }
  }
  
  input {
    font-size: 0.8rem !important;
    margin: 0px;
  }
  .clear-btn {
    color: hsl(0, 0%, 80%);
    display: flex;
    padding: 8px 5px;
    transition: color 150ms;
    box-sizing: border-box;
    position: absolute;
    right: 0px;
    top: 0px;
    cursor: pointer;
    :hover {
      color: hsl(0, 0%, 60%);
    }
    
    svg {
      display: inline-block;
      fill: currentColor;
      line-height: 1;
      stroke: currentColor;
      stroke-width: 0;
      background-color: white;
    }
  }
`
const DateTimePicker = ({
  onChange, value, isValidDate, displayTimeZone, className, allowClear, isDisabled, dateFormat = 'D / MMM / YYYY h:m a'
}: iDateTimePicker) => {

  const getValue = () => {
    if (!value) {
      return '';
    }
    if (typeof value === 'string') {
      return value.trim() === '' ? '' : moment(value);
    }

    return value;
  }

  const getClearBtn = () => {
    if (allowClear !== true || !value) {
      return null;
    }
    return (
      <div className={'clear-btn'} onClick={() => onChange && onChange(null)}>
        <Icons.XLg height={18} width={18} viewBox={'0 -2 20 20'} />
      </div>
    )
  }

  return (
    <Wrapper className={className}>
      {
        isDisabled === true ? (<FormControl value={`${value || ''}`.trim() === '' ? '' : moment(value).format(dateFormat)} disabled />) : (
          <>
            <Datetime
              isValidDate={isValidDate}
              inputProps={{placeholder: 'Pick a date and time...'}}
              className={'datetime-picker'}
              onChange={onChange}
              value={getValue()}
              dateFormat={dateFormat}
              displayTimeZone={displayTimeZone}
              renderInput={(props) => {
                return <input {...props} value={value ? props.value : ''} />
              }}
            />
            { getClearBtn() }
          </>
        )
      }
    </Wrapper>
  )
};

export default DateTimePicker;
