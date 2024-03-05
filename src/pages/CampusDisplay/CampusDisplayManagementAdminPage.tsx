import AdminPage, { AdminPageProps } from "../../layouts/AdminPage";
import { MGGS_MODULE_ID_CAMPUS_DISPLAY } from "../../types/modules/iModuleUser";
import AdminPageTabs from "../../layouts/AdminPageTabs";
import CampusDisplayList from "../../components/CampusDisplay/Playlist/CampusDisplayList";
import CampusDisplayLocationList from "../../components/CampusDisplay/DisplayLocation/CampusDisplayLocationList";
import React, { useState } from "react";
import iCampusDisplay from "../../types/CampusDisplay/iCampusDisplay";
import PlayListEditPanel from "../../components/CampusDisplay/Playlist/PlayListEditPanel";
import {Button, Col, Row} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';

const CampusDisplayManagementAdminPage = ({ onNavBack }: AdminPageProps) => {
  const [selectedDisplay, setSelectedDisplay] = useState<iCampusDisplay | null>(
    null
  );

  const handleSelectAPlayList = (selected: iCampusDisplay) => {
    setSelectedDisplay(selected.id === selectedDisplay?.id ? null : selected);
  }

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
                    onSelect={playList => handleSelectAPlayList(playList)}
                    onDeleted={() => setSelectedDisplay(null)}
                    narrowMode={selectedDisplay !== null}
                  />
                </Col>
                {selectedDisplay === null ? null : (
                  <Col lg={8}>
                    <PlayListEditPanel
                      className={"playlist-panel"}
                      playList={selectedDisplay}
                      extraBtns={
                        <>
                          <Button
                            variant={"secondary"}
                            size={"sm"}
                            title={"Close"}
                            onClick={() => setSelectedDisplay(null)}
                          >
                            <Icons.X />
                          </Button>
                        </>
                      }
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
