import styled from "styled-components";
import GoogleMapService from "../../services/GoogleMapService";
import { useEffect, useRef, useState } from "react";
import Toaster from "../../services/Toaster";
import moment from "moment-timezone";
import iAddressAutoComplete from './iAddressAutoComplete';

const Wrapper = styled.div``;

const GoogleAddressAutoComplete = ({
  isDisabled,
  className,
  value,
  onSelect
}: iAddressAutoComplete) => {
  const [, setIsLoading] = useState(false);
  const [inputHTMLID] = useState(
    `app-gm-input-${moment().unix()}-${Math.random()}`
  );
  const scriptLoaded = useRef(false);
  const [scriptId] = useState(
    `app-google-map-js-${moment().unix()}-${Math.random()}`
  );

  const getValueFromGoogleAddrComponents = (components: google.maps.GeocoderAddressComponent[], lookingForType: string) => {
    const type = `${lookingForType}`.trim().toUpperCase();
    const comps = components.filter(comp => comp.types.map(type => `${type}`.trim().toUpperCase()).indexOf(type) >= 0);
    if (comps.length <= 0) {
      return '';
    }
    return comps[0].long_name;
  }

  useEffect(() => {
    if (scriptLoaded.current === true) {
      return;
    }

    let isCanceled = false;
    setIsLoading(true);
    GoogleMapService.getApiKey()
      .then(resp => {
        if (isCanceled) {
          return;
        }
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${resp.key}&libraries=places`;
        script.id = scriptId;
        script.async = true;
        script.onload = () => {
          // The script has loaded; update the context to indicate it's loaded.
          scriptLoaded.current = true;
          const inputBox = document.getElementById(inputHTMLID);
          if (!inputBox) {
            return;
          }
          // @ts-ignore
          const autocomplete = new google.maps.places.Autocomplete(inputBox, {
            componentRestrictions: { country: "AU" } // 'AU' is the country code for Australia
          });

          // Define a callback function to handle place selection
          autocomplete.addListener("place_changed", function() {
            const place = autocomplete.getPlace();
            // console.log("Place selected:", place);
            onSelect && onSelect({
              placeId: place.place_id,
              street: `${getValueFromGoogleAddrComponents(place.address_components || [], 'street_number')} ${getValueFromGoogleAddrComponents(place.address_components || [], 'street_address')}`.trim(),
              suburb: `${getValueFromGoogleAddrComponents(place.address_components || [], 'sublocality')}`.trim(),
              country: `${getValueFromGoogleAddrComponents(place.address_components || [], 'country')}`.trim(),
              state: `${getValueFromGoogleAddrComponents(place.address_components || [], 'sublocality')}`.trim(),
              postcode: `${getValueFromGoogleAddrComponents(place.address_components || [], 'postal_code')}`.trim(),
            });
          });
        };
        document.body.appendChild(script);
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
      // Cleanup if necessary
      if (document.getElementById(scriptId)) {
        // @ts-ignore
        document.body.removeChild(document.getElementById(scriptId));
      }
    };
  }, []);

  return (
    <Wrapper>
      <input
        type="text"
        id={inputHTMLID}
        placeholder="Enter a location"
        className={className || "form-control"}
        disabled={isDisabled}
      />
    </Wrapper>
  );
};

export default GoogleAddressAutoComplete;
