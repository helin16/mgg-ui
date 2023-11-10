import styled from "styled-components";
import {Col, FormControl, Row, Spinner} from "react-bootstrap";
import FormLabel from "../form/FormLabel";
import { iAddressResult } from "./iAddressAutoComplete";
import SynLuCountrySelector from '../Community/SynLuCountrySelector';
import SynLuStateSelector from '../Community/SynLuStateSelector';
import {useEffect, useState} from 'react';
import SynLuCountryService from '../../services/Synergetic/Lookup/SynLuCountryService';
import Toaster from '../../services/Toaster';
import {OP_LIKE} from '../../helper/ServiceHelper';
import {dangerRed} from '../../AppWrapper';

type iAddressManualInputPanel = {
  isDisabled?: boolean;
  className?: string;
  value?: iAddressResult;
  inputProps?: any;
  onChange?: (newValue: iAddressResult) => void;
};

const Wrapper = styled.div`
  border: none !important;
  .row {
    [class^='col']{
      padding-left: 0px;
    }
    [class^='col']:last-child {
      padding-right: 0px;
    }
  }
  
  &.is-invalid {
    .form-control {
      border: 1px ${dangerRed} solid;
    }
  }
`;
const AddressManualInputPanel = ({
  isDisabled,
  className,
  value,
  onChange,
}: iAddressManualInputPanel) => {

  const [isLoading, setIsLoading] = useState(false);
  const [editingAddress, setEditingAddress] = useState<iAddressResult | null>(null);

  useEffect(() => {
    const countryName = `${value?.country || ''}`.trim();
    const countryCode = `${value?.countryCode || ''}`.trim();

    if ((countryName === '' && countryCode === '') || (countryName !== '' && countryCode !== '')) {
      setEditingAddress(value || null);
      return;
    }

    let isCanceled = false;
    setIsLoading(true);
    SynLuCountryService.getAll({
      where: JSON.stringify({
        ActiveFlag: true,
        ...(countryName === '' ? {Code: countryCode} : {Description: {[OP_LIKE]: countryName}}),
      })
    }).then(resp => {
      const countries = resp || [];
      if (countries.length <= 0) {
        return;
      }
      if (countryName === '') {
        // @ts-ignore
        setEditingAddress({
          ...(value || null),
          country: countries[0].Description || '',
        });
        return;
      }
      // @ts-ignore
      setEditingAddress({
        ...(value || null),
        countryCode: countries[0].Code || '',
      });
    }).catch(err => {
      if (isCanceled) { return }
      Toaster.showApiError(err);
    }).finally(() => {
      if (isCanceled) { return }
      setIsLoading(false);
    })


    return () => {
      isCanceled = true;
    }
  }, [value]);

  const handelOnChange = (fieldName: string, newValue: string) => {
    if (!onChange) {
      return;
    }
    // @ts-ignore
    onChange({
      ...(value || {}),
      [fieldName]: `${newValue || ''}`.trim(),
    })
  }

  const getContent = () => {
    if (isLoading === true) {
      return <Spinner animation={'border'} />
    }

    return (
      <>
        <Row>
          <Col>
            <FormLabel label={"Street"} />
            <FormControl
              onChange={event => handelOnChange('street', event.target.value || "")}
              disabled={isDisabled}
              placeholder={'eg: 12 smith street'}
              value={editingAddress?.street || ''}
            />
          </Col>
          <Col md={4} sm={12}>
            <FormLabel label={"Suburb"} />
            <FormControl
              onChange={event => handelOnChange('suburb', `${event.target.value || ""}`.trim().toUpperCase())}
              disabled={isDisabled}
              placeholder={'eg: MENTONE'}
              value={editingAddress?.suburb || ''}
            />
          </Col>
        </Row>
        <Row>
          <Col md={4} sm={12}>
            <FormLabel label={"State"} />
            <SynLuStateSelector
              isDisabled={isDisabled}
              classname={'form-control'}
              values={`${editingAddress?.state || ''}`.trim() === '' ? [] : [`${value?.state || ''}`.trim().toUpperCase()]}
              onSelect={(option) => {
                if (option === null) {
                  return;
                }

                if (Array.isArray(option)) {
                  // @ts-ignore
                  handelOnChange('state', option[0].value || '');
                  return;
                }

                // @ts-ignore
                handelOnChange('state', option.value || '');
                return;

              }}
            />
          </Col>
          <Col md={3} sm={12}>
            <FormLabel label={"Postcode"} />
            <FormControl
              onChange={event => handelOnChange('postcode', event.target.value || "")}
              disabled={isDisabled}
              placeholder={'eg: 3174'}
              value={editingAddress?.postcode || ''}
            />
          </Col>
          <Col md={5} sm={12}>
            <FormLabel label={"Country"} />
            <SynLuCountrySelector
              isDisabled={isDisabled}
              classname={'form-control'}
              values={`${editingAddress?.countryCode || ''}`.trim() === '' ? [] : [`${value?.countryCode || ''}`.trim().toUpperCase()]}
              onSelect={(option) => {
                if (option === null) {
                  // @ts-ignore
                  setEditingAddress({
                    ...(value || {}),
                    country: '',
                    countryCode: undefined,
                  });
                  return;
                }

                if (Array.isArray(option)) {
                  // @ts-ignore
                  const country = option[0].data;

                  // @ts-ignore
                  setEditingAddress({
                    ...(value || {}),
                    country: country?.Description || '',
                    countryCode: country?.Code || '',
                  });
                  return;
                }

                // @ts-ignore
                const country = option.data;
                // @ts-ignore
                setEditingAddress({
                  ...(value || {}),
                  country: country?.Description || '',
                  countryCode: country?.Code || '',
                });
                return;

              }}
            />
          </Col>
        </Row>
      </>
    )
  }

  return (
    <Wrapper className={className}>{getContent()}</Wrapper>
  );
};

export default AddressManualInputPanel;
