import {Button, ButtonProps, Table} from 'react-bootstrap';
import {useState} from 'react';
import PopupModal from '../../../../components/common/PopupModal';
import moment from 'moment-timezone';

type iSchoolDaysPopupBtn = ButtonProps & {
  schoolDays: string[];
}

const SchoolDaysPopupBtn = ({schoolDays, ...rest}: iSchoolDaysPopupBtn) => {
  const [isPopupShowing, setIsPopupShowing] = useState(false);

  const getPopup = () => {
    if (!isPopupShowing) {
      return null;
    }
    return (
      <PopupModal
        header={<b>{schoolDays.length} School Day(s)</b>}
        handleClose={() => setIsPopupShowing(false)}
        show={isPopupShowing}
        size={'lg'}
      >
        <Table>
          <tbody>
          {schoolDays.map(schoolDay => {
            return (
              <tr key={schoolDay}>
                <td>{moment(schoolDay).format('DD MMM YYYY')}</td>
                <td>{moment(schoolDay).format('dddd')}</td>
              </tr>
            )
          })}
          </tbody>
        </Table>
      </PopupModal>
    )
  }

  return (
    <>
      <Button {...rest} onClick={() => setIsPopupShowing(true)}/>
      {getPopup()}
    </>
  )
}

export default SchoolDaysPopupBtn;
