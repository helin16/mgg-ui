import { useEffect, useState } from "react";
import { iPowerBIReportListItem } from "../../types/PowerBI/iPowerBIReportList";
import SelectBox from "../common/SelectBox";
import PowerBIService from "../../services/PowerBIService";
import { Spinner } from "react-bootstrap";
import Toaster from "../../services/Toaster";

type iPowerBIMSSelector = {
  value?: string;
  onChange?: (newId: string, data: iPowerBIReportListItem) => void;
  className?: string;
};
const PowerBIMSSelector = ({ value, onChange, className }: iPowerBIMSSelector) => {
  const [isLoading, setIsLoading] = useState(false);
  const [reports, setReports] = useState<iPowerBIReportListItem[]>([]);

  useEffect(() => {
    let isCanceled = false;

    setIsLoading(true);
    PowerBIService.getMSReports()
      .then(resp => {
        if (isCanceled) {
          return;
        }
        setReports(resp);
      })
      .catch(err => {
        if (isCanceled) {
          return;
        }
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) {
          return;
        }
        setIsLoading(false);
      });

    return () => {
      isCanceled = true;
    };
  }, []);

  const getOptions = () => {
    return reports.map(report => ({
      value: report.id,
      label: `${report.name} [ID: ${report.id}]`,
      data: report
    }));
  };

  const getSelectedOption = () => {
    return getOptions().filter(option => option.value === value);
  }

  if (isLoading === true) {
    return <Spinner animation={"border"} />;
  }

  return (
    <SelectBox
      className={className}
      options={getOptions()}
      value={getSelectedOption()}
      onChange={options => {
        if (onChange) {
          // @ts-ignore
          onChange(options.value, options.data);
        }
      }}
    />
  );
};

export default PowerBIMSSelector;
