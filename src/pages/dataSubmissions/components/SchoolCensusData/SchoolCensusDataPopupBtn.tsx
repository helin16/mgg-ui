import {useState} from 'react';
import {Button, ButtonProps, Table} from 'react-bootstrap';
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
}


const TitleWrapper = styled.div`
  h1, h2, h3, h4, h5 {
    margin-bottom: 0px;
  }
`;

const SchoolCensusDataPopupBtn = ({records, popupTitle, children, ...rest}: iSchoolCensusDataPopupBtn) => {

  const [isShowingPopup, setIsShowingPopup] = useState(false);



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
              <CSVExportBtn
                // @ts-ignore
                fetchingFnc={() => new Promise(resolve => {
                  resolve(records)
                })}
                downloadFnc={SchoolCensusDataExportHelper.genCSVFile}
                size={'sm'}
                variant={'link'}
              />
            </FlexContainer>
          </TitleWrapper>
        }
      >
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
              <th className={'visa'}>Visa</th>
              <th className={'entry-date'}>Entry Date</th>
              <th className={'left-date'}>Left Date</th>
              <th className={'nccd'}>NCCD</th>
            </tr>
          </thead>
          <tbody>
          {
            records.map(record => {
              return (
                <tr key={record.ID}>
                  <td>
                    <div>[{record.ID}]</div>
                    {record.Given1} {record.Surname}
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
                    <div><small><b>{record.visaCode}</b></small></div>
                    <div><small>{record.visaNumber}</small></div>
                    <div>
                      <small>
                        {`${record.visaExpiryDate || ''}`.trim() === '' ? '' : moment(record.visaExpiryDate).format('DD MMM YYYY')}
                      </small>
                    </div>
                  </td>
                  <td>{moment(record.entryDate).format('DD MMM YYYY')}</td>
                  <td>{`${record.leavingDate || ''}`.trim() === '' ? '' : moment(record.leavingDate).format('DD MMM YYYY')}</td>
                  <td>
                    <div>{`${record.nccdStatusCategory}`.trim() === '' ? '' : `${record.nccdStatusCategory}`}</div>
                    <div>{`${record.nccdStatusAdjustmentLevel}`.trim() === '' ? '' : `${record.nccdStatusAdjustmentLevel}`}</div>
                  </td>
                </tr>
              )
            })
          }
          </tbody>
        </Table>
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
