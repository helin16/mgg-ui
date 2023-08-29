import {useState} from 'react';
import moment from 'moment-timezone';
import styled from 'styled-components';
import BTGLListPanel from './components/BTGLListPanel';
import iSynGeneralLedger from '../../types/Synergetic/Finance/iSynGeneralLedager';
import BTGLDetailsPage from './BTGLDetailsPage';
import MathHelper from '../../helper/MathHelper';
import {iBTAdminOptions} from './components/admin/BTAdminOptionsPanel';
import BTAdminPage from './BTAdminPage';

const initialYear = moment().year();
const Wrapper = styled.div`
  .year-selector {
    font-size: 12px;
    [class$='-control'] {
      min-height: auto;
      [class$='-indicatorContainer'] {
        padding-top: 0px;
        padding-bottom: 0px;
      }
    }
  }
`;
const BudgetTrackerPage = () => {
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedGL, setSelectedGL] = useState<iSynGeneralLedger | null>( null);
  const [showingAdminPageModule, setShowingAdminPageModule] = useState<iBTAdminOptions | null>(null);

  const reset = () => {
    setSelectedGL(null);
    setSelectedYear(initialYear);
    setShowingAdminPageModule(null);
  }

  const getContent = () => {
    const adminModule = `${showingAdminPageModule || ''}`.trim();
    if (adminModule !== '') {
      return <BTAdminPage
        onNavBack={()=> reset()}
        setShowingAdminPageModule={setShowingAdminPageModule}
        adminPageModule={showingAdminPageModule}
      />
    }

    if (selectedGL !== null) {
      return <BTGLDetailsPage
        gl={selectedGL}
        selectedYear={MathHelper.add(selectedYear, 1)}
        onNavBack={()=> reset()}
      />
    }
    return (
      <BTGLListPanel
        selectedYear={selectedYear}
        onChangeYear={(newYear) => setSelectedYear(newYear)}
        onSelectGL={(gl) => setSelectedGL(gl)}
        setShowingAdminPageModule={(module) => setShowingAdminPageModule(module)}
      />
    )
  }

  return (
    <Wrapper>
      {getContent()}
    </Wrapper>
  )
};

export default BudgetTrackerPage;
