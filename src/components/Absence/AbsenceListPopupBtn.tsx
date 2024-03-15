import {  ButtonProps } from "react-bootstrap";
import iSynVAbsence from "../../types/Synergetic/Absence/iSynVAbsence";
import AbsencesTable from './AbsencesTable';
import PopupBtn from '../common/PopupBtn';

type iAbsencePopupBtn = ButtonProps & {
  absences: iSynVAbsence[];
  popupTitle?: any;
};

const AbsenceListPopupBtn = ({
  popupTitle,
  absences,
  ...props
}: iAbsencePopupBtn) => {
  return (
    <PopupBtn popupProps={{
      title: popupTitle || `List of ${absences.length} Absence(s)`,
      children: <AbsencesTable absences={absences} />
    }} {...props} />
  );
};

export default AbsenceListPopupBtn;
