import styled from 'styled-components';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const Wrapper = styled.div`
`;

type iChart = HighchartsReact.Props;
const Chart = (props: iChart) => {
  return (
    <Wrapper>
      <HighchartsReact highcharts={Highcharts} {...props} />
    </Wrapper>
  )
}

export default Chart;
