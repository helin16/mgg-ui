import AutoComplete from "../common/AutoComplete";
import iAddressAutoComplete from "./iAddressAutoComplete";
import axios from "axios";

// @link https://opencagedata.com/dashboard#geocoding

type iSearchResult = {
  annotations: {
    DMS: {
      lat: string;
      lng: string;
    };
    MGRS: string;
    Maidenhead: string;
    Mercator: {
      x: number;
      y: number;
    };
    OSM: {
      edit_url: string;
      note_url: string;
      url: string;
    };
    UN_M49: {
      regions: {
        ASIA: string;
        EASTERN_ASIA: string;
        TW: string;
        WORLD: string;
      };
      statistical_groupings: string[];
    };
    callingcode: number;
    flag: string;
    geohash: string;
    qibla: number;
    roadinfo: {
      drive_on: string;
      road: string;
      road_type: string;
      speed_in: string;
    };
    sun: {
      rise: {
        apparent: number;
        astronomical: number;
        civil: number;
        nautical: number;
      };
      set: {
        apparent: number;
        astronomical: number;
        civil: number;
        nautical: number;
      };
    };
    timezone: {
      name: string;
      now_in_dst: boolean;
      offset_sec: number;
      offset_string: string;
      short_name: string;
    };
    what3words: {
      words: string;
    };
  };
  bounds: {
    northeast: {
      lat: number;
      lng: number;
    };
    southwest: {
      lat: number;
      lng: number;
    };
  };
  components: {
    "ISO_3166-1_alpha-2": string;
    "ISO_3166-1_alpha-3": string;
    "ISO_3166-2": string[];
    _category: string;
    _type: string;
    city_district: string;
    continent: string;
    country: string;
    country_code: string;
    county: string;
    hamlet: string;
    road: string;
    road_type: string;
    town: string;
    house_number?: string;
    state_code?: string;
    suburb?: string;
    postcode?: string;
  };
  confidence: number;
  formatted: string;
  geometry: {
    lat: number;
    lng: number;
  };
};

const OpenCageAddressAutoComplete = ({
  value,
  onSelect,
  allowClear,
  placeHolder,
  postpend,
  isDisabled,
  inputProps,
  className,
}: iAddressAutoComplete) => {
  const handleSearchFn = (searchText: string) => {
    const searchTxt = `${searchText || ""}`.trim();
    if (searchTxt === "") {
      return new Promise(() => []);
    }

    return axios
      .get(`https://api.opencagedata.com/geocode/v1/json`, {
        params: {
          q: searchTxt,
          add_request: 1,
          address_only: 1,
          countrycode: "au",
          roadinfo: 0,
          key: "95d56b88d1e94bb48986b8d124120901"
        }
      })
      .then(resp => resp.data || {})
      .then(resp => resp.results || []);
  };

  const concertToOption = (result: iSearchResult) => {
    return {
      label: result.formatted,
      data: result,
      value: result.formatted
    };
  };

  const renderOptionItem = (options: any[]) => {
    return options.map(option => concertToOption(option));
  };

  return (
    <AutoComplete
      isDisabled={isDisabled}
      className={className}
      placeholder={placeHolder}
      handleSearchFn={handleSearchFn}
      value={value}
      renderOptionItemFn={renderOptionItem}
      allowClear={allowClear}
      onSelected={(option) => {
        // @ts-ignore
        const data: iSearchResult = option.data;
        const addr = data.components;
        onSelect && onSelect({
          street: `${addr.house_number || ''} ${addr.road}`.trim(),
          country: `${addr.country || ''}`.trim(),
          state: `${addr.state_code || ''}`.trim(),
          postcode: `${addr.postcode || ''}`.trim(),
          suburb: `${addr.suburb || ''}`.trim(),
        })
      }}
      postpend={
        postpend
      }
      inputProps={inputProps}
    />
  );
};

export default OpenCageAddressAutoComplete;
