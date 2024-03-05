import AdminPage, { AdminPageProps } from "../../layouts/AdminPage";
import { MGGS_MODULE_ID_CAMPUS_DISPLAY } from "../../types/modules/iModuleUser";
import AdminPageTabs from "../../layouts/AdminPageTabs";
import CampusDisplayList from "../../components/CampusDisplay/Playlist/CampusDisplayList";
import CampusDisplayLocationList from "../../components/CampusDisplay/DisplayLocation/CampusDisplayLocationList";
import React, { useState } from "react";
import iCampusDisplay from "../../types/CampusDisplay/iCampusDisplay";
import PlayListEditPanel from "../../components/CampusDisplay/Playlist/PlayListEditPanel";
import {Col, Row} from 'react-bootstrap';

const CampusDisplayManagementAdminPage = ({ onNavBack }: AdminPageProps) => {
  const [selectedDisplay, setSelectedDisplay] = useState<iCampusDisplay | null>(
    null
  );

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
            key: "locations",
            title: "Locations",
            component: <CampusDisplayLocationList />
          },
          {
            key: "playLists",
            title: "PlayLists",
            component: (
              <Row>
                <Col lg={selectedDisplay !== null ? 4 : 12}>
                  <CampusDisplayList
                    onSelect={playList => setSelectedDisplay(playList)}
                    onDeleted={() => setSelectedDisplay(null)}
                    narrowMode={selectedDisplay !== null}
                  />
                </Col>
                {selectedDisplay === null ? null : (
                  <Col lg={8}>
                    <PlayListEditPanel
                      className={"playlist-panel"}
                      playList={selectedDisplay}
                    />
                  </Col>
                )}
              </Row>
            )
          }
        ]}
      />
    </AdminPage>
  );
};

export default CampusDisplayManagementAdminPage;
