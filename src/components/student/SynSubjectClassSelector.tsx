import {iAutoCompleteSingle} from '../common/AutoComplete';
import {useEffect, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import SelectBox from '../common/SelectBox';
import iSynSubjectClass from '../../types/Synergetic/iSynSubjectClass';
import SynSubjectClassService from '../../services/Synergetic/SynSubjectClassService';
import {HEADER_NAME_SELECTING_FIELDS} from '../../services/AppService';

type iSynSubjectClassSelector = {
  isMulti?: boolean;
  values?: iAutoCompleteSingle[] | string[];
  onSelect?: (SubjectClass: iAutoCompleteSingle | null | iAutoCompleteSingle[]) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  className?: string;
  FileYear: number;
  FileSemester: number;
  pageSize?: number;
  limitedClassCodes?: string[];
};

export const translateSubjectClassToOption = (SubjectClass: iSynSubjectClass) => {
  return {value: SubjectClass.ClassCode, data: SubjectClass, label: `${SubjectClass.ClassCode}: ${SubjectClass.Description}`}
}

const SynSubjectClassSelector = ({
  values, onSelect, allowClear, className, FileYear, FileSemester, pageSize, limitedClassCodes, showIndicator = true, isMulti = false
}: iSynSubjectClassSelector) => {
  const [optionMap, setOptionMap] = useState<{ [key: string]: iAutoCompleteSingle }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    if (Object.keys(optionMap).length > 0) { return }
    setIsLoading(true);
    SynSubjectClassService.getAll({
        where: JSON.stringify({
          FileYear: FileYear,
          FileSemester: FileSemester,
          ...((limitedClassCodes || []).length <= 0 ? {} : {ClassCode: limitedClassCodes})
        }),
        ...(pageSize ? {perPage: `${pageSize}`} : {})
      }, {
         headers: {[HEADER_NAME_SELECTING_FIELDS]: JSON.stringify(['ClassCode', 'Description'])}
      })
      .then(resp => {
        if (isCancelled === true) { return }
        setOptionMap(resp.data.reduce((map, SubjectClass) => {
          return {
            ...map,
            [SubjectClass.ClassCode]: translateSubjectClassToOption(SubjectClass),
          }
        }, {}))
      })
      .finally(() => {
        setIsLoading(false);
      })
    return () => {
      isCancelled = true;
    }
  }, [optionMap, FileYear, FileSemester, pageSize, limitedClassCodes]);

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

  if (isLoading) {
    return <Spinner animation={'border'} size={'sm'}/>;
  }

  return (
    <SelectBox
      options={Object.values(optionMap)}
      isMulti={isMulti}
      className={className}
      onChange={onSelect}
      value={getSelectedValues()}
      isClearable={allowClear}
      showDropdownIndicator={showIndicator}
    />
  )
};

export default SynSubjectClassSelector;
