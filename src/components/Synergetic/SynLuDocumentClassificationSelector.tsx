import {useEffect, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import {iAutoCompleteSingle} from '../common/AutoComplete';
import SelectBox from '../common/SelectBox';
import Toaster from '../../services/Toaster';
import SynLuDocumentClassificationService
  from '../../services/Synergetic/Lookup/SynLuDocumentClassificationService';
import iSynLuDocumentClassification
  from '../../types/Synergetic/Lookup/iSynLuDocumentClassification';

type iSynLuDocumentClassificationSelector = {
  values?: iAutoCompleteSingle[] | string[];
  onSelect?: (classification: iAutoCompleteSingle | iAutoCompleteSingle[] | null) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  isMulti?: boolean;
  className?: string;
  isDisabled?: boolean;
};

const translateDocumentClassificationToOption = (
  classification: iSynLuDocumentClassification
): iAutoCompleteSingle => ({
  value: classification.Code,
  label: `${classification.Code} - ${classification.Description}`,
  data: classification,
});

const SynLuDocumentClassificationSelector = ({
  values,
  onSelect,
  allowClear,
  showIndicator = true,
  isMulti = false,
  className,
  isDisabled,
}: iSynLuDocumentClassificationSelector) => {
  const [optionsMap, setOptionsMap] = useState<{[key: string]: iAutoCompleteSingle}>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    SynLuDocumentClassificationService.getAll({
      where: JSON.stringify({ActiveFlag: true}),
      perPage: 1000,
    })
      .then(resp => {
        if (isCancelled) return;
        setOptionsMap((resp.data || []).reduce((map, classification) => ({
          ...map,
          [classification.Code]: translateDocumentClassificationToOption(classification),
        }), {}));
      })
      .catch(err => {
        if (isCancelled) return;
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCancelled) return;
        setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  if (isLoading) {
    return <Spinner animation={'border'} size={'sm'} />;
  }

  const selectedValues = !values ? null : values.map(value => {
    if (typeof value !== 'string') return value;
    return optionsMap[value] || {value, label: value, data: null};
  });

  return (
    <SelectBox
      isDisabled={isDisabled}
      className={className}
      options={Object.values(optionsMap).sort((a, b) => `${a.label}`.localeCompare(`${b.label}`))}
      isMulti={isMulti}
      onChange={onSelect}
      value={selectedValues}
      isClearable={allowClear}
      showDropdownIndicator={showIndicator}
    />
  );
};

export {translateDocumentClassificationToOption};
export default SynLuDocumentClassificationSelector;
