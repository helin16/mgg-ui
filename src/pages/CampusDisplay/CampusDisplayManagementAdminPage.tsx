import AdminPage, { AdminPageProps } from "../../layouts/AdminPage";
import { MGGS_MODULE_ID_CAMPUS_DISPLAY } from "../../types/modules/iModuleUser";
import AdminPageTabs from "../../layouts/AdminPageTabs";
import CampusDisplayList from "../../components/CampusDisplay/Playlist/CampusDisplayList";
import CampusDisplayLocationList from '../../components/CampusDisplay/DisplayLocation/CampusDisplayLocationList';

const CampusDisplayManagementAdminPage = ({ onNavBack }: AdminPageProps) => {
  return (
    <AdminPage
      onNavBack={onNavBack}
      title={<h3>Campus Display Management - Admin</h3>}
      moduleId={MGGS_MODULE_ID_CAMPUS_DISPLAY}
    >
      <AdminPageTabs
        moduleId={MGGS_MODULE_ID_CAMPUS_DISPLAY}
        extraTabs={[
          {
            key: 'locations',
            title: "Locations",
            component: <CampusDisplayLocationList />,
          },
          {
            key: 'playLists',
            title: "PlayLists",
            component: <CampusDisplayList />,
          }
        ]}
      />
    </AdminPage>
  );
};

export default CampusDisplayManagementAdminPage;
