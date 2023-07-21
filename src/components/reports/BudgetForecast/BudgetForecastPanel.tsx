import styled from 'styled-components';
import StudentNumberForecastDashboard from '../StudentNumberForecast/StudentNumberForecastDashboard';

const Wrappers = styled.div`

`;

const BudgetForecastPanel = () => {
  return (
    <Wrappers>
      <StudentNumberForecastDashboard showFinanceFigures={true} showSumPanels={false}/>
    </Wrappers>
  )
}

export default BudgetForecastPanel;
