import {useState} from 'react';
import {Button, ButtonProps, Table} from 'react-bootstrap';
import iSchoolCensusStudentData from './iSchoolCensusStudentData';
import PopupModal from '../../../../components/common/PopupModal';
import moment from 'moment-timezone';
import CSVExportBtn from '../../../../components/form/CSVExportBtn';
import {FlexContainer} from '../../../../styles';
import SchoolCensusDataExportHelper from './SchoolCensusDataExportHelper';

type iSchoolCensusDataPopupBtn = ButtonProps & {
  records: iSchoolCensusStudentData[];
}


const SchoolCensusDataPopupBtn = ({records, children, ...rest}: iSchoolCensusDataPopupBtn) => {

  const [isShowingPopup, setIsShowingPopup] = useState(false);



  const getPopup = () => {
    if (isShowingPopup !== true) {
      return null;
    }

    return (
      <PopupModal
        dialogClassName={'modal-90w'}
        show={true}
        handleClose={() => setIsShowingPopup(false)}
        title={
          <>
            <FlexContainer className={'with-gap lg-gap'}>
              <h4>{records.length} students:</h4>{' '}
              <CSVExportBtn
                // @ts-ignore
                fetchingFnc={() => new Promise(resolve => {
                  resolve(records)
                })}
                downloadFnc={SchoolCensusDataExportHelper.genCSVFile}
                size={'sm'}
              />
            </FlexContainer>
          </>
        }
      >
        <Table hover striped responsive>
          <thead>
            <tr>
              {SchoolCensusDataExportHelper.titles.map(title => <th key={title}>{title}</th>)}
            </tr>
          </thead>
          <tbody>
          {
            records.map(record => {
              return (
                <tr key={record.ID}>
                  <td>{record.ID}</td>
                  <td>{record.Given1} {record.Surname}</td>
                  <td>{record.yearLevelCode}</td>
                  <td>{record.gender}</td>
                  <td>{moment(record.dateOfBirth).format('DD MMM YYYY')}</td>
                  <td>{record.age}</td>
                  <td>{record.isInternationalStudent === true ? 'Y' : ''}</td>
                  <td>{record.isIndigenous === true ? 'Y' : ''}</td>
                  <td>{record.StudentStatusDescription}{record.isPastStudent === true ? '[PAST]' : ''}</td>
                  <td>{record.visaCode}</td>
                  <td>{record.visaNumber}</td>
                  <td>
                    {`${record.visaExpiryDate || ''}`.trim() === '' ? '' : moment(record.visaExpiryDate).format('DD MMM YYYY')}
                  </td>
                  <td>{moment(record.entryDate).format('DD MMM YYYY')}</td>
                  <td>{`${record.leavingDate || ''}`.trim() === '' ? '' : moment(record.leavingDate).format('DD MMM YYYY')}</td>
                  <td>{`${record.nccdStatusAdjustmentLevel}`.trim() === '' ? '' : `${record.nccdStatusAdjustmentLevel}`}</td>
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
