import styled from 'styled-components';
import StudentNumberForecastDashboard from '../StudentNumberForecast/StudentNumberForecastDashboard';

const Wrappers = styled.div`

`;

const BudgetForecastPanel = () => {
  return (
    <Wrappers>
      <h4>BudgetForecastPanel</h4>
      <StudentNumberForecastDashboard showExplanationPanel={false} showFinanceFigures={true} showSumPanels={false}/>
    </Wrappers>
  )
}

export default BudgetForecastPanel;
