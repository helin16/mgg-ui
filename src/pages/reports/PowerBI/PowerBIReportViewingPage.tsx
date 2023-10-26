import styled from 'styled-components';
import PowerBIReportViewer from '../../../components/powerBI/PowerBIReportViewer';
import PageNotFound from '../../../components/PageNotFound';

const Wrapper = styled.div``;

type iPowerBIReportViewingPage = {
  reportId?: string;
}
const PowerBIReportViewingPage = ({reportId}: iPowerBIReportViewingPage) => {

  if (!reportId) {
    return <PageNotFound title={'Report Not Found'} description={`The power BI(reportId=${reportId || ''})not found`} />
  }

  return (
    <Wrapper>
      <PowerBIReportViewer reportId={reportId} />
    </Wrapper>
  )
}

export default PowerBIReportViewingPage
