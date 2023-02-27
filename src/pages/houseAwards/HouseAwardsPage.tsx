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
`;

type iState = {
  selectedLuHouse: iSynLuHouse | null;
  selectedHouseAwardEventType: iHouseAwardEventType | null;
}
const initial: iState = {
  selectedHouseAwardEventType: null,
  selectedLuHouse: null,
}
const HouseAwardsPage = () => {
  const [viewingAdmin, setViewingAdmin] = useState(false);
  const [state, setState] = useState(initial);

  if (viewingAdmin) {
    return <HouseAwardAdminPage onCancel={() => setViewingAdmin(false)} />
  }

  if (!state.selectedHouseAwardEventType || !state.selectedLuHouse) {
    return (
      <Wrapper>
        <HouseAwardEventTypes
          header={
            <h4 className={'head-title'}>
              House Awards
              <ModuleAdminBtn moduleId={MODULE_ID_HOUSE_AWARDS} className={'admin-btn'} onClick={() => setViewingAdmin(true)}/>
            </h4>
          }
          onSelect={(type: iHouseAwardEventType, luHouse: iSynLuHouse) => setState({
            selectedLuHouse: luHouse,
            selectedHouseAwardEventType: type,
          })}
        />
      </Wrapper>
    );
  }

  return(
    <Wrapper>
      <HouseAwardScoreBoard
        house={state.selectedLuHouse}
        type={state.selectedHouseAwardEventType}
        onCancel={() => setState(initial)}
      />
    </Wrapper>
  );
}

export default HouseAwardsPage
