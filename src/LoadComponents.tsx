import ReactDOM from "react-dom";
import React, {ReactComponentElement} from "react";
import OnlineDonation from './pages/OnlineDonation/OnlineDonation';
import {ToastContainer} from 'react-toastify';
import AlumniRegistrationForm from './pages/alumni/components/AlumniRegistrationForm';
import AcademicReportsForSchoolBoxId from './pages/studentReport/components/AcademicReportsForSchoolBoxId';

const load = (query: string, component: ReactComponentElement<any>) => {
  const roots = document.querySelectorAll(query) || [];
  // console.log('roots', roots);
  for (let i = 0; i < roots.length; i++) {
    ReactDOM.render(component, roots[i]);
  }
};

const getElement = (element: any) => {
  return (
    // @ts-ignore
    <React.StrictMode>
      {element}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </React.StrictMode>
  )
}

const loadAll = () => {
  load(
    '[mgg-app-loader="online-donation"]',
    getElement(<OnlineDonation />)
  );

  load(
    '[mgg-app-loader="alumni-reg-form"]',
    getElement(<AlumniRegistrationForm />)
  );

  // Student Academic Report
  const urlPattern = /^\/user\/profile\/documents\/reports\/\d+$/;
  const match = window.location.pathname.match(urlPattern);
  if (match) {
    const studentSchoolBoxId = match[1];
    load(
      '#content > .row > div:last-child"]',
      getElement(<AcademicReportsForSchoolBoxId  schoolBoxId={studentSchoolBoxId} />)
    );
  }
}

const LoadComponents = {
  loadAll,
}

export default LoadComponents;
