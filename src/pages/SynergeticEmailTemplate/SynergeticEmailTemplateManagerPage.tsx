import Page from "../../layouts/Page";
import SynergeticEmailTemplateList from "./components/SynergeticEmailTemplateList";
import SynergeticEmailTemplateManagerAdminPage from "./SynergeticEmailTemplateManagerAdminPage";
import { MGGS_MODULE_ID_SYN_EMAIL_TEMPLATE } from "../../types/modules/iModuleUser";

const SynergeticEmailTemplateManagerPage = () => {
  return (
    <Page
      title={<h3>Synergetic Email Template Manager</h3>}
      AdminPage={SynergeticEmailTemplateManagerAdminPage}
      moduleId={MGGS_MODULE_ID_SYN_EMAIL_TEMPLATE}
    >
      <SynergeticEmailTemplateList />
    </Page>
  );
};

export default SynergeticEmailTemplateManagerPage;
