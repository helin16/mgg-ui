import {FlexContainer} from '../../../../styles';
import FormLabel from '../../../../components/form/FormLabel';
import DateTimePicker from '../../../../components/common/DateTimePicker';
import SynCampusSelector from '../../../../components/student/SynCampusSelector';
import LoadingBtn from '../../../../components/common/LoadingBtn';
import * as Icons from 'react-bootstrap-icons';
import moment from 'moment-timezone';
import {useEffect, useRef, useState} from 'react';
import LocalStorageService from '../../../../services/LocalStorageService';
import SchoolCensusDataExportHelper from './SchoolCensusDataExportHelper';
import Toaster, {TOAST_TYPE_ERROR} from '../../../../services/Toaster';

export type iSchoolCensusDataSearchCriteria = {
  startDate: string;
  endDate: string;
  campusCodes: string[];
}
type iSchoolCensusDataSearchPanel = {
  isLoading?: boolean;
  searchFnc: (criteria: iSchoolCensusDataSearchCriteria) => void;
  btns?: any;
}
const LOCALSTORAGE_START_AND_END_NAME = 'census_period';
const SchoolCensusDataSearchPanel = ({searchFnc, btns, isLoading = false}: iSchoolCensusDataSearchPanel) => {
  const firstInit = useRef(true);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [campusCodes, setCampusCodes] = useState<string[]>(SchoolCensusDataExportHelper.defaultCampusCodes);

  useEffect(() => {
    if (firstInit.current !== true) {
      return;
    }
    const local = LocalStorageService.getItem(LOCALSTORAGE_START_AND_END_NAME);
    setStartDate(local?.startDate || undefined);
    setEndDate(local?.endDate || undefined);
    setCampusCodes(local?.campusCodes || SchoolCensusDataExportHelper.defaultCampusCodes);
    firstInit.current = false;
  }, []);

  useEffect(() => {
    if (firstInit.current === true) {
      return;
    }

    LocalStorageService.setItem(LOCALSTORAGE_START_AND_END_NAME, {
      startDate, endDate, campusCodes
    })
  }, [startDate, endDate, campusCodes]);
  const selectDate = (selected: any, fieldName: string) => {
    const setFunc = (`${fieldName || ''}`.trim() === 'startDate' ? setStartDate: setEndDate);
    if (!selected) {
      setFunc(undefined);
      return;
    }
    const selectedMoment = moment(selected);
    const selectedString = `${selectedMoment.format('YYYY-MM-DD')}T00:00:00Z`;
    setFunc(selectedString);
  }

  const search = () => {
    if (!startDate || `${startDate || ''}`.trim() === '' || !endDate || `${endDate || ''}`.trim() === '') {
      Toaster.showToast(`Please provide both Start and End date for Census Period.`, TOAST_TYPE_ERROR);
      return;
    }
    if (moment(startDate).isSameOrAfter(moment(endDate))) {
      Toaster.showToast(`StartDate needs to be before EndDate`, TOAST_TYPE_ERROR);
      return;
    }

    if (campusCodes.length <= 0) {
      Toaster.showToast(`Select at least one campus`, TOAST_TYPE_ERROR);
      return;
    }
    searchFnc({
      startDate,
      endDate,
      campusCodes,
    });
  }

  return (
    <div className={'search-panel'}>
      <div>Census Reference Period</div>
      <FlexContainer className={'with-gap align-items end justify-content space-between'}>
        <FlexContainer className={'with-gap align-items end'}>
          <div>
            <FormLabel label={'Start'} isRequired/>
            <DateTimePicker
              dateFormat={'DD/MMM/YYYY'}
              timeFormat={false}
              value={startDate}
              allowClear
              onChange={(selected) => selectDate(selected, 'startDate')}
            />
          </div>
          <div>
            <FormLabel label={'End'} isRequired/>
            <DateTimePicker
              allowClear
              timeFormat={false}
              dateFormat={'DD/MMM/YYYY'}
              value={endDate}
              onChange={(selected) => selectDate(selected, 'endDate')}
            />
          </div>
          <div>
            <FormLabel label={'Campuses'} isRequired/>
            <SynCampusSelector
              isMulti
              allowClear={false}
              filterEmptyCodes
              values={campusCodes}
              onSelect={(option) => setCampusCodes(option === null ? SchoolCensusDataExportHelper.defaultCampusCodes : Array.isArray(option) ? (option.length === 0 ? SchoolCensusDataExportHelper.defaultCampusCodes : option.map(opt => `${opt.value}`)) : [`${option?.value}`])}
            />
          </div>
          <div style={{height: '100%'}}>
            <FormLabel label={' '} />
            <LoadingBtn isLoading={isLoading} onClick={() => search()}>
              <Icons.Search /> {' '}
              Search
            </LoadingBtn>
          </div>
        </FlexContainer>
        {btns}
      </FlexContainer>
    </div>
  )
}

export default SchoolCensusDataSearchPanel;
