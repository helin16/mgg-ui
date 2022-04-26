import {iAutoCompleteSingle} from '../../../../components/common/AutoComplete';
import SelectBox from '../../../../components/common/SelectBox';
import {useEffect, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import StudentReportService from '../../../../services/Synergetic/StudentReportService';
import iStudentReportStyle from '../../../../types/Synergetic/iStudentReportStyle';

type iReportStyleSelector = {
  values?: iAutoCompleteSingle[] | string[];
  className?: string;
  allowClear?: boolean;
  showIndicator?: boolean;
  onSelect?: (style: iAutoCompleteSingle | null) => void;
}

export const translateReportStyleToOption = (style: iStudentReportStyle) => {
  return {value: style.code, data: style, label: <div><b style={{fontSize: '13px'}}>{style.code}</b><div style={{marginTop: '-4px', fontSize: '9px'}}>{style.description}</div></div>};
}

const ReportStyleSelector = ({ values, className, allowClear, onSelect, showIndicator = true }: iReportStyleSelector) => {

  const [optionsMap, setOptionsMap] = useState<{[key: string]: iAutoCompleteSingle}>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    if (Object.keys(optionsMap).length > 0) { return }

    setIsLoading(true);
    // @ts-ignore
    StudentReportService.getStudentReportStyles()
      .then(resp => {
        if (isCancelled === true) { return }
        setOptionsMap(resp.reduce((map, style) => {
          return {
            ...map,
            [style.code]: translateReportStyleToOption(style),
          };
        }, {}))
      })
      .finally(() => {
        setIsLoading(false);
      })
    return () => {
      isCancelled = true;
    }
  }, [optionsMap]);

  const getSelectedValues = () => {
    if (!values) {
      return null;
    }
    if (values?.length <= 0) {
      return [];
    }
    return values.map(value => {
      if(typeof value === 'string' || typeof value === 'number') {
        return (value in optionsMap ? optionsMap[value] : {value, label: value, data: null})
      }
      return value;
    })
  }

  if (isLoading === true) {
    return <Spinner animation={'border'} />;
  }

  return (
    <SelectBox
      className={className}
      // @ts-ignore
      options={Object.values(optionsMap)}
      onChange={onSelect}
      value={getSelectedValues()}
      isClearable={allowClear}
      showDropdownIndicator={showIndicator}
    />
  )
};

export default ReportStyleSelector;
