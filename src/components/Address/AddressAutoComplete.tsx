import iAddressAutoComplete from "./iAddressAutoComplete";
import OpenCageAddressAutoComplete from "./OpenCageAddressAutoComplete";

const AddressAutoComplete = (props: iAddressAutoComplete) => {
  const {placeHolder, ...rest} = props;
  return (
    <OpenCageAddressAutoComplete
      {...rest}
      placeHolder={placeHolder || 'Search address...'}
    />
  );
};

export default AddressAutoComplete;
