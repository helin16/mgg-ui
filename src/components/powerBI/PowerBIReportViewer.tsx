import {useEffect, useState} from 'react';
import PowerBIService from '../../services/PowerBIService';
import {Spinner} from 'react-bootstrap';
import {PowerBIEmbed} from 'powerbi-client-react';
import { models } from 'powerbi-client';
import iVStudent from '../../types/Synergetic/iVStudent';
import styled from 'styled-components';

const Wrapper = styled.div`
  .power-bi-report-wrapper {
    height: 100vh;
  }
`;

type iPowerBIReportViewer = {reportId: string; student?: iVStudent};
const PowerBIReportViewer = ({reportId, student}: iPowerBIReportViewer) => {
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [report, setReport] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    if(`${reportId}`.trim() === '') { return }

    setIsLoading(true);
    PowerBIService.getAccessToken()
      .then(resp => {
        if(isCancelled === true) {return}
        setAccessToken(resp.accessToken || '');
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    }

  }, [reportId])

  if (isLoading === true) {
    return <Spinner animation={'border'} />;
  }

  if (accessToken === '' && report === null) {
    return null;
  }

  const getStudentFilters = () => {
    if (!student) {
      return {};
    }
    return {
      filters: [{
        filterType: models.FilterType.Basic,
        $schema: 'http://powerbi.com/product/schema',
        target: {
          table: 'vStudents',
          column: 'ID'
        },
        operator: 'In',
        values: [student.StudentID]
      }]
    };
  }

  return (
    <Wrapper>
      <PowerBIEmbed
        embedConfig={{
          type: 'report',   // Supported types: report, dashboard, tile, visual and qna
          id: reportId,
          embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${reportId}`,
          accessToken,
          tokenType: models.TokenType.Aad,
          settings: {
            filterPaneEnabled: false,
            navContentPaneEnabled: false,
            // background: models.BackgroundType.Transparent
          },
          permissions: models.Permissions.Read,
          viewMode: models.ViewMode.View,
          ...getStudentFilters(),
          pageView: "oneColumn",
        }}

        eventHandlers = {
          new Map([
            ['loaded', function () {console.log('Report loaded');}],
            ['rendered', function () {console.log('Report rendered');}],
            ['error', function (event) { // @ts-ignore
              console.error(event);}]
          ])
        }
        cssClassName = { "power-bi-report-wrapper" }
        getEmbeddedComponent = { (embeddedReport) => {
          // @ts-ignore
          setReport(embeddedReport);
        }}
      />
    </Wrapper>
  )
};

export default PowerBIReportViewer
