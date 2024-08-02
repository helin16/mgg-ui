import {useState} from 'react';
import {Button, ButtonProps, Tab, Table, Tabs} from 'react-bootstrap';
import iSchoolCensusStudentData from './iSchoolCensusStudentData';
import PopupModal from '../../../../components/common/PopupModal';
import moment from 'moment-timezone';
import CSVExportBtn from '../../../../components/form/CSVExportBtn';
import {FlexContainer} from '../../../../styles';
import SchoolCensusDataExportHelper from './SchoolCensusDataExportHelper';
import styled from 'styled-components';

type iSchoolCensusDataPopupBtn = ButtonProps & {
  records: iSchoolCensusStudentData[];
  popupTitle?: any;
  exportBtn?: any;
  showExtraFn?: (isTitleRow: boolean, record?: iSchoolCensusStudentData) => any;
  isForNCCD?: boolean;
  totalStudents?: iSchoolCensusStudentData[];
}


const TitleWrapper = styled.div`
  h1, h2, h3, h4, h5 {
    margin-bottom: 0px;
  }
`;

const SchoolCensusDataPopupBtn = ({records, popupTitle, children, showExtraFn, exportBtn, isForNCCD = false, totalStudents, ...rest}: iSchoolCensusDataPopupBtn) => {

  const [isShowingPopup, setIsShowingPopup] = useState(false);


  const getNCCDSummary = () => {
    if(isForNCCD !== true){
      return getTable(records);
    }
    const studentWithDisabledFlagButNoDetails = (totalStudents || []).filter(student => student.DisabilityFlag === true && `${student.nccdStatusAdjustmentLevel}`.trim() === '');
    const studentWithDetailsButNoFlag = (totalStudents || []).filter(student => student.DisabilityFlag !== true && `${student.nccdStatusAdjustmentLevel}`.trim() !== '');


    return (
      <Tabs>
        <Tab eventKey={'Students With Disability Details'} title={'Students With Disability Details'}>
          {getTable(records)}
        </Tab>

        {studentWithDetailsButNoFlag.length > 0 && (
          <Tab eventKey={'Need to fix Disabled Flag'} title={<span className={'text-danger'}>Needed to fix Disabled Flag: {studentWithDetailsButNoFlag.length}</span>}>
            {getTable(studentWithDetailsButNoFlag)}
          </Tab>
        )}

        {studentWithDisabledFlagButNoDetails.length > 0 && (
          <Tab eventKey={'Need to fix Disability Details'} title={<span className={'text-danger'}>Needed to fix Disability Details: {studentWithDisabledFlagButNoDetails.length} </span>}>
            {getTable(studentWithDisabledFlagButNoDetails)}
          </Tab>
        )}

      </Tabs>
    )
  }

  const getTable = (showingRecords: iSchoolCensusStudentData[]) => {
    return (
      <Table hover striped responsive>
        <thead>
        <tr>
          <th className={'student'}>Student</th>
          <th className={'year-level'}>Year Lvl.</th>
          <th className={'gender'}>Gen.</th>
          <th className={'dob'}>D.O.B.</th>
          <th className={'age'}>Age</th>
          <th className={'is-international'}>Inter?</th>
          <th className={'is-indigenous'}>Ind.?</th>
          <th className={'status'}>Status</th>
          <th className={'country-of-birth'}>Country Of Birth</th>
          <th className={'nationality'}>Nationality</th>
          <th className={'passport'}>Passport</th>
          <th className={'visa'}>Visa</th>
          <th className={'entry-date'}>Entry Date</th>
          <th className={'left-date'}>Left Date</th>
          <th className={'disabled-flag'}>Disabled?</th>
          <th className={'nccd'}>NCCD</th>
          {showExtraFn ? <th className={'extra'}>{showExtraFn(true)}</th> : null}
        </tr>
        </thead>
        <tbody>
        {
          showingRecords.map(record => {
            const hasDisabledDetails = `${record.nccdStatusAdjustmentLevel}`.trim() !== '';
            return (
              <tr key={record.ID} className={hasDisabledDetails !== record.DisabilityFlag && isForNCCD === true ? 'bg-warning' : ''}>
                <td>
                  <div>[{record.ID}]</div>
                  {record.Surname}, {record.Given1}
                </td>
                <td>{record.yearLevelCode}</td>
                <td>{record.gender}</td>
                <td>{moment(record.dateOfBirth).format('DD MMM YYYY')}</td>
                <td>{record.age}</td>
                <td>{record.isInternationalStudent === true ? 'Y' : ''}</td>
                <td>{record.isIndigenous === true ? 'Y' : ''}</td>
                <td>
                  <div>{record.StudentStatusDescription}</div>
                  {record.isPastStudent === true ? <small>[PAST]</small> : ''}
                </td>
                <td>
                  {record.studentCountryOfBirth || ''}
                </td>
                <td>
                  <div>{record.studentNationality}</div>
                  <div>{record.studentNationality2}</div>
                </td>
                <td>
                  <div><small><b>{record.studentPassportNo}</b></small></div>
                  <div><small>{`${record.studentPassportIssuedDate || ''}`.trim() === '' ? '' : <>Iss: {moment(record.studentPassportIssuedDate).format('DD MMM YYYY')}</>}</small></div>
                  <div><small>{`${record.studentPassportExpiryDate || ''}`.trim() === '' ? '' : <>Exp: {moment(record.studentPassportExpiryDate).format('DD MMM YYYY')}</>}</small></div>
                  <div><small>{`${record.studentPassportIssueCountry || ''}`.trim() === '' ? '' : <>Country: {record.studentPassportIssueCountry || ''}</>}</small></div>
                </td>
                <td>
                  <div><small><b>{record.visaCode}</b></small></div>
                  <div><small>{record.visaNumber}</small></div>
                  <div>
                    <small>
                      {`${record.visaIssueDate || ''}`.trim() === '' ? '' : <>Iss: {moment(record.visaIssueDate).format('DD MMM YYYY')}</>}
                    </small>
                  </div>
                  <div>
                    <small>
                      {`${record.visaExpiryDate || ''}`.trim() === '' ? '' : <>Exp: {moment(record.visaExpiryDate).format('DD MMM YYYY')}</>}
                    </small>
                  </div>
                </td>
                <td>{moment(record.entryDate).format('DD MMM YYYY')}</td>
                <td>{`${record.leavingDate || ''}`.trim() === '' ? '' : moment(record.leavingDate).format('DD MMM YYYY')}</td>
                <td className={'text-center'}>{record.DisabilityFlag === true ? 'Y' : ''}</td>
                <td>
                  <div>{`${record.nccdStatusCategory}`.trim() === '' ? '' : `${record.nccdStatusCategory}`}</div>
                  <div>{`${record.nccdStatusAdjustmentLevel}`.trim() === '' ? '' : `${record.nccdStatusAdjustmentLevel}`}</div>
                </td>
                {showExtraFn ? <td className={'extra'}>{showExtraFn(false, record)}</td> : null}
              </tr>
            )
          })
        }
        </tbody>
      </Table>
    )
  }

  const getPopup = () => {
    if (isShowingPopup !== true) {
      return null;
    }

    return (
      <PopupModal
        dialogClassName={'modal-90w'}
        size={'lg'}
        show={true}
        handleClose={() => setIsShowingPopup(false)}
        title={
          <TitleWrapper>
            <FlexContainer className={'with-gap lg-gap align-items end'}>
              {popupTitle || <h4>{records.length} students:</h4>}
              {exportBtn || (
                <CSVExportBtn
                  // @ts-ignore
                  fetchingFnc={() => new Promise(resolve => {
                    resolve(records)
                  })}
                  downloadFnc={SchoolCensusDataExportHelper.genCSVFile}
                  size={'sm'}
                  variant={'link'}
                />
              )}
            </FlexContainer>
          </TitleWrapper>
        }
      >
        {getNCCDSummary()}
      </PopupModal>
    )
  }

  return (
    <>
      <Button {...rest} onClick={() => setIsShowingPopup(true)}>{children}</Button>
      {getPopup()}
    </>
  )
}

export default SchoolCensusDataPopupBtn;
