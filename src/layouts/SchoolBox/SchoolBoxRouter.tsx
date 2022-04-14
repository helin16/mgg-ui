import React from 'react';
import StudentReport from '../../pages/studentReport/StudentReport';
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
    default: {
      showSchoolBoxIframe();
      return null; //<PageNotFound />
    }
  }
}

export default SchoolBoxRouter;
