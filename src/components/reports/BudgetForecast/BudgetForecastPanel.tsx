import styled from 'styled-components';
import StudentNumberForecastDashboard from '../StudentNumberForecast/StudentNumberForecastDashboard';

const Wrappers = styled.div`

`;

const BudgetForecastPanel = () => {
  return (
    <Wrappers>
      <h4>BudgetForecastPanel</h4>
      <StudentNumberForecastDashboard />
    </Wrappers>
  )
}

export default BudgetForecastPanel;
