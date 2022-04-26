import {iAutoCompleteSingle} from '../common/AutoComplete';
import {useEffect, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import SynLearningAreaService from '../../services/Synergetic/SynLearningAreaService';
import iSynLearningArea from '../../types/Synergetic/iSynLearningArea';
import SelectBox from '../common/SelectBox';

type iSynLearningAreaSelector = {
  values?: iAutoCompleteSingle[] | string[];
  fileTypes?: string[];
  onSelect?: (newValue: any) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  isMulti?: boolean;
};

export const translateLearningAreaToOption = (LearningArea: iSynLearningArea) => {
  return {value: LearningArea.LearningAreaCode, data: LearningArea, label: `${LearningArea.LearningAreaCode} - ${LearningArea.Description}`}
}

const LearningAreaSelector = ({values, onSelect, allowClear, fileTypes, isMulti, showIndicator = true}: iSynLearningAreaSelector) => {
  const [optionsMap, setOptionsMap] = useState<{[key: string]: iAutoCompleteSingle}>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    if (Object.keys(optionsMap).length > 0) { return }

    setIsLoading(true);
    const where = fileTypes && fileTypes.length > 0 ? { FileType: fileTypes } : {};
    // @ts-ignore
    SynLearningAreaService.getLearningAreas({
        where: JSON.stringify({
          ...where,
          ActiveFlag: true,
        }),
        sort: 'ReportSortSeq:ASC',
      })
      .then(resp => {
        if (isCancelled === true) { return }
        setOptionsMap(resp.reduce((map, LearningArea) => {
          return {
            ...map,
            [LearningArea.LearningAreaCode]: translateLearningAreaToOption(LearningArea),
          };
        }, {}))
      })
      .finally(() => {
        setIsLoading(false);
      })
    return () => {
      isCancelled = true;
    }
  }, [fileTypes, optionsMap]);

  if (isLoading === true) {
    return <Spinner animation={'border'} />;
  }

  const getSelectedValues = () => {
    if (!values) {
      return null;
    }
    if (values?.length <= 0) {
      return [];
    }
    return values.map(value => {
      if(typeof value === 'string') {
        return (value in optionsMap ? optionsMap[value] : {value, label: value, data: null})
      }
      return value;
    })
  }
  return (
    <SelectBox
      isMulti={isMulti}
      options={Object.values(optionsMap).sort((option1, option2) => option1.label > option2.label ? 1 : -1)}
      onChange={onSelect}
      value={getSelectedValues()}
      isClearable={allowClear}
      showDropdownIndicator={false}
      showIndicatorSeparator={false}
    />
  )
};

export default LearningAreaSelector;
