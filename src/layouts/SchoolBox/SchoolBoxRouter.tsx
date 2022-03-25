import React from 'react';
import StudentReport from '../../pages/studentReport/StudentReport';
import PageNotFound from '../../components/PageNotFound';

const SchoolBoxRouter = ({path}: {path: string}) => {
  switch (path) {
    case '/report/student': {
      return <StudentReport />;
    }
    default: {
      return <PageNotFound />
    }
  }
}

export default SchoolBoxRouter;
