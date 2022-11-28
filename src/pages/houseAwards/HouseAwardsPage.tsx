import HouseAwardEventTypes from './components/HouseAwardEventTypes';
import React, {useState} from 'react';
import iHouseAwardEventType from '../../types/HouseAwards/iHouseAwardEventType';
import iSynLuHouse from '../../types/Synergetic/iSynLuHouse';
import HouseAwardScoreBoard from './components/HouseAwardScoreBoard';
import {MODULE_ID_HOUSE_AWARDS} from '../../types/modules/iModuleUser';
import ModuleAdminBtn from '../../components/module/ModuleAdminBtn';
import styled from 'styled-components';
import HouseAwardAdminPage from './HouseAwardAdminPage';

const Wrapper = styled.div`
  .head-title {
    text-align: center;
    border-bottom: 1px #dedede solid;
    padding: 4px 0 12px 0;
    
    .admin-btn {
      float: right;
    }
  }
`
const HouseAwardsPage = () => {
  const [selectedHouseAwardEventType, setSelectedHouseAwardEventType] = useState<iHouseAwardEventType | null>(null);
  const [selectedLuHouse, setSelectedLuHouse] = useState<iSynLuHouse | null>(null);
  const [viewingAdmin, setViewingAdmin] = useState(false);

  if (viewingAdmin) {
    return <HouseAwardAdminPage onCancel={() => setViewingAdmin(false)} />
  }

  if (!selectedHouseAwardEventType || !selectedLuHouse) {
    return (
      <Wrapper>
        <HouseAwardEventTypes
          header={
            <h4 className={'head-title'}>
              House Awards
              <ModuleAdminBtn moduleId={MODULE_ID_HOUSE_AWARDS} className={'admin-btn'} onClick={() => setViewingAdmin(true)}/>
            </h4>
          }
          onSelect={(type: iHouseAwardEventType, luHouse: iSynLuHouse) => {
            setSelectedHouseAwardEventType(type)
            setSelectedLuHouse(luHouse)
          }}
        />
      </Wrapper>
    );
  }

  return(
    <Wrapper>
      <HouseAwardScoreBoard
        house={selectedLuHouse}
        type={selectedHouseAwardEventType}
        onCancel={() => {
          setSelectedHouseAwardEventType(null)
          setSelectedLuHouse(null)
        }}
      />
    </Wrapper>
  );
}

export default HouseAwardsPage
