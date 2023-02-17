import styled from 'styled-components';
import SelectBox from '../../../components/common/SelectBox';
import {useCallback, useEffect, useState} from 'react';
import Toaster from '../../../services/Toaster';
import {Spinner} from 'react-bootstrap';
import iSynGeneralLedger from '../../../types/Synergetic/Finance/iSynGeneralLedager';
import SynGeneralLedgerService from '../../../services/Synergetic/Finance/SynGeneralLedgerService';
import moment from 'moment-timezone';

type iGLOption = {
  label: string;
  value: string;
  data: iSynGeneralLedger;
}
type iSynGLSelector = {
  values?: string | string[] | null;
  className?: string;
  onSelect?: (option: iGLOption | iGLOption[] | null ) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  isDisabled?: boolean;
  isMulti?: boolean;
  year?: number;
  selectAllBeDefault?: (option: iSynGeneralLedger[] ) => void;
};

type iGLMap = { [key: string]: iSynGeneralLedger };

const Wrapper = styled.div``;
const SynGLSelector = ({ className, onSelect, values, year, allowClear, showIndicator, isDisabled, isMulti = false, selectAllBeDefault }: iSynGLSelector) => {
  const [isLoading, setIsLoading] = useState(false);
  const [glMap, setGlMap] = useState<iGLMap>({});

  const checkSelectAll = useCallback((gls: iSynGeneralLedger[]) => {
    if (selectAllBeDefault) {
      selectAllBeDefault(gls);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setIsLoading(true);
    SynGeneralLedgerService.getAll({
        where: JSON.stringify({
          ActiveFlag: true,
          GLYear: year || moment().year(),
        }),
        perPage: '99999',
      })
      .then(resp => {
        setGlMap(resp.data.reduce((map: iGLMap, gl) => ({...map, [gl.GLCode]: gl}), {}));
        checkSelectAll(resp.data);
      }).catch(err => {
        Toaster.showApiError(err);
      }).finally(() => {
        setIsLoading(false);
      })
  }, [year, checkSelectAll]);

  const getOptionFromGl = (gl: iSynGeneralLedger) => {
    return {label: `${gl.GLCode} - ${gl.GLDescription}`, value: gl.GLCode, data: gl};
  }

  const getSelectedOption = (value?: string | null) => {
    if (!values) {
      return null;
    }

    const key = `${value || ''}`;
    return key in glMap ? getOptionFromGl(glMap[key]) : null;
  }

  const getSelectedOptions = () => {
    if (!values) {
      if (selectAllBeDefault && isMulti) {
        return Object.values(glMap).map(gl => getSelectedOption(gl.GLCode))
      }
      return null;
    }

    if (Array.isArray(values)) {
      return values.map(value => getSelectedOption(value));
    }


    return getSelectedOption(values);
  }

  return (
    <Wrapper>
      {isLoading ? <Spinner animation={'border'} /> : (
        <SelectBox
          isDisabled={isDisabled}
          options={Object.values(glMap).map(gl => getOptionFromGl(gl))}
          className={className}
          onChange={(option) => onSelect && onSelect(option === null ? null : option)}
          value={getSelectedOptions()}
          isClearable={allowClear}
          showDropdownIndicator={showIndicator}
          isMulti={isMulti}
        />
      )}
    </Wrapper>
  )
}

export default SynGLSelector;
