import { useEffect, useState } from "react";
import SynAddressService from "../../services/Synergetic/SynAddressService";
import Toaster from "../../services/Toaster";
import { Button, Spinner } from "react-bootstrap";
import iSynAddress from "../../types/Synergetic/iSynAddress";
import AddressAutoComplete from "../Address/AddressAutoComplete";
import styled from "styled-components";
import { FlexContainer } from "../../styles";
import * as Icons from "react-bootstrap-icons";
import FormLabel from "../form/FormLabel";
import AddressManualInputPanel from "../Address/AddressManualInputPanel";
import { iAddressResult } from "../Address/iAddressAutoComplete";

type iSynAddressObj = {
  Address1: string;
  Address2?: string;
  Address3?: string;
  Suburb: string;
  State: string;
  Country: string;
  PostCode: string;
  CountryCode?: string;
  Phone?: string;
  Fax?: string;
};

type iSynAddressEditor = {
  isDisabled?: boolean;
  className?: string;
  inputProps?: string;
  addressObj?: {
    postal: iSynAddressObj;
    home?: iSynAddressObj;
    HomeAddressSameFlag: boolean;
  };
  addressId?: string | number;
  onChange?: (newAddress: iSynAddress) => void;
};

const Wrapper = styled.div``;

const SynAddressEditor = ({
  addressId,
  isDisabled,
  className,
  addressObj,
  inputProps,
  onChange
}: iSynAddressEditor) => {
  const [isLoading, setIsLoading] = useState(false);
  const [addressFromDB, setAddressFromDB] = useState<iSynAddress | null>(null);
  const [editingAddress, setEditingAddress] = useState<iSynAddress | null>(
    null
  );
  const [isManualInput, setIsManualInput] = useState(false);

  useEffect(() => {
    if (!addressId) {
      setEditingAddress(null);
      return;
    }
    let isCanceled = false;
    setIsLoading(true);
    SynAddressService.getAll({
      where: JSON.stringify({ AddressID: addressId }),
      perPage: 1,
      currentPage: 1,
      include: "Country,HomeCountry"
    })
      .then(resp => {
        if (isCanceled) {
          return;
        }
        const addresses = resp.data || [];
        const address = addresses.length > 0 ? addresses[0] : null;
        setAddressFromDB(address);
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
  }, [addressId]);

  useEffect(() => {
    // @ts-ignore
    setEditingAddress({
      ...(addressFromDB || {}),
      HomeAddressSameFlag: addressObj?.HomeAddressSameFlag || false,
      Address1: addressObj?.postal.Address1 || "",
      Address2: addressObj?.postal.Address2 || "",
      Address3: addressObj?.postal.Address3 || "",
      Suburb: addressObj?.postal.Suburb || "",
      State: addressObj?.postal.State || "",
      PostCode: addressObj?.postal.PostCode || "",
      CountryCode:
        addressObj?.postal.CountryCode || addressFromDB?.CountryCode || "",
      PhoneAlt: addressObj?.postal.Phone || "",
      Fax: addressObj?.postal.Fax || "",

      HomeAddress1: addressObj?.home?.Address1 || "",
      HomeAddress2: addressObj?.home?.Address2 || "",
      HomeAddress3: addressObj?.home?.Address3 || "",
      HomeSuburb: addressObj?.home?.Suburb || "",
      HomeState: addressObj?.home?.State || "",
      HomePostCode: addressObj?.home?.PostCode || "",
      HomeCountryCode:
        addressObj?.home?.CountryCode || addressFromDB?.HomeCountryCode || "",
      PhoneActual: addressObj?.home?.Phone || ""
    });
  }, [addressFromDB, addressObj]);

  const handleChange = (isForHome = false) => (newAddr: iAddressResult) => {
    const addressObj = {
      ...(editingAddress || {}),
      ...(isForHome !== true
        ? {
            Address1: newAddr.street || "",
            Suburb: newAddr.suburb || "",
            State: newAddr.state || "",
            PostCode: newAddr.postcode || "",
            CountryCode: newAddr.countryCode || "",
          }
        : {
            HomeAddress1: newAddr.street || "",
            HomeSuburb: newAddr.suburb || "",
            HomeState: newAddr.state || "",
            HomePostCode: newAddr.postcode || "",
            HomeCountryCode: newAddr.countryCode || "",
          })
    };
    if (!onChange) {
      // @ts-ignore
      setEditingAddress(addressObj);
      return;
    }
    // @ts-ignore
    onChange(addressObj);
  };

  const showHomeAddress = () => {
    if (isDisabled === true) {
      return;
    }
    const newValue = {
      ...editingAddress,
      HomeAddressSameFlag:
        editingAddress?.HomeAddressSameFlag === true ? false : true,
      HomeAddress1: editingAddress?.Address1 || "",
      HomeSuburb: editingAddress?.HomeSuburb || "",
      HomeState: editingAddress?.HomeState || "",
      HomePostCode: editingAddress?.HomePostCode || '',
      HomeCountryCode: editingAddress?.HomeCountryCode || "",
    };
    if (!onChange) {
      // @ts-ignore
      setEditingAddress(newValue);
      return;
    }

    // @ts-ignore
    onChange(newValue);

  };

  const getSameCheckBox = () => {
    if (editingAddress?.HomeAddressSameFlag === true) {
      return (
        <Icons.CheckSquareFill
          className={`text-success ${
            isDisabled === true ? "" : "cursor-pointer"
          }`}
          onClick={showHomeAddress}
        />
      );
    }
    return (
      <Icons.Square
        onClick={showHomeAddress}
        className={isDisabled === true ? "" : "cursor-pointer"}
      />
    );
  };

  const getAddressInputBox = (isForHome = false) => {
    const results = SynAddressService.getAddressObjFromSynAddress(
      editingAddress
    );
    const addressObj = isForHome === true ? results?.home : results?.postal;

    if (isManualInput === true) {
      return (
        <AddressManualInputPanel
          isDisabled={isDisabled}
          className={className}
          inputProps={inputProps}
          value={addressObj}
          onChange={handleChange(isForHome)}
        />
      );
    }
    return (
      <AddressAutoComplete
        inputProps={inputProps}
        isDisabled={isDisabled}
        className={className}
        value={{
          label: SynAddressService.convertAddressObjToStr(addressObj || null),
          value: ""
        }}
        onSelect={handleChange(isForHome)}
      />
    );
  };

  const getHomeAddressBox = () => {
    if (editingAddress?.HomeAddressSameFlag === true) {
      return null;
    }
    return (
      <div className={"home-address-wrapper"}>
        <FormLabel label={"Home Address"} />
        {getAddressInputBox(true)}
      </div>
    );
  };

  if (isLoading) {
    return <Spinner animation={"border"} />;
  }

  return (
    <Wrapper>
      {getAddressInputBox(false)}
      <FlexContainer
        className={
          "space-above space-sm align-items-center justify-content-between flex-wrap"
        }
      >
        <FlexContainer className={"with-gap lg-gap align-items-center"}>
          <small
            onClick={showHomeAddress}
            className={isDisabled === true ? "" : "cursor-pointer"}
          >
            Same for home addr.?
          </small>
          {getSameCheckBox()}
        </FlexContainer>
        <div>
          {isDisabled === true ? null : (
            <Button
              variant={"link"}
              size={"sm"}
              onClick={() => setIsManualInput(!isManualInput)}
            >
              {isManualInput === true
                ? `Back to auto search?`
                : `Can't find your address?`}
            </Button>
          )}
        </div>
      </FlexContainer>
      {getHomeAddressBox()}
    </Wrapper>
  );
};

export default SynAddressEditor;
