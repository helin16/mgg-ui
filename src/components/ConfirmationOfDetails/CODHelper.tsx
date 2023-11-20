import ICODDetailsEditPanel, {COD_TAB_STUDENT_DETAILS} from './DetailsPanel/iCODDetailsEditPanel';
import CODStudentDetailsPanel from './DetailsPanel/CODStudentDetailsPanel';

const CODTabSteps = {
  [COD_TAB_STUDENT_DETAILS]: (props: ICODDetailsEditPanel) => (<CODStudentDetailsPanel {...props} />),
}
