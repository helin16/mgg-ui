import Page from "../../layouts/Page";
import { MGGS_MODULE_ID_HOY_CHAT_EMAIL } from "../../types/modules/iModuleUser";
import HOYChatManageAdminPage from "./HOYChatManageAdminPage";
import ExplanationPanel from "../../components/ExplanationPanel";
import {Buffer} from 'buffer';
import {THIRD_PARTY_AUTH_PATH} from '../../helper/SchoolBoxHelper';
import {Button} from 'react-bootstrap';

type iHOYChatManagePage = {
  customUrl: string;
  customFormPath: string;
}
const HOYChatManagePage = ({customUrl, customFormPath}: iHOYChatManagePage) => {
  const getFormUrl = () => {
    const customBaseUrl = new URL(customUrl);
    const url = `${customBaseUrl.protocol}//${customBaseUrl.host}${THIRD_PARTY_AUTH_PATH}/${Buffer.from(customFormPath).toString('base64')}`
    const formUrl = Buffer.from(url).toString('base64');
    return `/modules/remote/${formUrl}`;
  }

  return (
    <Page
      moduleId={MGGS_MODULE_ID_HOY_CHAT_EMAIL}
      AdminPage={HOYChatManageAdminPage}
      title={<h3>HOY Chat Management</h3>}
    >
      <ExplanationPanel
        text={
          <>
            <span>
              This module is designed for <b>Senior</b> school students to submit to their HEAD of YEAR.
            </span>
          </>
        }
      />

      <Button variant="link" href={getFormUrl()} target="_blank">
        You can view the form here.
      </Button>
    </Page>
  );
};

export default HOYChatManagePage;
