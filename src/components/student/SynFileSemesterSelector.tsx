import {Spinner} from 'react-bootstrap';
import SelectBox from '../common/SelectBox';
import {useEffect, useState} from 'react';
import {iAutoCompleteSingle} from '../common/AutoComplete';
import iSynFileSemester from '../../types/Synergetic/iSynFileSemester';
import SynFileSemesterService from '../../services/Synergetic/SynFileSemesterService';
import moment from 'moment-timezone';


type iSynFileSemesterSelector = {
  isMulti?: boolean;
  values?: iAutoCompleteSingle[] | string[];
  onSelect?: (fileSemester: iAutoCompleteSingle | null | iAutoCompleteSingle[]) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  className?: string;
  isDisabled?: boolean;
};

const translateFileSemesterToOption = (fileSemester: iSynFileSemester) => {
  return {value: fileSemester.FileSemestersSeq, data: fileSemester, label: (<>Year:<b>{fileSemester.FileYear}</b>, Sem:<b>{fileSemester.FileSemester}</b><div><small>{moment(fileSemester.StartDate).format('DD MMM YYYY')} ~ {moment(fileSemester.EndDate).format('DD MMM YYYY')}</small></div><div><small>{fileSemester.Description}</small></div></>)}
}

const SynFileSemesterSelector = ({values, onSelect, allowClear, className, isDisabled = false, showIndicator = true, isMulti = false}: iSynFileSemesterSelector) => {
  const [optionMap, setOptionMap] = useState<{ [key: string]: iAutoCompleteSingle }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    if (Object.keys(optionMap).length > 0) { return }
    setIsLoading(true);
    SynFileSemesterService.getFileSemesters({
      where: JSON.stringify({
        ActivatedFlag: true,
      }),
      sort: `FileYear:DESC,FileSemester:DESC`
    })
      .then(resp => {
        if (isCancelled === true) { return }
        setOptionMap(
          resp
            .reduce((map, fileSemester) => {
              return {
                ...map,
                [fileSemester.FileSemestersSeq]: translateFileSemesterToOption(fileSemester),
              }
            }, {}))
      })
      .finally(() => {
        setIsLoading(false);
      })
    return () => {
      isCancelled = true;
    }
  }, [optionMap]);

  const getSelectedValues = () => {
    if (!values) {
      return null;
    }
    if (values?.length <= 0) {
      return [];
    }
    return values.map(value => {
      if(typeof value === 'string') {
        return (value in optionMap ? optionMap[value] : {value, label: value, data: null})
      }
      return value;
    })
  }

  if (isLoading === true) {
    return <Spinner animation={'border'} size={'sm'}/>;
  }
  return (
    <SelectBox
      isDisabled={isDisabled}
      options={Object.values(optionMap).sort((sem1, sem2) => `${sem1.data.FileYear}-${sem1.data.FileSemester}` >`${sem2.data.FileYear}-${sem2.data.FileSemester}` ? -1 : 1 )}
      isMulti={isMulti}
      className={className}
      onChange={onSelect}
      value={getSelectedValues()}
      isClearable={allowClear}
      showDropdownIndicator={showIndicator}
    />
  )
}

export default SynFileSemesterSelector;
