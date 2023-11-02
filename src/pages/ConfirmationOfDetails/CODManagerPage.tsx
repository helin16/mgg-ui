import Page from '../../layouts/Page';
import {MGGS_MODULE_ID_COD} from '../../types/modules/iModuleUser';
import CODManagerAdminPage from './CODManagerAdminPage';
import ConfirmationOfDetailsListPanel from '../../components/ConfirmationOfDetails/ConfirmationOfDetailsListPanel';

const CODManagerPage = () => {
  return (
    <Page
      title={<h3>C.O.D. Manager - Responses</h3>}
      moduleId={MGGS_MODULE_ID_COD}
      AdminPage={CODManagerAdminPage}
    >
      <ConfirmationOfDetailsListPanel />
    </Page>
  )
}

export default CODManagerPage;
