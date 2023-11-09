import SynAddressEditor from "../../Community/SynAddressEditor";
import { iCODAddressResponse } from "../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse";
import { SYN_COUNTRY_NAME_AUSTRALIA } from "../../../types/Synergetic/Lookup/iSynLuCountry";
import SynAddressService from '../../../services/Synergetic/SynAddressService';

type iCODAddressEditor = {
  codeRespAddr?: iCODAddressResponse;
  synAddressId?: string | number | null;
  isDisabled?: boolean;
  className?: string;
  inputProps?: any;
  onChange?: (address: iCODAddressResponse) => void;
};
const CODAddressEditor = ({
  synAddressId,
  isDisabled,
  className,
  codeRespAddr,
  onChange
}: iCODAddressEditor) => {
  if (!synAddressId) {
    return null;
  }

  return (
    <SynAddressEditor
      addressId={synAddressId}
      isDisabled={isDisabled}
      className={className}
      onChange={(newAddress) => {
        if (onChange) {
          const addressObj = SynAddressService.getAddressObjFromSynAddress(newAddress);
          onChange({
            homeAndPostalSame: newAddress.HomeAddressSameFlag === true,
            postal: {
              full: SynAddressService.convertAddressObjToStr(addressObj?.postal || null),
              // @ts-ignore
              object: addressObj?.postal,
            },
            home: {
              full: SynAddressService.convertAddressObjToStr(addressObj?.home || null),
              // @ts-ignore
              object: addressObj?.home,
            }
          })
        }
      }}
      addressObj={{
        HomeAddressSameFlag: codeRespAddr?.homeAndPostalSame === true,
        postal: {
          Country: SYN_COUNTRY_NAME_AUSTRALIA,
          Address1: codeRespAddr?.postal.object.street || "",
          Suburb: codeRespAddr?.postal.object.suburb || "",
          PostCode: codeRespAddr?.postal.object.postcode || "",
          State: codeRespAddr?.postal.object.state || "",
        },
        home: {
          Country: SYN_COUNTRY_NAME_AUSTRALIA,
          Address1: codeRespAddr?.home.object.street || "",
          Suburb: codeRespAddr?.home.object.suburb || "",
          PostCode: codeRespAddr?.home.object.postcode || "",
          State: codeRespAddr?.home.object.state || "",
        }
      }}
    />
  );
};

export default CODAddressEditor;
