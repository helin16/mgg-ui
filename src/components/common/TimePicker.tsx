import "react-datetime/css/react-datetime.css";
import moment, { Moment } from "moment";
import styled from "styled-components";
import * as Icons from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import UtilsService from "../../services/UtilsService";
import { Button } from "react-bootstrap";
import { DurationInputArg2 } from "moment/moment";

type iTimePicker = {
  value?: Date | string;
  onChange?: (hours: string, minutes: string) => void;
  className?: string;
  isDisabled?: boolean;
  allowClear?: boolean;
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  .time-picker-div {
    .btn {
      padding: 0px;
    }
  }
  .am-pm {
    padding-left: 0.4rem;
      .btn {
          height: auto !important;
      }
  }
`;
const TimePicker = ({
  onChange,
  value,
  className,
  isDisabled,
  allowClear = false
}: iTimePicker) => {
  const [time, setTime] = useState<Moment | null>(null);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (!UtilsService.validateTime(`${value || ""}`.trim())) {
      // console.error(`Invalid time(=${value}).`);
      return;
    }
    setTime(
      `${value || ""}`.trim() === ""
        ? moment()
        : moment(`${moment().format("YYYY-MM-DD")}T${value}`)
    );
    setHasChanged(false);
  }, [value]);

  useEffect(() => {
    if (!time || !hasChanged) {
      return;
    }
    onChange && onChange(time.local().format("HH"), time.local().format("mm"));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, hasChanged]);

  const moreTime = (hours: number, measure: DurationInputArg2) => {
    setHasChanged(true);
    setTime((time || moment()).clone().add(hours, measure));
  };

  const lessTime = (hours: number, measure: DurationInputArg2) => {
    setHasChanged(true);
    setTime((time || moment()).clone().subtract(hours, measure));
  };

  const clear = () => {
    setHasChanged(true);
    setTime(null);
  }

  const getContent = () => {
    if (allowClear === true && `${value || ''}`.trim()) {
      return null;
    }
    return (
      <>
        <div className={"text-center time-picker-div"}>
          {isDisabled === true ? null : (
            <Button
              variant={"link"}
              size={"sm"}
              onClick={() => moreTime(1, "hours")}
            >
              <Icons.ChevronCompactUp/>
            </Button>
          )}
          <div className={"form-control"}>{time?.local().format("hh")}</div>
          {isDisabled === true ? null : (
            <Button
              variant={"link"}
              size={"sm"}
              onClick={() => lessTime(1, "hours")}
            >
              <Icons.ChevronCompactDown/>
            </Button>
          )}
        </div>
        <div>:</div>
        <div className={"text-center time-picker-div"}>
          {isDisabled === true ? null : (
            <Button
              variant={"link"}
              size={"sm"}
              onClick={() => moreTime(1, "minutes")}
            >
              <Icons.ChevronCompactUp/>
            </Button>
          )}
          <div className={"form-control"}>{time?.local().format("mm")}</div>
          {isDisabled === true ? null : (
            <Button
              variant={"link"}
              size={"sm"}
              onClick={() => lessTime(1, "minutes")}
            >
              <Icons.ChevronCompactDown/>
            </Button>
          )}
        </div>
        <div className={'am-pm'}>
          <Button
            variant={"outline-secondary"}
            onClick={() => moreTime(12, "hours")}
            disabled={isDisabled}
          >
            {time?.local().format("a")}
          </Button>
        </div>
        {allowClear === true ? (
          <Button
            variant={"link"}
            onClick={() => clear()}
            disabled={isDisabled}
          >
            <Icons.XLg/>
          </Button>
        ) : null}
      </>
    );
  };

  return <Wrapper className={`${className}`}>{getContent()}</Wrapper>;
};

export default TimePicker;
