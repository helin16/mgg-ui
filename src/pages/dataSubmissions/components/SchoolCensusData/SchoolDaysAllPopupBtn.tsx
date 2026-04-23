import {Button, ButtonProps, Table} from 'react-bootstrap';
import {useEffect, useState} from 'react';
import PopupModal from '../../../../components/common/PopupModal';
import moment from 'moment-timezone';
import MathHelper from '../../../../helper/MathHelper';
import {iSchoolDay} from '../../../../services/Synergetic/SynFileSemesterService';

type iSchoolDaysAllPopupBtn = ButtonProps & {
  days: iSchoolDay[];
}

const SchoolDaysAllPopupBtn = ({days, ...rest}: iSchoolDaysAllPopupBtn) => {
  const [isPopupShowing, setIsPopupShowing] = useState(false);
  const [schoolDays, setSchoolDays] = useState<string[]>([]);

  useEffect(() => {
    setSchoolDays(days.filter(day=> day.isSchoolDay === true).map(day => day.date))
  }, [days])

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
          {days.map((day, index) => {
            const schoolDayIndex = schoolDays.indexOf(day.date);
            return (
              <tr key={day.date} className={`${day.isWeekEnd ? 'bg-light' : ''}`}>
                <td>{schoolDayIndex < 0 ? '' : `Day ${MathHelper.add(schoolDays.indexOf(day.date), 1)}`}</td>
                <td>{moment(day.date).format('DD MMM YYYY')}</td>
                <td>{moment(day.date).format('dddd')}</td>
                <td>{day.comments}</td>
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

export default SchoolDaysAllPopupBtn;
