import React from 'react';
import StudentReport from '../../pages/studentReport/StudentReport';
import OperooSafetyAlertsPage from '../../pages/operoo/OperooSafetyAlertsPage';
// import PageNotFound from '../../components/PageNotFound';

const schoolBoxIframeElementId = 'remote';
const SchoolBoxRouter = ({path}: {path: string}) => {

  const removeSchoolBoxIframe = () => {
    const schoolBoxIframeElement = document.getElementById(schoolBoxIframeElementId);
    if (schoolBoxIframeElement) {
      schoolBoxIframeElement.remove();
    }
  }

  const showSchoolBoxIframe = () => {
    const schoolBoxIframeElement = document.getElementById(schoolBoxIframeElementId);
    if (schoolBoxIframeElement) {
      schoolBoxIframeElement.style.display = 'block';
    }
  }

  switch (path) {
    case '/reports/student': {
      removeSchoolBoxIframe();
      return <StudentReport />;
    }
    case '/operoo/safetyAlerts': {
      removeSchoolBoxIframe();
      return <OperooSafetyAlertsPage />;
    }
    default: {
      showSchoolBoxIframe();
      return null; //<PageNotFound />
    }
  }
}

export default SchoolBoxRouter;
